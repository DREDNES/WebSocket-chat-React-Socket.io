import React from 'react';
import styled from 'styled-components';

const VideoWrapper = styled.div`
 height: 100%;
 width: 100%;
`;

export default class OnlineUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {src: null};
    this.handleClick = this.handleClick.bind(this);
    this.start();
  }

  render() {

    return (
    <VideoWrapper>
      <video id="video1" ref = {this.state.src} autoPlay></video>
    </VideoWrapper>
    );
  }
}
