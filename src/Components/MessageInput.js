import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, TextField, makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux'
import { addMessage, updateMessageList } from '../Redux/actions';
import { PublishRounded } from '@material-ui/icons/';

const useStyles = makeStyles({
    root: {
        textAlign: 'center',
    },
    textField: {
        margin: '12px',
    },
    button: {
        height: '100%',
    },

  });

export const MessageInput = (props) => {

    const [error, setError] = useState(false);
    const [name, setName] = useState('');
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

    return (
      <div className={classes.root}>
        <TextField
          error={error === true ? true : false}
          helperText={error === true ? "Please enter a name" : false}
          className={classes.textField}
          label="Name"
          value={name}
          onKeyDown={(e) => handleKeyDown(e)}
          onChange={(e) => setName(e.target.value)}
        />
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
        <Button
          className={classes.button}
          onClick={(e) => handleMessageSubmit(e)}
        >
          <PublishRounded />
        </Button>
      </div>
    );
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageInput)
