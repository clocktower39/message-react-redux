import React, { useState } from 'react';
import { Grid, TextField, Typography, makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';

const useStyles = makeStyles({
    root:{
        paddingTop: '100px',
    }
})

export default function Account(props) {
    const user = useSelector(state => state.user);

    const [username, setUsername] = useState(user.username);
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [email, setEmail] = useState(user.email);

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid container spacing={3} justify="center">
                <Grid item xs={12}><TextField label="Username" variant="outlined" value={username} fullWidth/></Grid>
                <Grid item xs={12}><TextField label="First Name" variant="outlined" value={firstName} fullWidth/></Grid>
                <Grid item xs={12}><TextField label="Last Name" variant="outlined" value={lastName} fullWidth/></Grid>
                <Grid item xs={12}><TextField label="Email" variant="outlined" value={email} fullWidth/></Grid>
            </Grid>
        </div>
    )
}
