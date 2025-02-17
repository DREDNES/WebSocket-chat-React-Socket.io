import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import MainLayout from './MainLayout';
import Home from './Home';
import Loader from './Loader';
import UserSelection from './UserSelection';
import ChatroomNameInput from './ChatroomNameInput';
import Chatroom from './Chatroom';
import socket from './socket';

export default class Root extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      user: null,
      isRegisterInProcess: false,
      client: socket(),
      chatrooms: null,
      clientId: '',
    };

    this.onEnterChatroom = this.onEnterChatroom.bind(this);
    this.onLeaveChatroom = this.onLeaveChatroom.bind(this);
    this.getChatrooms = this.getChatrooms.bind(this);
    this.register = this.register.bind(this);
    this.addChatroom = this.addChatroom.bind(this);
    this.renderUserSelectionOrRedirect = this.renderUserSelectionOrRedirect.bind(this);
    
    this.getClientId();
    this.getChatrooms();
  }

  onEnterChatroom(chatroomName, onNoUserSelected, onEnterSuccess) {
    if (!this.state.user)
      return onNoUserSelected();

    return this.state.client.join(chatroomName, (err, chatHistory) => {
      if (err)
        return console.error(err);
      return onEnterSuccess(chatHistory);
    });
  }

  onLeaveChatroom(chatroomName, onLeaveSuccess) {
    this.state.client.leave(chatroomName, (err) => {
      if (err)
        return console.error(err);
      return onLeaveSuccess();
    });
  }

  getClientId() {
    this.state.client.getClientId((err, clientId) => {
      this.setState({ clientId });
    });
  }
  getChatrooms() {
    this.state.client.getChatrooms((err, chatrooms) => {
      this.setState({ chatrooms });
    });
  }

  register(name) {
    const onRegisterResponse = user => this.setState({ isRegisterInProcess: false, user });
    this.setState({ isRegisterInProcess: true });
    this.state.client.register(name, (err, user) => {
      if (err) return onRegisterResponse(null);
      return onRegisterResponse(user);
    });
  }

  addChatroom(name) {
    this.state.client.addChatroom(name);
    this.getChatrooms();
  }

  LogOut() {
    window.location.replace('/');
  }

  renderUserSelectionOrRedirect(renderUserSelection) {
    if (this.state.user) {
      return <Redirect to="/" />;
    }

    return this.state.isRegisterInProcess
      ? <Loader />
      : renderUserSelection();
  }

  renderChatroomOrRedirect(chatroom, { history }) {
    if (!this.state.user) {
      return <Redirect to="/" />
    }

    const { chatHistory } = history.location.state;
    

    return (
      <Chatroom
        chatroom={chatroom}
        chatHistory={chatHistory}
        user={this.state.user}
        getOnlineUsers = {this.state.client.getOnlineUsers}
        startStream = {this.state.client.startStream}
        endStream = {this.state.client.endStream}
        getStreamer = {this.state.client.getStreamer}
        onLeave={
          () => this.onLeaveChatroom(
            chatroom.name,
            () => history.push('/')
          )
        }
        onSendMessage={
          (message, time, cb) => this.state.client.message(
            chatroom.name,
            message,
            time,
            cb
          )
        }
        registerHandler={this.state.client.registerHandler}
        unregisterHandler={this.state.client.unregisterHandler}
      />
    )
  }

  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider>
          <MainLayout
            user={this.state.user}
            LogOut={() => this.LogOut()}
          >
            {
              !this.state.chatrooms
                ? <Loader />
                : (
                  <Switch>
                    <Route
                      exact
                      path="/"
                      render={
                        props => (
                          <Home
                            user={this.state.user}
                            chatrooms={this.state.chatrooms}
                            onChangeUser={() => props.history.push('/user')}
                            onEnterChatroom={
                              chatroomName => this.onEnterChatroom(
                                chatroomName,
                                () => props.history.push('/user'),
                                chatHistory => props.history.push({
                                  pathname: chatroomName,
                                  state: { chatHistory }
                                })
                              )
                            }
                          />
                        )
                      }
                    />
                    <Route
                      exact
                      path="/user"
                      render={
                        (props) => {
                          const toHome = () => props.history.push('/')
                          return this.renderUserSelectionOrRedirect(() => (
                            <UserSelection
                              close={toHome}
                              client = {this.state.client}
                              clientId = {this.state.clientId}
                              register={name => this.register(name, toHome)}
                            />
                          ))
                        }
                      }
                    />
                    <Route
                      exact
                      path="/addRoom"
                      render={
                        (props) => {
                          const toHome = () => props.history.push('/')
                          return <ChatroomNameInput
                              close={toHome}                      
                              addChatroom={name => this.addChatroom(name, toHome)}
                            />
                          
                        }
                      }
                    />
                    {
                      this.state.chatrooms.map(chatroom => (
                        <Route
                          key={chatroom.id}
                          exact
                          path={`/${chatroom.name}`}
                          render={
                            props => this.renderChatroomOrRedirect(chatroom, props)
                          }
                        />
                      ))
                    }
                  </Switch>
                )
            }
          </MainLayout>
        </MuiThemeProvider>
      </BrowserRouter>
    )
  }
}
