import React from 'react'
import { connect } from 'react-redux'

export const MessageList = (props) => {
    return (
        <div>
            Messages:
            {props.messages.map((message)=>{
                return (
                <div>
                    <p>{message.user}</p>
                    <p>{message.message}</p>
                </div>);
            })}
        </div>
    )
}

const mapStateToProps = (state) => ({
    messages: state.messages,
    user: state.user
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageList)
