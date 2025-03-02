import React from 'react'
import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function Chat({ socket }) {
  return (
    <>
      <div style={{
        height: 'calc(100% - 72px)',
        display: 'flex',
        flexDirection: 'column',
      }} >
        <MessageList socket={socket} />
      </div>
      <div style={{
        bottom: 0,
        left: 0,
        backgroundColor: '#23272a',
        position: "fixed",
        width: '100%',
      }}>
        <MessageInput socket={socket} />
      </div>
    </>
  )
}
