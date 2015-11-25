'use strict';
var socket = io('http://localhost:3000');

// stores user in channel. It's a dictionary with id as key
// User objects have these fields
//   - id     (user id)
//   - name   (user name)
//   - string (string representation)
var users = {};

// stores the client user id
// hence users[me] or users.me gives the client user
var me = socket.id;

// ---------------------
//    SOCKET HANDLERS
// ---------------------

/**
 * Handles STATE events.
 * These are fired when the client first connects,
 * the data object contains:
 *   - users (list of user objects currently connected)
 *   - user  (the id of the current client)
 */
socket.on('STATE', function (data) {
  users = data.users;
  me = data.user;
  console.log(':STATE - Users in channel: ' + getUserList());

  postMessage(infoColor, 'Hello! You name is ' + users[me].name + '. Currently,'
              + ' these people are chatting: <br>' + getUserList());
});

/**
 * Handles JOINED events.
 * When a new user joins.
 * Data object contains:
 *   - user (the user that just joined)
 */
socket.on('JOINED', function (data) {
  var user = data.user;
  users[user.id] = user;
  console.log(':JOINED - ' + user.string);

  postMessage(infoColor, user.name + ' just joined the channel!');
});

/**
 * Handles LEFT events.
 * Deletes users who leave.
 * Data object:
 *   - user (the user that left)
 */
socket.on('LEFT', function (data) {
  var user = data.user;
  console.log(':LEFT - ' + user.string);
  delete users[user.id];

  postMessage(infoColor, user.name + ' just left :(');
});

/**
 * Handles MESG events.
 * For messages to the client.
 * Data object:
 *   - from    (the NAME of the user the message is from)
 *   - message (the message)
 */
socket.on('MESG', function (data) {
  console.log(':MSG - <' + data.from + '> ' + data.message);

  postMessage(messageColor, formatMessage(data.from, data.message));
});

/**
 * Handles NAME events.
 * Updates a users name.
 * Data object:
 *   - user (the updated user object)
 */
socket.on('NAME', function (data) {
  var user = data.user;
  var old = users[user.id];
  users[user.id] = user;
  
  console.log(':NAME - <' + old.string + '> changed to <' + user.name + '>');

  postMessage(infoColor,
              '<' + old.name + '> changed their name to <' + user.name + '>');
});

/**
 * Handles ERROR events.
 * Data object:
 *   - message
 */
socket.on('ERROR', function (data) {
  console.log(':ERROR - ' + data.message);

  postMessage(errorColor, 'ERROR: ' + data.message);
});



// ---------------
//     HELPERS
// ---------------

/**
 * Showcases functional Javascript (_.fold) and ternary operators
 * to get a list of the users currently chatting
 */
function getUserList() {
  return _.reduce(users,
                  function (rest, user) { 
                    return (rest ? rest + ', ' : '') + user.name;
                  },
                  ''
                 );
}

/**
 * Sends a MESG to the server
 */
function sendMessage(message) {
  socket.emit('MESG', {message: message});
}

/**
 * Sends a NAME message to the server
 * changing this users name
 */
function setName(newName) {
  socket.emit('NAME', {newName: newName});
}
