import React from 'react';
import styled from 'styled-components';

const VideoWrapper = styled.div`
height: 100%;
width: 100%;
position: absolute;
z-index: -10;
display: flex;
justify-content: center;
`;

export default class OnlineUsers extends React.Component {
  constructor(props) {
    super(props);

    const gotMedia = stream => {
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

  render() {

    return (
    <VideoWrapper>
      <video height="100%"  autoPlay="true"></video>
    </VideoWrapper>
    );
  }
}
