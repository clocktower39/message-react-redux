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
    button: {
        height: '100%',
    }
  });

export const MessageInput = (props) => {

    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    const dispatch = useDispatch();

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <TextField label="User" value={user} onChange={(e)=>setUser(e.target.value)} />
            <TextField label="Message" value={message} onChange={(e)=>setMessage(e.target.value)} />
            <Button
                className={classes.button}
                onClick={(e)=>{
                    dispatch(addMessage(user,message));
                }}
            ><PublishRounded /></Button>
        </div>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageInput)
