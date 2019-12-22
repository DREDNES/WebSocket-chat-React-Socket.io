const Chatroom = require('./Chatroom');
const chatroomTemplates = require('../config/chatrooms');

module.exports = function () {
  // mapping of all available chatrooms
  let chatrooms = new Map(
    chatroomTemplates.map(c => {
      c.name = createCombinedName(c.id, c.name);
      return [c.name, Chatroom(c)];
    })
  );

  function createCombinedName(id, name) {
    return `${name} #${id}`;
  }

  function removeClient(client) {
    chatrooms.forEach(c => {
      if(c.getStreamer() == client.id) {
        c.endStream();
      }
      c.removeUser(client);
    });
  }

  function addChatroom(name) {
    name = createCombinedName(createUniqueID(), name);
    chatrooms.set(name, Chatroom({'name' : name}));
  }

  function RandomInt() {
    min = Math.ceil(10000);
    max = Math.floor(100000);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function createUniqueID() {
    let id = RandomInt();
    while (serializeChatrooms().some(c => c.id === id)){
     id = RandomInt();
    } 
    return id;
  }

  function getChatroomByName(chatroomName) {
    return chatrooms.get(chatroomName);
  }

  function serializeChatrooms() {
    return Array.from(chatrooms.values()).map(c => c.serialize());
  }

  return {
    removeClient,
    addChatroom,
    getChatroomByName,
    serializeChatrooms
  };
};
