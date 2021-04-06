import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import { Person } from '@material-ui/icons/';
import { useDispatch } from 'react-redux'
import { updateMessageList } from '../Redux/actions';

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
    scrollToBottom()
  }, [props.messages]);
  

    return (
        <div className={classes.root}>
            <h4 className={classes.messageListHeader}>Messages:</h4>
            {props.messages.map((message)=>{
                return (
                <div key={`${message.name}-${message.message}`} className={classes.messageContainer}>
                    <Person className={classes.personIcon} />
                    <div>
                        <Typography>{message.name}</Typography>
                        <Typography variant='caption'>{message.message}</Typography>
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
    
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageList)
