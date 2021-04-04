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

    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    const dispatch = useDispatch();

    const classes = useStyles();

    const handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            handleMessageSubmit();
        }
    }

    const handleMessageSubmit = (e) => {
        if(user !== '' && message !== ''){
            dispatch(addMessage(user,message));
        }
    }

    return (
        <div className={classes.root}>
            <TextField className={classes.textField} label="User" value={user} onKeyDown={(e)=>handleKeyDown(e)} onChange={(e)=>setUser(e.target.value)} />
            <TextField className={classes.textField} label="Message" value={message} onKeyDown={(e)=>handleKeyDown(e)} onChange={(e)=>setMessage(e.target.value)} />
            <Button
                className={classes.button}
                onClick={(e)=>handleMessageSubmit(e)}
            ><PublishRounded /></Button>
        </div>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageInput)
