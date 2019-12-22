function makeHandleEvent(client, clientManager, chatroomManager) {
  function ensureExists(getter, rejectionMessage) {
    return new Promise(function (resolve, reject) {
      const res = getter();
      return res
        ? resolve(res)
        : reject(rejectionMessage);
    });
  }

  function ensureUserSelected(clientId) {
    return ensureExists(
      () => clientManager.getUserByClientId(clientId),
      'select user first'
    );
  }

  function ensureValidChatroom(chatroomName) {
    return ensureExists(
      () => chatroomManager.getChatroomByName(chatroomName),
      `invalid chatroom name: ${chatroomName}`
    );
  }

  function ensureValidChatroomAndUserSelected(chatroomName) {
    return Promise.all([
      ensureValidChatroom(chatroomName),
      ensureUserSelected(client.id)
    ])
      .then(([chatroom, user]) => Promise.resolve({ chatroom, user }));
  }

  function handleEvent(chatroomName, createEntry) {
    return ensureValidChatroomAndUserSelected(chatroomName)
      .then(function ({ chatroom, user }) {
        // append event to chat history
        const entry = { user, ...createEntry() };
        chatroom.addEntry(entry);

        // notify other clients in chatroom
        chatroom.broadcastMessage({ chat: chatroomName, ...entry });
        return chatroom;
      });
  }

  return handleEvent;
}

module.exports = function (client, clientManager, chatroomManager) {
  const handleEvent = makeHandleEvent(client, clientManager, chatroomManager);

  function handleRegister(userName, callback) {
    const user = JSON.parse(userName);
    clientManager.registerClient(client, user);
    return callback(null, user);
  }

  function handleJoin(chatroomName, callback) {
    const createEntry = () => ({ event: `joined ${chatroomName}` });

    handleEvent(chatroomName, createEntry)
      .then(function (chatroom) {
        // add member to chatroom
        chatroom.addUser(client);

        // send chat history to client
        callback(null, chatroom.getChatHistory());
      })
      .catch(callback);
  }

  function getStreamer(chatroomName, callback) {
    return  callback(null, chatroomManager.getChatroomByName(chatroomName).getStreamer());
  }

  function handleStreamStart(chatroomName, callback) {
    const createEntry = () => ({ event: 'starts streaming' });
    handleEvent(chatroomName, createEntry)
      .then(function (chatroom) {
       
        chatroom.startStream(client);

        callback(null, chatroom.getStreamer());

      })
      .catch(callback);
  }

  function handleStreamEnd(chatroomName, callback) {
    const createEntry = () => ({ event: 'finished streaming' });
    handleEvent(chatroomName, createEntry)
      .then(function (chatroom) {
       
        chatroom.endStream(client);

        callback(null, chatroom.getStreamer());

      })
      .catch(callback);
  }

  function handleLeave(chatroomName, callback) {
    const createEntry = () => ({ event: `left ${chatroomName}` });
    handleEvent(chatroomName, createEntry)
      .then(function (chatroom) {
        // remove member from chatroom
        chatroom.removeUser(client);
        console.log(chatroom.getOnlineUsers()
        .map(clientId => clientManager.getUserByClientId(clientId)));

        callback(null);
      })
      .catch(callback);
  }

  function handleOnlineUsers(chatroomName, callback) {
    return callback(null, chatroomManager.getChatroomByName(chatroomName)
                                         .getOnlineUsers()
                                         .map(clientId => clientManager.getUserByClientId(clientId)));

  }

  function handleGetSignals(chatroomName, callback) {
    return callback(null, chatroomManager.getChatroomByName(chatroomName)
                                         .getSignals());

  }

  function handleAddSignal(chatroomName, signal, callback) {
    console.log("HI");
   
    chatroomManager.getChatroomByName(chatroomName).addSignal(signal);
  }

  function handleMessage({ chatroomName, message, time } = {}, callback) {
    const createEntry = () => ({ message, time });

    handleEvent(chatroomName, createEntry)
      .then(() => callback(null))
      .catch(callback);
  }

  function handleAddChatroom(name) {
    chatroomManager.addChatroom(name);
  }

  function getClientId(_, callback) {
    return callback(null, client.id);
  }

  function handleGetChatrooms(_, callback) {
    return callback(null, chatroomManager.serializeChatrooms());
  }

  function handleDisconnect() {
    // remove user profile
    clientManager.removeClient(client);
    // remove member from all chatrooms
    chatroomManager.removeClient(client);
  }

  return {
    handleRegister,
    handleJoin,
    handleLeave,
    handleMessage,
    handleAddChatroom,
    handleGetChatrooms,
    getClientId,
    handleDisconnect,
    handleOnlineUsers,
    handleStreamStart, 
    handleStreamEnd,
    handleGetSignals,
    handleAddSignal,
    getStreamer
  };
};
