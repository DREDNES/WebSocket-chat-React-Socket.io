// const express = require('express');
// const app = express();

// const server = require('http').Server(app);
// const io = require('socket.io')(server);



const server = require('http').createServer();
const io = require('socket.io')(server);

server.listen(3000, function (err) {
  if (err) throw err;
  console.log('listening on port 3000');
});
//app.use(express.static('./public'));

const ClientManager = require('./ClientManager');
const ChatroomManager = require('./ChatroomManager');
const makeHandlers = require('./handlers');

const clientManager = ClientManager();
const chatroomManager = ChatroomManager();

io.on('connection', function (client) {
  const {
    handleRegister,
    handleJoin,
    handleLeave,
    handleStreamStart,
    handleStreamEnd,
    getClientId,
    handleMessage,
    handleGetChatrooms,
    handleOnlineUsers,
    handleAddChatroom,
    handleDisconnect
  } = makeHandlers(client, clientManager, chatroomManager);

  console.log('client connected...', client.id);
  clientManager.addClient(client);

  client.on('register', handleRegister);

  client.on('join', handleJoin);

  client.on('startStream', handleStreamStart);

  client.on('endStream', handleStreamEnd);

  client.on('leave', handleLeave);

  client.on('getClientId', getClientId);

  client.on('message', handleMessage);

  client.on('chatrooms', handleGetChatrooms);
  
  client.on('onlineUsers', handleOnlineUsers);

  client.on('addChatroom', handleAddChatroom);

  client.on('disconnect', function () {
    console.log('client disconnect...', client.id);
    handleDisconnect();
  });

  client.on('error', function (err) {
    console.log('received error from client:', client.id);
    console.log(err);
  });
});