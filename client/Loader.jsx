import React from 'react';
import styled,  { keyframes } from 'styled-components';
import { rotateIn } from 'react-animations';
import Loading from 'material-ui/svg-icons/action/cached';


const rotateAnimation = keyframes`${rotateIn}`;

const RotateDiv = styled.div`
  animation: 0.5s ${rotateAnimation};
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`;

const Absolute = styled.div`
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
`;
export default () => <Absolute>
                        <RotateDiv><Loading/></RotateDiv>
                    </Absolute>