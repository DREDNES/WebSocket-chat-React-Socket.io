const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

app.use(express.static(path.join(__dirname, '/../public')));

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
    handleDisconnect,
    handleAddSignal,
    handleGetSignals,
    getStreamer
  } = makeHandlers(client, clientManager, chatroomManager);

  console.log('client connected...', client.id);
  clientManager.addClient(client);

  client.on('register', handleRegister);

  client.on('join', handleJoin);

  client.on('startStream', handleStreamStart);

  client.on('endStream', handleStreamEnd);

  client.on('getStreamer', getStreamer);

  client.on('leave', handleLeave);

  client.on('signal', (name, signal)=>{
    io.emit('gotSignal', signal);
  });

  client.on('getSignals', handleGetSignals);

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