const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
var cors = require('cors');
const app = express();
const scraper = require('./scraper');
var port = 3000;

port = process.env.PORT ?? port;

app.use(cors());

app.get('/', async(req, res) => {
  res.send(await scraper.scrape())
});

server = http.Server(app);
server.listen(port, '0.0.0.0');
console.log(`Example app listening on port ${port}`);

io = socketIO(server, {cors : {
    origins: ['*'],
}});

scraper.open(io);

io.on('connection', function (socket) {
  socket.emit('combatants', {
      combatants: scraper.scrape()
  });
});