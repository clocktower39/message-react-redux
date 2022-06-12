import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Button, TextField, Grid } from '@mui/material';
import { loginUser } from '../Redux/actions';

const classes = {
    root: {
        padding: '125px 0',
        textAlign: 'center',
    },
    textField: {
        margin: '2.5px',
    },
    button: {
    },

};

export const Login = (props) => {
    const dispatch = useDispatch();
    const [error, setError] = useState(false);
    const [username, setUsername] = useState((localStorage.getItem('username')) ? localStorage.getItem('username') : '');
    const [password, setPassword] = useState('');
    const [disableButtonDuringLogin, setDisableButtonDuringLogin] = useState(false);
    const user = useSelector(state => state.user);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLoginAttempt(e);
        }
    }
    const handleLoginAttempt = (e) => {
        if (username && password) {
            setDisableButtonDuringLogin(true);
            dispatch(loginUser(JSON.stringify({ username: username, password: password }))).then(res => {
                if (res.error) {
                    setError(true);
                }
                setDisableButtonDuringLogin(false);
            });
            localStorage.setItem('username', username);
        }
        else {
            setDisableButtonDuringLogin(false);
            setError(true);
        }
    }

    const loginAsGuest = () => {
        setDisableButtonDuringLogin(true);
        dispatch(loginUser(JSON.stringify({ username: "GUEST", password: "GUEST" }))).then(res => {
            if (res.error) {
                setError(true);
            }
            setDisableButtonDuringLogin(false);
        });
        localStorage.setItem('username', username);
    }

    if (user.username) {
        return (<Redirect to={{ pathname: '/' }} />)
    }
    return (
        <Grid container spacing={1} sx={classes.root}>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="primary"
                    sx={classes.button}
                    onClick={(e) => handleLoginAttempt(e)}
                    disabled={disableButtonDuringLogin}
                >
                    Login
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="primary"
                    sx={classes.button}
                    onClick={(e) => loginAsGuest(e)}
                    disabled={disableButtonDuringLogin}
                >
                    Login as a Guest
                </Button>
            </Grid>
        </Grid>
    )
}

export default Login
