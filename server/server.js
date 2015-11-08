'use strict'; // puts us in strict mode (js in hard mode)

// grabs our dependencies
var http = require('http');


// set up the http server
var server = http.createServer()
server.listen(3000); // run on localhost
console.log('HTTP server started on 3000');


// bind socket.io to the http server
var io = require('socket.io')(server);


// test stuff
io.on('connection', function (socket) {
  console.log('Got connection');
  socket.emit('status', {type: 'hello'});
  socket.on('status', function (data) {
    if(data.type == 'hello') {
      console.log('Got HELLO!');
    }
  });
});
