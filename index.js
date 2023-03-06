const sqlite3 = require('sqlite3').verbose();
const md5 = require('md5');
const { 
  v1: uuidv1,
  v4: uuidv4,
} = require('uuid');
const Server = require('./server');

let db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');

    const server = new Server();
    const io = server.start();

    initIo(io);
  }
});

process.on('exit', function() {
  db.close();
});

function initIo(io) {
  io.on('connection', (socket) => {
    socket.on('login', async (data) => {
      if (data.key === null) {
        // a new user is trying to login
        const key = md5(uuidv1());
        const username = 'Guest';
        const balance = 10000.00;
        try {
          await createNewUser(username, balance, key);

          socket.emit('login', {
            status: 'logged-in',
            key,
            username,
            balance,
          });
        } catch (err) {
          console.log(err);
        }
      } else if (data.key) {
        // a user is trying to login with local key
        try {
          const user = await getUser(data.key);

          socket.emit('login', {
            status: 'logged-in',
            key: data.key,
            username: user.username,
            balance: user.balance,
          });
        } catch (err) {
          console.log(err);
        }
      }
    });

    socket.on('gamestate', async (data) => {
      try {
        const account = await getUser(data.key);
        const gamestate = await getOrCreateGamestate(account.id, data.gameId);

        socket.emit('gamestate', {
          balance: account.balance,
          bet: gamestate.bet,
          coinValue: gamestate.coin_value,
          reels: JSON.parse(gamestate.reels),
        });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('bet', async (data) => {
      try {
        const account = await getUser(data.key);
        const betValue = Math.round((data.bet * data.coinValue) * 100) / 100;
        if (account.balance >= betValue) {
          const newBalance = Math.round((account.balance - betValue) * 100) / 100;
          const betResult = generateBetResult(data.gameId);

          await updateBalance(account.id, newBalance);
          await updateGamestate(account.id, data.gameId, data.bet, data.coinValue, JSON.stringify(betResult.position));

          socket.emit('bet', {
            balance: newBalance,
            reels: betResult.position,
          });
        }
      } catch (err) {
        console.log(err);
      }
    });
  });
}

function generateRandomReelsPosition(gameId) {
  const position = [];

  switch (gameId) {
    case 'rock-climber':
      const reelsCount = 5;
      const reelPositions = 3;
      const symbolsCount = 8;
      for (let i = 0; i < reelsCount; i++) {
        position.push(Array.from(Array(reelPositions + 1)).map(() => {
          return parseInt(Math.random() * symbolsCount) + 1;
        }));
      }
      break;
  }

  return position;
}

function generateBetResult(gameId) {
  const result = {};

  switch (gameId) {
    case 'rock-climber':
      const position = generateRandomReelsPosition(gameId);
      result.position = position;
      break;
  }

  return result;
}

function createNewUser(username, balance, key) {
  let resolveFn;
  let rejectFn;
  const creationPromise = new Promise((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;
  });

  db.run(`INSERT INTO accounts (username, balance, key) VALUES (?, ?, ?)`, [username, balance, key], function(err) {
    if (err) {
      rejectFn(err.message);
    } else {
      resolveFn(this.lastID);
    }
  });

  return creationPromise;
}

function getUser(key) {
  let resolveFn;
  let rejectFn;
  const getUserPromise = new Promise((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;
  });

  db.all(`SELECT * FROM accounts WHERE key = ?`, [key], function(err, rows) {
    if (err) {
      rejectFn(err.message);
    } else {
      if (rows.length === 1) {
        db.run(`UPDATE accounts SET last_login = ? WHERE id = ?`, [(new Date()).getTime(), rows[0].id], function(err) {
          if (err) {
            rejectFn(err.message);
          } else {
            resolveFn(rows[0]);
          }
        });
      } else {
        rejectFn('Invalid key. Cannot get user.');
      }
    }
  });

  return getUserPromise;
}

function getOrCreateGamestate(userId, gameId) {
  let resolveFn;
  let rejectFn;
  const getGamestatePromise = new Promise((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;
  });

  db.all(`SELECT * FROM gamestates WHERE user_id = ? AND game_id = ?`, [userId, gameId], async function(err, rows) {
    if (err) {
      rejectFn(err.message);
    } else {
      if (rows.length === 1) {
        // retrieve gamestate
        resolveFn(rows[0]);
      } else {
        // create new gamestate
        const bet = 10;
        const coinValue = 0.10;
        const reels = JSON.stringify(generateRandomReelsPosition(gameId));
        
        const newGamestate = await new Promise((resolve) => {
          db.run(`INSERT INTO gamestates (user_id, game_id, reels, bet, coin_value) VALUES (?, ?, ?, ?, ?)`, [
            userId,
            gameId,
            reels,
            bet,
            coinValue,
          ], function(err) {
            if (err) {
              rejectFn(err.message);
            } else {
              resolve({ reels, bet, coin_value: coinValue });
            }
          });
        });

        resolveFn(newGamestate);
      }
    }
  });

  return getGamestatePromise;
}

function updateBalance(userId, value) {
  let resolveFn;
  let rejectFn;
  const updateBalancePromise = new Promise((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;
  });

  db.run(`UPDATE accounts SET balance = ? WHERE id = ?`, [value, userId], function(err) {
    if (err) {
      rejectFn(err.message);
    } else {
      resolveFn();
    }
  });

  return updateBalancePromise;
}

function updateGamestate(userId, gameId, bet, coinValue, reelsPosition) {
  let resolveFn;
  let rejectFn;
  const updateGamestatePromise = new Promise((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;
  });

  db.run(`UPDATE gamestates SET reels = ?, bet = ?, coin_value = ? WHERE user_id = ? AND game_id = ?`, [
    reelsPosition,
    bet,
    coinValue,
    userId,
    gameId,
  ], function(err) {
    if (err) {
      rejectFn(err.message);
    } else {
      resolveFn();
    }
  });

  return updateGamestatePromise;
}