import React from 'react';
import styled from 'styled-components';
import socket from './socket';
import Peer from 'simple-peer';
import { ClientRequest } from 'http';

//const io = require('socket.io-client');

const VideoWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: -10;
  display: flex;
  justify-content: center;
  background-color: black;
`;
export default class Video extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stream: null,
      client: socket(),
      onlineUsers: [],
      streamer: ''
    };

    this.peer = null;
    this.signal = data => this.peer.signal(data);
    this.send = data => this.peer.send(JSON.stringify(data));

    this.bindProps = () => {
      this.peer.on('error', this.onError);
      this.peer.on('signal', this.onSignal);
      this.peer.on('stream', this.onStream);
      this.peer.on('data', raw => this.onData(JSON.stringify(raw.toString())));
      this.peer.on('connect', this.onConnect);
    };

    //this.setSignal = this.setSignal.bind(this);
    this.onSignal = this.onSignal.bind(this);
    this.onData = this.onData.bind(this);
    this.onConnect = this.onConnect.bind(this);
    this.onStream = this.onStream.bind(this);
    this.onError = this.onError.bind(this);

    this.state.client.getStreamer(this.props.chatroom, (err, streamer) => {
      this.setState({ streamer }, () => console.log(this.state.streamer));
    });

    this.stream = null;
  }

  getOnlineUsers() {
    this.state.client.getOnlineUsers(
      this.props.chatroom,
      (err, onlineUsers) => {
        if (err) console.error(err);
        this.setState({ onlineUsers });
      }
    );
  }

  componentWillMount() {
    this.peer = new Peer({ initiator: this.props.initiator });
    console.log(this.peer);

    this.bindProps();
  }

  componentWillUnmount() {
    this.state.client.unregisterSignal();

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }

    console.log('DESTROYED');

    this.peer.destroy();
  }

  componentDidMount() {
    this.getOnlineUsers();

    this.state.client.registerSignal(signal => {
      if (this.props.initiator && !signal.initiator) {
        console.log('SIGNAL ON HOST', signal);
        this.peer.signal(signal.signal);
      } else if (!this.props.initiator && signal.initiator) {
        console.log('SIGNAL ON CLIENT', signal);
        this.peer.signal(signal.signal);
      }
    });

    if (this.props.initiator) {
      const gotMedia = stream => {
        this.stream = stream;
        this.peer.addStream(stream);

        var video = document.querySelector('video');
        if ('srcObject' in video) {
          video.srcObject = stream;
        } else {
          video.src = window.URL.createObjectURL(stream);
        }
      };

      navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

      if (typeof navigator.mediaDevices.getUserMedia === 'undefined') {
        navigator.getUserMedia({ video: true, audio: true }, gotMedia, err =>
          console.error(err)
        );
      } else {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then(gotMedia)
          .catch(err => console.error(err));
      }
    }
  }

  onSignal(data) {
    if (this.props.initiator) {
      this.state.client.sendSignal(this.props.chatroom, {
        from: this.props.user,
        initiator: this.props.initiator,
        signal: data
      });
    } else {
      this.state.client.sendSignal(this.props.chatroom, {
        from: this.props.user,
        initiator: this.props.initiator,
        signal: data
      });
    }
  }

  onData(data) {
    console.log(data);
  }

  onConnect() {
    console.log('CONNECT');
  }

  onStream(stream) {
    console.log('GOT STREAM!!!');
    var video = document.querySelector('video');
    this.setState({ stream });
    if ('srcObject' in video) {
      video.srcObject = stream;
    } else {
      video.src = window.URL.createObjectURL(stream);
    }
  }

  onError(err) {
    console.log('PEER ERROR', err);
  }

  render() {
    return (
      <VideoWrapper>
        <div
          dangerouslySetInnerHTML={{
            __html: `
        <video 
        height="100%" 
        autoPlay="true"
        muted = ${this.props.initiator} 
         />,
      `
          }}
        ></div>
      </VideoWrapper>
    );
  }
}
