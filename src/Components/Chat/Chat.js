import React from 'react'
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { AppBar, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    app: {
      height: 'calc(100% - 72px)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    },
    appBar: {
      top: 'auto',
      bottom: 0,
    }
  });
  
export default function Chat() {
    const classes = useStyles();
    return (
        <>
            <div className={classes.app} >
            <MessageList />
            </div>
            <AppBar className={classes.appBar} position="fixed">
            <MessageInput />
            </AppBar>
        </>
    )
}
