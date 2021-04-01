import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, TextField } from '@material-ui/core';
import { useDispatch } from 'react-redux'
import { addMessage } from '../Redux/actions';
import { PublishRounded } from '@material-ui/icons/';

export const MessageInput = (props) => {

    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    const dispatch = useDispatch();

    return (
        <div>
            <TextField label="User" value={user} onChange={(e)=>setUser(e.target.value)} />
            <TextField label="Message" value={message} onChange={(e)=>setMessage(e.target.value)} />
            <Button
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
