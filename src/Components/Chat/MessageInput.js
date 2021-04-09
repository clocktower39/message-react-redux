import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, TextField, Grid, makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux'
import { addMessage, logoutUser } from '../../Redux/actions';
import { PublishRounded } from '@material-ui/icons/';

const useStyles = makeStyles({
    root: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    textField: {
        margin: '12px',
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
            dispatch(addMessage(name,message));
            let newMessage = JSON.stringify({name:name, message:message});
            
            fetch('http://mattkearns.ddns.net:3000/messages', {
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

    const handleLogout = () => {
      localStorage.removeItem('username');
      dispatch(logoutUser());
    }

    return (
      <Grid container spacing={1} className={classes.root}>
        <Grid item>
          <TextField
            error={error === true ? true : false}
            helperText={(error === true)?"Please enter a message":false}
            className={classes.textField}
            label="Message"
            value={message}
            onKeyDown={(e) => handleKeyDown(e)}
            onChange={(e) => {
                setMessage(e.target.value);
                (e.target.value === '')?setError(true):setError(false);
            }}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={(e) => handleMessageSubmit(e)}
          >
            Send
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={(e) => handleLogout()}
          >
            Logout
          </Button>
        </Grid>
      </Grid>
    );
}

const mapStateToProps = (state) => ({
  user: {...state.user},
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageInput)
