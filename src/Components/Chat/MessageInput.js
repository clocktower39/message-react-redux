import React, { useState, useEffect } from 'react';
import { Button, Container, TextField, Grid } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux'
import { addMessage } from '../../Redux/actions';

export const MessageInput = (props) => {

  const [error, setError] = useState(false);
  const name = useSelector(state => state.user.username);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleMessageSubmit(e);
    }
  }

  const handleMessageSubmit = (e) => {
    if (name !== '' && message !== '') {
      let newMessage = JSON.stringify({ name: name, message: message });

      fetch('https://immense-harbor-48108.herokuapp.com/messages', {
        method: 'post', dataType: 'json',
        body: newMessage,
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });

      setMessage('');

    }
    else {
      console.log(e.target);
    }
  }

  useEffect(() => {
    props.socket.on("message", data => {
      dispatch(addMessage(data.name, data.message));
    });// eslint-disable-next-line
  }, []);

  return (
    <Container maxWidth="sm">
      <Grid container sx={{
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#23272a',
      }}>
        <Grid item xs={10}>
          <TextField
            fullWidth
            error={error === true ? true : false}
            helperText={(error === true) ? "Please enter a message" : false}
            label="Message"
            value={message}
            onKeyDown={(e) => handleKeyDown(e)}
            onChange={(e) => {
              setMessage(e.target.value);
              (e.target.value === '') ? setError(true) : setError(false);
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => handleMessageSubmit(e)}
          >
            Send
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default MessageInput
