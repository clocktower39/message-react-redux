import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';

const useStyles = makeStyles({
    root:{
        paddingTop: '100px',
    }
})

export default function Account(props) {
    const user = useSelector(state => state.user);
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Typography variant="body1">{user.username}</Typography>
            <Typography variant="body1">{user.firstName}</Typography>
            <Typography variant="body1">{user.lastName}</Typography>
            <Typography variant="body1">{user.email}</Typography>
        </div>
    )
}
