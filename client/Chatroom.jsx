import React from 'react';
import styled from 'styled-components';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import { List, ListItem } from 'material-ui/List';
import OnlineUsers from './OnlineUsers';
import VideoContainer from './VideoContainer';
import Send from 'material-ui/svg-icons/content/send';
import StreamOn from 'material-ui/svg-icons/Av/videocam';
import StreamOff from 'material-ui/svg-icons/Av/videocam-off';


const ChatWindow = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;
const ChatPanel = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  z-index: 1;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 20px ;
  z-index: 1;
  color: #fafafa !important;
  border-bottom: 1px rgba(242, 242, 242, 0.5) solid;
  border-top: 1px rgba(242, 242, 242, 0.5) solid;
`;

const Title = styled.p`
  text-align: center;
  font-size: 24px;
`;

const NoDots = styled.div`
  hr {
    visibility: hidden;
  }
`;

const OutputText = styled.div`
  white-space: normal !important;
  word-break: break-all !important;
  overflow: initial !important;
  width: 100%;
  text-align:right;
  height: auto !important;
  color: #fafafa !important;
`;

const InputPanelWrap = styled.div`
  padding: 1em;
  background-color: transparent;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Scrollable = styled.div`
  height: 100%;
  width: 100%;
  overflow: auto;
`;

const MessageWrap = styled.div`
background-color: rgba(242, 242, 242, 0.5);
padding: 10px;
margin: 0 1em;
border-radius: 15px;
width: fit-content;
max-width: 90%;
display: inline-block;
`;

const ListItemWrap = styled.div`
display: inline-block;
`;

const StyledTextField = styled.textarea`
  width: 70%;  
  resize: none;
  background-color: rgba(242, 242, 242, 0.5);
  border: none;
  border-radius: 15px;
  padding: 10px;
  font-size: 16px;
  
  outline:none;
  border: none;
`;

const SendButton = styled.button`
  width: 15%; 
  resize: none;
  background-color: rgba(242, 242, 242, 0.5);
  border-radius: 15px;
  padding: 10px;
  
  
  outline:none;
  border: none;
  cursor: pointer; 
  transition: 0.2s; 
  
  :hover{
    box-shadow: 0 0 7px rgba(0,0,0,0.5);
    cursor: pointer;  
  }
  :active{
    box-shadow: 0 0 3px rgba(0,0,0,0.5) inset;
    cursor: pointer;  
  }
`;

const HeaderButtonsWrap = styled.div`
  display: inline-block;
  margin: 0 10px;
`;

export default class Chatroom extends React.Component {
  constructor(props, context) {
    super(props, context);

    const { chatHistory } = props;

    this.state = {
      chatHistory,
      input: '',
      onlineUsers: null,
      streamer: null
    };

    this.onInput = this.onInput.bind(this);
    this.toogleStream = this.toogleStream.bind(this);
    this.onSendMessage = this.onSendMessage.bind(this);
    this.onMessageReceived = this.onMessageReceived.bind(this);
    this.updateChatHistory = this.updateChatHistory.bind(this);
    this.scrollChatToBottom = this.scrollChatToBottom.bind(this);

    this.getOnlineUsers();
  }

  getOnlineUsers() {
    this.props.getOnlineUsers(this.props.chatroom.name, (err, onlineUsers) => {
      if(err) console.error(err);
      this.setState({ onlineUsers });
    });
  }

  componentDidMount() {
    this.props.registerHandler(this.onMessageReceived);
    this.scrollChatToBottom();
  }

  componentDidUpdate() {
    this.scrollChatToBottom();
  }

  componentWillUnmount() { 
    this.props.unregisterHandler();
  }

  onInput(e) {
    this.setState({
      input: e.target.value
    });
  }

  onSendMessage() {
    if (!this.state.input) return;
    this.props.onSendMessage(this.state.input, Date().match(/([a-zA-Z]{3}\s\d{2}\s\d{4}\s)([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])/)[0], (err) => {
      if (err)
        return console.error(err);
      return this.setState({ input: '' });
    });
  }

  onMessageReceived(entry) {
    console.log('onMessageReceived:', entry);
    this.updateChatHistory(entry);
    if (entry.event.includes('joined' || 'left')) {
      this.getOnlineUsers();
    }
  }

  updateChatHistory(entry) {
    this.setState({ chatHistory: this.state.chatHistory.concat(entry) });
  }

