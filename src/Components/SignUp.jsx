import React, { useState } from 'react';
import { Button, TextField, Grid, } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { signupUser } from '../Redux/actions';

const classes = {
    root: {
        padding: '125px 0 25px 0',
        textAlign: 'center',
    },
    textField: {
        margin: '2.5px',
    },
    button: {
    },

};

export const SignUp = (props) => {
    const dispatch = useDispatch();
    const [error, setError] = useState(false);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const user = useSelector(state => state.user);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (username && firstName && lastName && email && password && confirmPassword) {
                handleSignupAttempt();
            }
        }
    }
    const handleSignupAttempt = (e) => {
        if (username && password) {
            dispatch(signupUser(JSON.stringify({ username, firstName, lastName, email, password })));
            localStorage.setItem('username', username);
        }
    }
    if (user.username) {
        return (<Navigate to={{ pathname: '/' }} />)
    }

    return (
        <Grid container spacing={1} sx={classes.root}>
            <Grid size={12}>
                <TextField
                    error={error === true ? true : false}
                    helperText={error === true ? "Please enter your username" : false}
                    sx={classes.textField}
                    label="Username"
                    value={username}
                    onKeyDown={(e) => handleKeyDown(e)}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </Grid>

            <Grid size={12}>
                <TextField
                    error={error === true ? true : false}
                    helperText={error === true ? "Please enter your first name" : false}
                    sx={classes.textField}
                    label="First Name"
                    value={firstName}
                    onKeyDown={(e) => handleKeyDown(e)}
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </Grid>

            <Grid size={12}>
                <TextField
                    error={error === true ? true : false}
                    helperText={error === true ? "Please enter your last name" : false}
                    sx={classes.textField}
                    label="Last Name"
                    value={lastName}
                    onKeyDown={(e) => handleKeyDown(e)}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </Grid>

            <Grid size={12}>
                <TextField
                    error={error === true ? true : false}
                    helperText={error === true ? "Please enter your email" : false}
                    sx={classes.textField}
                    label="Email"
                    value={email}
                    onKeyDown={(e) => handleKeyDown(e)}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Grid>
            <Grid size={12}>
                <TextField
                    error={error === true ? true : false}
                    helperText={(error === true) ? "Please enter your password" : false}
                    sx={classes.textField}
                    label="Password"
                    value={password}
                    type="password"
                    onKeyDown={(e) => handleKeyDown(e)}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        (e.target.value === '') ? setError(true) : setError(false);
                    }}
                />
            </Grid>
            <Grid size={12}>
                <TextField
                    error={error === true ? true : false}
                    helperText={(error === true) ? "Please enter your password" : false}
                    sx={classes.textField}
                    label="Confirm Password"
                    value={confirmPassword}
                    type="password"
                    onKeyDown={(e) => handleKeyDown(e)}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        (e.target.value === '') ? setError(true) : setError(false);
                    }}
                />
            </Grid>
            <Grid size={12}>
                <Button
                    variant="contained"
                    color="primary"
                    sx={classes.button}
                >
                    Sign Up
                </Button>
            </Grid>
        </Grid>
    )
}

export default SignUp
