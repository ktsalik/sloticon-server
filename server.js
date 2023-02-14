const express = require('express')

class Server {
  constructor() {
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(express.static(__dirname + '/public'));

    app.get('/', (req, res) => {
      res.sendFile(__dirname + 'public/index.html');
    });

    this.app = app;
    this.port = port;
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`)
    });
  }
}

module.exports = Server;