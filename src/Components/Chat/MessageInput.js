import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Container, TextField, Grid, makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux'
import { addMessage } from '../../Redux/actions';

const useStyles = makeStyles({
    root: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#23272a',
    },
    textField: {
      margin: '12px',
      borderBottomColor: '#ccc',
      "& input": {
        color: "#ccc",
      },
      "& label": {
        color: "#ccc",
      },
    },
    button: {
    },

  });

export const MessageInput = (props) => {

    const [error, setError] = useState(false);
    const [name] = useState(props.user.username);
    const [message, setMessage] = useState('');
    const dispatch = useDispatch();

    const classes = useStyles();

    const handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            handleMessageSubmit(e);
        }
    }

    const handleMessageSubmit = (e) => {
        if(name !== '' && message !== ''){
            let newMessage = JSON.stringify({name:name, message:message});
            
            fetch('https://immense-harbor-48108.herokuapp.com/messages', {
              method: 'post',dataType: 'json',
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
        dispatch(addMessage(data.name,data.message));
      });// eslint-disable-next-line
    }, []);

    return (
      <Container maxWidth="sm">
      <Grid container className={classes.root}>
        <Grid item xs={8}>
          <TextField
            fullWidth
            error={error === true ? true : false}
            helperText={(error === true)?"Please enter a message":false}
            className={classes.textField}
            label="Message"
            value={message}
            InputProps={{
              className: classes.input
            }}
            onKeyDown={(e) => handleKeyDown(e)}
            onChange={(e) => {
                setMessage(e.target.value);
                (e.target.value === '')?setError(true):setError(false);
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={(e) => handleMessageSubmit(e)}
          >
            Send
          </Button>
        </Grid>
      </Grid>
      </Container>
    );
}

const mapStateToProps = (state) => ({
  user: {...state.user},
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageInput)
