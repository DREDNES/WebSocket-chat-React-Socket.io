import React from 'react';
import styled from 'styled-components';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';


const InputPanelWrap = styled.div`
  padding: 1em;
  background-color: transparent;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledTextField = styled.input`
  width: 70%;  
  resize: none;
  background-color: rgba(232, 232, 232, 0.7);
  border: none;
  border-radius: 15px;
  padding: 10px;
  font-size: 16px;
  text-align: center;
  outline:none;
  border: none;
`;

export default class ChatroomNameInput extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      input: ''
    };

    this.onInput = this.onInput.bind(this);
    this.onConfirm = this.onConfirm.bind(this);

  }



  onInput(e) {
    this.setState({
      input: e.target.value
    });
  }

  onConfirm() {
    this.props.addChatroom(this.state.input);
    this.props.close();
  }

  
  render() {
    const actions = [<FlatButton
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
           
              <StyledTextField
              fullWidth={1}
              placeholder= 'Room name'
                onChange={this.onInput}
                value={this.state.input}
                onKeyPress={e => (e.key === 'Enter' ? this.onConfirm() : null)}
              />              
            </InputPanelWrap>
         
      </Dialog>
    )
  }
}
