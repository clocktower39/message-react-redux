import React, { useEffect, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import { Person, Delete, EmojiEmotions } from '@material-ui/icons/';
import { updateMessageList } from '../../Redux/actions';

const useStyles = makeStyles({
    root: {
        padding: '75px 0 95px 0',
    },
    messageListHeader: {
        textAlign: 'center',
        color: 'white',
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
                <Grid key={message._id || i} className={classes.messageContainer} style={(message.name === props.user.username)?{backgroundColor: '#3f51b5', color: 'white'}:null} container>
                    <Grid item xs={2}>
                        <Person className={classes.personIcon} />
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant='h6' display='inline'>{message.name} </Typography>
                        <Typography variant='subtitle1' display='inline'>{(message.timeStamp == null)? null:`| ${new Date(message.timeStamp).toLocaleTimeString()} | ${new Date(message.timeStamp).toLocaleDateString()}`}</Typography>
                        <Typography variant='subtitle1' display='block'>{message.message}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        {(message.name === props.user.username)?<IconButton><Delete /></IconButton>:<IconButton><EmojiEmotions /></IconButton>}
                    </Grid>
                </Grid>);
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
