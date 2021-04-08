import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import { Person } from '@material-ui/icons/';
import { updateMessageList } from '../Redux/actions';
import { useDispatch } from 'react-redux'

const useStyles = makeStyles({
    root: {
    },
    messageListHeader: {
        textAlign: 'center',
    },
    messageContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'darkgrey',
        margin: '10px',
        borderRadius: '7.5px',
    },
    personIcon: {
        padding: '15px',
    }
  });

export const MessageList = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    scrollToBottom();
  }, [props.messages]);
  
  useEffect(() => {
      fetch('http://mattkearns.ddns.net:3000/messages/')
      .then(res => res.json())
      .then(data => dispatch(updateMessageList([...data])));
      // eslint-disable-next-line
   }, []);
   

    return (
        <div className={classes.root}>
            <h4 className={classes.messageListHeader}>Messages:</h4>
            {props.messages.map((message,i)=>{
                return (
                <div key={message._id} className={classes.messageContainer}>
                    <Person className={classes.personIcon} />
                    <div>
                        <Typography variant='h5' display='inline'>{message.name} </Typography>
                        <Typography variant='subtitle1' display='inline'>{(message.timeStamp == null)? null:new Date(message.timeStamp).toLocaleTimeString()}</Typography>
                        <Typography variant='body1' display='block'>{message.message}</Typography>
                    </div>
                </div>);
            })}
            <div ref={messagesEndRef} />
        </div>
    )
}

const mapStateToProps = (state) => ({
    messages: [...state.messages],
    name: state.name
})

const mapDispatchToProps = {
    updateMessageList
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageList)