  scrollChatToBottom() {
    this.panel.scrollTo(0, this.panel.scrollHeight);
  }
  
  toogleStream() {
    if(this.state.streamer) {
      this.onStreamEnded();
    } else {
      this.onStreamStarted();
    }
  }

  onStreamEnded() {
    this.props.endStream(this.props.chatroom.name, (err, streamer) => {
      if (err)
        return console.error(err);
      return this.setState({ streamer });
    });
  }

  onStreamStarted() {

    this.props.startStream(this.props.chatroom.name, (err, streamer) => {
      if (err)
        return console.error(err);
      return this.setState({ streamer });
    });

  }

  renderMessage(user, message, i, event ,time) {
    if (event) {
      return <ListItem
        key={i}
        style={{ color: '#fafafa', display:'flex', justifyContent: 'center'}}
        primaryText={
          <ListItemWrap>
              <OutputText>
              { user.name } { event }
              </OutputText>
          </ListItemWrap>    
        }
      />
    }
    time = time.match(/([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])/)[0]; 
    if (this.props.user.id == user.id) {
      return <ListItem
        key={i}
        style={{ color: '#fafafa', display:'flex', justifyContent: 'flex-end'}}
        primaryText={
          <ListItemWrap>
            <MessageWrap>
              <OutputText>
                { message }
              </OutputText>
            </MessageWrap>
            { "You" }
          </ListItemWrap>
        }
        secondaryText={
          <div style={{ textAlign: 'left', color: 'rgba(242, 242, 242, 0.5)'}}>{time}</div>
        }
      />
    } else {
      return <ListItem
        key={i}
        style={{ color: '#fafafa', display:'flex', justifyContent: 'flex-start' }}
        primaryText={
            <ListItemWrap>
              { user.name }
              <MessageWrap>
                <OutputText>
                  { message }
                </OutputText>
              </MessageWrap>
            </ListItemWrap>
        }
        secondaryText={
          <div style={{ textAlign: 'right', color: 'rgba(242, 242, 242, 0.5)'}}>{time}</div>
        }
      />
    }
  }

  render() {
    return (
      <div style={{ height: '90%', marginTop: 20 }}>
        {
            this.state.onlineUsers ? (
            <OnlineUsers users = {this.state.onlineUsers}/>
          ) : ''
        }
        <ChatWindow>
          <Header>
            <Title>
              { this.props.chatroom.name }
            </Title>
            <div>
            <HeaderButtonsWrap>
            <FlatButton
              default
              backgroundColor='rgba(242, 242, 242, 0.5)'
              icon={
                this.state.streamer ? <StreamOff color = '#fafafa'/> : <StreamOn color = '#fafafa'/> 
              }
              onClick={this.toogleStream}
            />
             </HeaderButtonsWrap>
             <HeaderButtonsWrap>
            <FlatButton
              default
              backgroundColor='rgba(242, 242, 242, 0.5)'
              icon={
                <FontIcon
                  style={{ fontSize: 24, color:'#fafafa' }}
                  className="material-icons"
                >
                  {'close'}
                </FontIcon>
              }
              onClick={this.props.onLeave}
            />
            </HeaderButtonsWrap>
            </div>
          </Header>
          <ChatPanel>
            {this.state.streamer ? <VideoContainer/> : ''}
            <Scrollable innerRef={(panel) => { this.panel = panel; }}>
              <List>
                {
                  this.state.chatHistory.map(
                    ({user, message, time, event }, i) => [
                      <NoDots>
                        {this.renderMessage(user, message ,i, event, time)}
                      </NoDots>
                    ]
                  )
                }
              </List>
            </Scrollable>
            <InputPanelWrap>
           
              <StyledTextField
              fullWidth={1}
                textareaStyle={{ color: '#fafafa' }}
                hintStyle={{ color: '#fafafa' }}
                floatingLabelStyle={{ color: '#fafafa' }}
              
                floatingLabelText="Enter a message."
                multiLine
                rows={3}
                rowsMax={4}
                onChange={this.onInput}
                value={this.state.input}
                onKeyPress={e => (e.key === 'Enter' ? this.onSendMessage() : null)}
              />
              <SendButton
                onClick={this.onSendMessage}
                style={{ marginLeft: 20, maxWidth: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Send style = {{height: '40', width: '40',}}color='#fafafa'/>
              </SendButton>
              
            </InputPanelWrap>
          </ChatPanel>
        </ChatWindow>
      </div>
    )
  }
}
