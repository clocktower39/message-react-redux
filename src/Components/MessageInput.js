import React from 'react'
import { connect } from 'react-redux'
import { Button, TextField } from '@material-ui/core';

export const MessageInput = (props) => {
    return (
        <div>
            <TextField label="User" />
            <TextField label="Message" />
            <Button>Send</Button>
        </div>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageInput)
