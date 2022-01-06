import React from 'react'
import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function Chat(props) {
  return (
    <>
      <div style={{
        height: 'calc(100% - 72px)',
        display: 'flex',
        flexDirection: 'column',
      }} >
        <MessageList />
      </div>
      <div style={{
        bottom: 0,
        left: 0,
        backgroundColor: '#23272a',
        position: "fixed",
        width: '100%',
      }}>
        <MessageInput socket={props.socket} />
      </div>
    </>
  )
}
