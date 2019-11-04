module.exports = function ({name}) {
  const members = new Map();
  let chatHistory = [];
  let streamer = null;
  let signals = [];

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
    streamer = client.id;
  }

  function endStream(client) {
    streamer = null;
    signals = [];
  }

  function getStreamer(){
    return streamer;
  }

  function addUser(client) {
    members.set(client.id, client);
  }

  function addSignal(signal) {
    signals.push(signal);
  }

  function getSignals(){
    return signals;
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
      numMembers: members.size,
      streaming: streamer ? true : false
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
    serialize,
    addSignal,
    getSignals
  };
};
