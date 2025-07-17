const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', socket => {
  console.log('Player connected:', socket.id);
  socket.on('move', data => socket.broadcast.emit('move', { x: data.x, id: socket.id }));
  socket.on('disconnect', () => socket.broadcast.emit('leave', socket.id));
});

http.listen(3000, () => console.log('Server listening on port 3000'));
