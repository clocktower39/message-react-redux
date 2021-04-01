import React from 'react';
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
    },
    personIcon: {
        padding: '15px',
    }
  });

export const MessageList = (props) => {
  const classes = useStyles();
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
