import React from 'react';
import { Link } from 'react-router-dom';

import ChatroomPreview from './ChatroomPreview';


export default ({
  chatrooms,
  onEnterChatroom
}) => (
  <div>
      <h1 style={{ color: 'white' }}>Select the room to connect the chat <small style={{ color: '#C0C0C0' }}>or <Link style = {{color: '#fafafa'}} to = "/addRoom">create</Link> a new chat</small></h1>
    {
      chatrooms.map(chatroom => (
        <ChatroomPreview
          key={chatroom.name}
          chatroom={chatroom}
          onEnter={() => onEnterChatroom(chatroom.name)}
        />
      ))
    }
  </div>
);
