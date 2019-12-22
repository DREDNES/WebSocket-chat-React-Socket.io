import React from 'react';
import Dialog from 'material-ui/Dialog';
import styled from 'styled-components';

import FlatButton from 'material-ui/FlatButton';

import Loader from './Loader';

const InputPanelWrap = styled.div`
  padding: 1em;
  background-color: transparent;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledTextField = styled.input`
  text-align: center;
  width: 70%;  
  resize: none;
  background-color: rgba(232, 232, 232, 0.7);
  border: none;
  border-radius: 15px;
  padding: 10px;
  font-size: 16px;
  
  outline:none;
  border: none;
`;

export default class UserSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputName: '',
      inputLastname: ''
    };

    this.onInputName = this.onInputName.bind(this);
    this.onInputLastname = this.onInputLastname.bind(this);
    this.onConfirm = this.onConfirm.bind(this);

  }

  onInputName(e) {
    this.setState({
      inputName: e.target.value
    });
  }
  onInputLastname(e) {
    this.setState({
      inputLastname: e.target.value
    });
  }
  

  
  onConfirm() {
    if(this.state.inputName != '' && !this.state.inputName.includes('/')){
      const name = `{ "id":"${this.props.clientId}", "name": "${this.state.inputName}", "lastName": "${this.state.inputLastname}" }`;
      this.props.register(name);
    } else {
      alert ("Check your name!");
    }
  }


  handleSelection(selectedUser) {
    this.props.register(selectedUser.name);
  }

  render() {
    const actions = [
    <FlatButton
      label="Ok"
      primary
      onClick={this.onConfirm}
    />,
      <FlatButton
        label="Cancel"
        primary
        onClick={this.props.close}
      />
    ]

    return (
      <Dialog
        actions={actions}
        modal={false}
        open
        onRequestClose={this.props.close}
      >
        <InputPanelWrap>
           
           <StyledTextField required
           placeholder= 'First name'
             onChange={this.onInputName}
             value={this.state.inputName}
             onKeyPress={e => (e.key === 'Enter' ? this.onConfirm() : null)}
           />
                    
         </InputPanelWrap>
         <InputPanelWrap>
           
           <StyledTextField
             placeholder='Last name (optional)'
             onChange={this.onInputLastname}
             value={this.state.inputLastname}
             onKeyPress={e => (e.key === 'Enter' ? this.onConfirm() : null)}
           />
                    
         </InputPanelWrap>
         
      </Dialog>
    )
  }
}
