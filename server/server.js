'use strict'; // puts us in strict mode (js in hard mode)

// gets imports
let Moniker = require('moniker');
let _ = require('underscore');
let User = require('./user');


// sets up the server
let Server = require('socket.io');
let io = Server(3000); //construct a server on port 3000
console.log('SocketIO listening on port 3000');



// stores the users
// it's a dictionary where the userID is the key
let users = {};

// SOCKET HANDLER FUNCTIONS
io.on('connection', (socket) => {
  // on 'connection' we need to set some stuff up
  let name = getUniqueName(); // get a unique name
  let user = User(socket, name); // create a User (showcases factories)
  users[socket.id] = user; // adds user to dictionary
  console.log(`:CONNECTION - ${user.toString()})`);

  // emit the current state to the new user
  socket.emit('STATE', {
    users: _.mapObject(users, (user) => user.toObj()), //_ for functional js
    user: user.getId()
  });

  // emit the new JOIN for all the other users
  socket.broadcast.emit('JOINED', {user: users[socket.id].toObj()});

  // -----------------
  //  SOCKET HANDLERS
  // -----------------
  /**
   * Handles MESG
   * When a client tries to speak
   * Data object contains:
   *   - message
   */
  socket.on('MESG', (data) => {
    let user = users[socket.id];
    console.log(`:MESG - <${user.getName()}> ${data.message}`);
    
    let message = {
      from: user.getName(),
      message: data.message
    };

    io.emit('MESG', message); // broadcast the message everywhere
  });

  /**
   * Handles NAME
   * When a client tries to change their name
   * Data object contains:
   *   - newName
   */
  socket.on('NAME', (data) => {
    let user = users[socket.id];
    console.log(`:NAME - <${user.getName()}> wants to change name to`
                + ` <${data.newName}>`);

    if(isUniqueName(data.newName)) {
      // success!
      console.log(
        `:NAME - <${user.getName()}> changed name to <${data.newName}>`);
      user.setName(data.newName);
      io.emit('NAME', {user: user.toObj()});
    } else {
      // failure :(
      console.log(':ERROR - NON_UNIQUE_NAME');
      socket.emit('ERROR', {message: 'NON_UNIQUE_NAME'});
    }
  });


  /** Handles diconnect */
  socket.on('disconnect', () => {
    let user = users[socket.id];
    console.log(`:LEFT - ${user.toString()})`);
    socket.broadcast.emit('LEFT', {user: user.toObj()});
    delete users[socket.id];
  });
});



// HELPER FUNCTIONS
/**
 * Sees if a name is unique
 * @param name The name to check
 * @return boolean true if the name is unique
 */
function isUniqueName(name) {
  let names = _.mapObject(users, (user) => user.getName().toLowerCase());
  return !_.contains(names, name.toLowerCase());
}

/**
 * Gets a unique name using Moniker (showcases basic npm modules)
 * @return String a unique name
 */
function getUniqueName() {
  let name = Moniker.choose();
  while(!isUniqueName(name)) {
    name = Moniker.choose();
  }

  return name;
}
