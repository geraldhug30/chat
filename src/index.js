const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const {
  generateMessage,
  generateLocationMessage
} = require('./utils/messages');
require('dotenv').config();
const {
  addUsers,
  removeUsers,
  getUsers,
  getUsersInRoom
} = require('./utils/users');
/* 
notes:
-send data to chat.js
socket.emit = send data to specific
io.emit = send data to all client and update
socket.broadcast.emit = send data to every connected client accept itself
io.to.emit - send specific person or client
socket.broadcast.to.emit = send data to every connected client accept itself
*/

// config
const app = express();
const server = http.createServer(app);
const port = process.env.PORT;
const io = socketio(server);

app.use(express.static('public'));

// connection to server
io.on('connection', socket => {
  //addUsers(socket);

  socket.on('join', (options, callback) => {
    const { error, user } = addUsers({
      id: socket.id,
      ...options
    });

    if (error) {
      return callback(error);
    }

    socket.join(user.roomNumber);
    socket.emit('textUpdated', generateMessage('Admin', 'Welcome'));
    socket.broadcast
      .to(user.roomNumber)
      .emit(
        'textUpdated',
        generateMessage('Admin', `${user.name} has joined the chat`)
      );
    io.to(user.roomNumber).emit('roomData', {
      room: user.roomNumber,
      users: getUsersInRoom(user.roomNumber)
    });
    callback();
  });

  // .on response in emit in chat.js
  socket.on('sendMessage', (message, cb) => {
    // io - pass data for all client and chat to be updated
    // bad word prevent
    // const Filter = require('bad-word');
    // const filter = new Filter()
    // if(filter.isProfane(message)) cb('bad words are not allowed');

    const user = getUsers(socket.id);
    io.to(user.roomNumber).emit(
      'textUpdated',
      generateMessage(user.name, message)
    );
    // send message if the message delivered
    cb();
  });

  socket.on('sendLocation', ({ latitude, longitude }, callback) => {
    const user = getUsers(socket.id);
    console.log(user.name);
    io.emit(
      'textUpdated',
      generateLocationMessage(
        user.name,
        `<a target="_blank" href="https://google.com/maps?q=${latitude},${longitude}">Your location</a>`
      )
    );
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUsers(socket.id);
    if (user) {
      io.to(user.roomNumber).emit(
        'textUpdated',
        generateMessage('Admin', `${user.name} has left the chat`)
      );
      io.to(user.roomNumber).emit('roomData', {
        room: user.roomNumber,
        users: getUsersInRoom(user.roomNumber)
      });
    }
  });
});

server.listen(port, err => {
  if (err) console.log(err);
  console.log(`app is running on port ${port}`);
});
