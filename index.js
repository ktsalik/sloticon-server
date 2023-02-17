const sqlite3 = require('sqlite3').verbose();
const md5 = require('md5');
const { 
  v1: uuidv1,
  v4: uuidv4,
} = require('uuid');
const Server = require('./server');

let db = new sqlite3.Database('./d83c1db25e5ff24f29560bf6b0305310.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the chinook database.');

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
    socket.on('login', (data) => {
      console.log('login', data);
      if (data.key === null) {
        const newKey = md5(uuidv1());
        const balance = 100000;
        db.run(`INSERT INTO accounts (username, balance, key) VALUES (?, ?, ?)`, ['Guest', balance, newKey], function(err) {
          if (err) {
            console.log(err.message);
          } else {
            socket.emit('login', {
              status: 'logged-in',
              key: newKey,
              balance: balance,
            });
          }
        });
      } else {
        db.all(`SELECT * FROM accounts WHERE key = ?`, [data.key], function(err, rows) {
          if (err) {
            console.log(err.message);
          } else {
            if (rows.length === 1) {
              socket.emit('login', {
                status: 'logged-in',
                key: data.key,
                balance: rows[0].balance,
              });
            } else {
              // invalid login key
            }
          }
        })
      }
    });
  });
}