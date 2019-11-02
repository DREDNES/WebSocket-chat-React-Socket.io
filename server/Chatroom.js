module.exports = function ({name}) {
  const members = new Map();
  let chatHistory = [];
  let nowStreaming = null;

  function broadcastMessage(message) {
    members.forEach(m => m.emit('message', message));
  }

  function addEntry(entry) {
    chatHistory = chatHistory.concat(entry);
  }

  function getChatHistory() {
    return chatHistory.slice();
  }

  function startStream(client) {
    nowStreaming = {"id" : client.id};
  }

  function endStream(client) {
    nowStreaming = null;
  }

  function getStreamer(){
    return nowStreaming;
  }

  function addUser(client) {
    members.set(client.id, client);
  }

  function removeUser(client) {
    members.delete(client.id);
  }

  function getOnlineUsers() {
    return Array.from( members.keys() );
  }

  function serialize() {
    return {
      name,
      numMembers: members.size
    };
  }

  return {
    broadcastMessage,
    addEntry,
    getChatHistory,
    addUser,
    removeUser,
    startStream,
    endStream,
    getOnlineUsers,
    getStreamer,
    serialize
  };
};
