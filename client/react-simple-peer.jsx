import React from 'react';
import Peer from 'simple-peer';

module.exports = class SimplePeer extends React.Component {
  constructor() {
    super();
  
    this.peer = null;
    this.signal = data => this.peer.signal(data);
    this.send = data => this.peer.send(JSON.stringify(data));

    this.bindProps = () => {
      this.peer.on('error', this.props.onError);
      this.peer.on('signal', this.props.onSignal);
      this.peer.on('stream', this.props.onStream);
      this.peer.on('data', raw =>
        this.props.onData(JSON.stringify(raw.toString()))
      );
      this.peer.on('connect', this.props.onConnect);
    };
  }

  componentWillMount() {
    if(this.props.initiator) {
        this.peer = new Peer({
            initiator: this.props.initiator,
            stream: this.props.stream,
            trickle: false
        });
    } else {
        this.peer = new Peer({trickle: false});
    }
    
    this.bindProps();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stream != this.props.stream) {
      this.peer.destroy();
      this.peer = new Peer({
        initiator: this.props.initiator,
        stream: nextProps.stream
      });
      this.bindProps();
    }
  }

  componentWillUnmount() {
    this.peer.destroy();
  }

  render() {
    return null;
  }
};