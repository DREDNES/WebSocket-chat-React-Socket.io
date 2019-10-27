import React from 'react';
import styled from 'styled-components';
import { List, ListItem} from 'material-ui/List';
import { Collapse } from 'react-collapse';
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import ExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import User from 'material-ui/svg-icons/social/person';
import Users from 'material-ui/svg-icons/social/people';

const OnlineUsersWrapper = styled.div`
  z-index: 999;
  position: absolute;
  right: 0;
  top: 5px;
`;

const Scrollable = styled.div`
  height: 100%;
  width: 100%;
  overflow: auto;
`;

export default class OnlineUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: this.props.users,
      open: false
    };    
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      open: !state.open
    }));
  }
 
  render() {

    return (
    <OnlineUsersWrapper>
      <List>
        <ListItem 
        onClick={this.handleClick}
        style={{ color: '#fafafa', backgroundColor: 'rgba(232, 232, 232, 0.5)', borderRadius: 10, WebkitUserSelect: 'none', userSelect: 'none'}}
        primaryText = {`${this.props.users.length} online user(s)`}
        leftIcon={<Users color='#fafafa'/>}
        rightIcon={this.state.open ? <ExpandLess color='#fafafa'/> : <ExpandMore color='#fafafa'/>}
        >
        {/* <ListItemIcon>
          <InboxIcon />
        </ListItemIcon> */}
       
        </ListItem>
        <Collapse isOpened={this.state.open}>
        <Scrollable innerRef={(panel) => { this.panel = panel; }}>
          <List style={{backgroundColor: 'rgba(232, 232, 232, 0.9)', borderRadius: 10, marginTop: 5}}>
          {
            this.props.users.map(user => (
              <ListItem
              key={user.id}
              style={{ color: '#505050'}}
              color=''
              primaryText={ `${user.name} ${user.lastName}` }
              leftIcon={<User/>} 
              />
            ))
          }
          </List>
          </Scrollable>
        </Collapse>
      </List>
    </OnlineUsersWrapper>
    );
  }
}
