import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { Person } from '@material-ui/icons/';

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
                <div className={classes.messageContainer}>
                    <Person className={classes.personIcon} />
                    <div>
                        <p>{message.user}</p>
                        <p>{message.message}</p>
                    </div>
                </div>);
            })}
            <div ref={messagesEndRef} />
        </div>
    )
}

const mapStateToProps = (state) => ({
    messages: [...state.messages],//try this with scheduler
    user: state.user
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageList)
