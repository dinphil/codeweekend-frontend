'use strict';
var socket = io('http://localhost:3000');

socket.on('status', function (data) {
  if(data.type === 'hello');
  console.log('Got HELLO');
  socket.emit('status', {type: 'hello'});
});
