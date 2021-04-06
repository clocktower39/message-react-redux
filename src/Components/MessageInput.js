import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, TextField, makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux'
import { addMessage } from '../Redux/actions';
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
        }
        else {
            console.log(e.target);
        }
    }

    return (
      <div className={classes.root}>
        <TextField
          error={name === "" ? true : false}
          helperText={name === "" ? "Please enter a name" : false}
          className={classes.textField}
          label="Name"
          value={name}
          onKeyDown={(e) => handleKeyDown(e)}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          error={message === "" ? true : false}
          helperText={(message === '')?"Please enter a message":false}
          className={classes.textField}
          label="Message"
          value={message}
          onKeyDown={(e) => handleKeyDown(e)}
          onChange={(e) => setMessage(e.target.value)}
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
