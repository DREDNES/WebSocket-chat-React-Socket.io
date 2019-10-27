import React from 'react';
import styled from 'styled-components';
import Paper from 'material-ui/Paper';

const Wrapper = styled.div`
  cursor: pointer;
`;

const Card = styled.div`
  padding: 0 10px;
  height: 100%;
`;

const RoomTitleWrap = styled.div`
  width: 60%;
  float: left;
  line-height: 50px;
`;

const MembersCountWrap = styled.div`
  float: right;
  width: 40%;
  line-height: 50px;
  text-align: right;
`;



export default ({ chatroom, onEnter }) => (
  <Paper
    style={{flex: 1, height: 50, marginBottom: 20, borderRadius: 8}}
  >
    <Wrapper onClick={onEnter}>
      <Card>
        <RoomTitleWrap>{chatroom.name}</RoomTitleWrap>
        <MembersCountWrap><i>Count of members:</i> {chatroom.numMembers}</MembersCountWrap>
      </Card>
    </Wrapper>
  </Paper>
)
