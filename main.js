const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
var cors = require('cors');
const app = express();
const scraper = require('./scraper');
const port = 3000;

app.use(cors());

app.get('/', async(req, res) => {
  res.send(await scraper.scrape())
});

server = http.Server(app);
server.listen(process.env.PORT);
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