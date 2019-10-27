import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import FullScreen from './FullScreen';
import Overlay from './Overlay';

const ContentWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: auto;
  z-index: 1;
`;
const Center = styled.div`
  position: relative;
  margin: auto;
  padding: 20px 0;
  height: 100%;
  box-sizing: border-box;
`;

const Content = styled.div`
  position: relative;
  margin: 0 20px;
  height: 100%;
`;

const Relative = styled.div`
  position: relative;
  display:inline-block;
`;

const LoginWrapper = styled.div`
display:inline-block;
background-color: rgba(232, 232, 232, 0.5);
width: fit-content;
margin: 0 auto;
padding: 1px 5px;
border-radius: 10px;
`; 

const UserName = styled.p`
  font-size: 24px;
  height: 27px;
  text-align: center;
  color: #fafafa;
  margin: 20px;
`;

const SignOut = styled.div`
display:inline-block;
margin 0 10px;
font-size: 18px;
color: rgba(232, 232, 232, 0.5);
cursor: pointer;
`;



function fullName(user) {
  return user ? `${user.name} ${user.lastName}` : 'Sign in';
}



export default ({ children, user, LogOut }) => (
  <FullScreen>
    <ContentWrapper>
      <Center>
        <Content>
          <Relative>
            <LoginWrapper>
              <Link style={{ textDecoration: 'none' }} to="/user">
                  <UserName> { fullName(user) } </UserName>
              </Link>
            </LoginWrapper>
            {
              user &&
              <SignOut onClick={ LogOut }>sign out</SignOut>
            }              
          </Relative>
          { children }
        </Content>
      </Center>
    </ContentWrapper>
    <FullScreen>
      <Overlay
        opacity={0.4}
        background="#212121"
      />
    </FullScreen>
  </FullScreen>
)
