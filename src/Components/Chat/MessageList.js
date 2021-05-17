import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import { Person } from '@material-ui/icons/';
import { updateMessageList } from '../../Redux/actions';
import { useDispatch } from 'react-redux'

const useStyles = makeStyles({
    root: {
        padding: '75px 0 95px 0',
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
      fetch('https://immense-harbor-48108.herokuapp.com/messages/',{
          headers: new Headers({
              'Authorization': 'Bearer ' + localStorage.getItem('JWT_AUTH_TOKEN')
          })
      })
      .then(res => res.json())
      .then(data => dispatch(updateMessageList([...data])));
      // eslint-disable-next-line
   }, []);
   

    return (
        <div className={classes.root}>
            <h4 className={classes.messageListHeader}>Messages:</h4>
            {props.messages.map((message,i)=>{
                return (
                <div key={message._id || i} className={classes.messageContainer} style={(message.name === props.user.username)?{backgroundColor: '#3f51b5'}:null}>
                    <Person className={classes.personIcon} />
                    <div>
                        <Typography variant='h6' display='inline'>{message.name} </Typography>
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
    user: state.user
})

const mapDispatchToProps = {
    updateMessageList
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageList)
