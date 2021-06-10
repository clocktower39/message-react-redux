import React from 'react';
import { Grid, Typography, makeStyles } from '@material-ui/core';
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
            <Grid container>
            <Grid item xs={6}><Typography variant="body1">user.username</Typography></Grid>
            <Grid item xs={6}><Typography variant="body1">{user.username}</Typography></Grid>
            <Grid item xs={6}><Typography variant="body1">user.firstName</Typography></Grid>
            <Grid item xs={6}><Typography variant="body1">{user.firstName}</Typography></Grid>
            <Grid item xs={6}><Typography variant="body1">user.lastName</Typography></Grid>
            <Grid item xs={6}><Typography variant="body1">{user.lastName}</Typography></Grid>
            <Grid item xs={6}><Typography variant="body1">user.email</Typography></Grid>
            <Grid item xs={6}><Typography variant="body1">{user.email}</Typography></Grid>
            </Grid>
        </div>
    )
}
