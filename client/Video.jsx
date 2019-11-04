import React from 'react';
import styled from 'styled-components';
import socket from './socket';
import Peer from 'simple-peer';


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
    
    this.state={
      stream: null,
      client: socket()
    };

    this.peer = null;
    this.signal = data => this.peer.signal(data);
    this.send = data => this.peer.send(JSON.stringify(data));

    this.bindProps = () => {
      this.peer.on('error', this.onError);
      this.peer.on('signal', this.onSignal);
      this.peer.on('stream', this.onStream);
      this.peer.on('data', raw =>
        this.onData(JSON.stringify(raw.toString()))
      );
      this.peer.on('connect', this.onConnect);
    };

    //this.setSignal = this.setSignal.bind(this);
    this.onSignal = this.onSignal.bind(this);
    this.onData = this.onData.bind(this);
    this.onConnect = this.onConnect.bind(this);
    this.onStream = this.onStream.bind(this);
    this.onError = this.onError.bind(this);

    this.stream = null;
  }

  componentWillMount() {
   
    this.peer = new Peer({ initiator: this.props.initiator});
    console.log(this.peer);
    
    this.bindProps();
  }

  componentWillUnmount() {
    this.state.client.unregisterSignal();

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }

    console.log("DESTROYED");

    this.peer.destroy();
  }

  componentDidMount() {
    this.state.client.registerSignal( (signal)=>{
      console.log("I GOT SIGNAL", signal);
      if(signal.id !== this.peer._id) {
        this.signal(signal.signal);
      }
    });

    if(this.props.initiator) {
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
    
      navigator.getUserMedia = (
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia
      );

      if (typeof navigator.mediaDevices.getUserMedia === 'undefined') {
        navigator.getUserMedia({video: true, audio: true}, gotMedia, err => console.error(err));
      } else {
        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(gotMedia).catch(err => console.error(err));
      } 
    }
  }

  onSignal(data) {
    this.state.client.sendSignal(this.props.chatroom, {"id":this.peer._id, "signal": data});
  }

  onData(data) {
    console.log(data);
  }

  onConnect() {
    console.log("CONNECT");
  }

  onStream(stream) {
    console.log("GOT STREAM!!!");
    var video = document.querySelector('video');
        this.setState({stream});
        if ('srcObject' in video) {
          video.srcObject = stream;
        } else {
          video.src = window.URL.createObjectURL(stream); 
        }
  }

  onError(err) {
    console.log(err);
  }

  

  render() {
    return (
        <VideoWrapper> <video height="100%" autoPlay="true" muted = {this.props.initiator}></video></VideoWrapper>
    )
  }
}