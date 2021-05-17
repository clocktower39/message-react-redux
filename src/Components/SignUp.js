import React, { useState, useEffect }  from 'react';
import { connect } from 'react-redux';
import { Button, TextField, Grid, Paper, makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux'
import { loginUser } from '../Redux/actions';

const useStyles = makeStyles({
    root: {
        padding: '125px 0 25px 0',
        textAlign: 'center',
    },
    textField: {
        margin: '12px',
    },
    button: {
    },

  });

export const SignUp = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [error, setError] = useState(false);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            handleLoginAttempt(e);
        }
    }
    const handleLoginAttempt = (e) => {
        if(username  && password){
            dispatch(loginUser({username: username, password: password}));
            localStorage.setItem('username', username);
        }
    }

    useEffect(()=>{
        if(username){
            handleLoginAttempt();
        }
        // eslint-disable-next-line
    },[])

    return (
        <Grid container spacing={3} className={classes.root}>
            <Grid item xs={12}>
                <Paper>
                <TextField
                error={error === true ? true : false}
                helperText={error === true ? "Please enter your username" : false}
                className={classes.textField}
                label="Username"
                value={username}
                onKeyDown={(e) => handleKeyDown(e)}
                onChange={(e) => setUsername(e.target.value)}
                />
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Paper>
                <TextField
                error={error === true ? true : false}
                helperText={error === true ? "Please enter your first name" : false}
                className={classes.textField}
                label="First Name"
                value={firstName}
                onKeyDown={(e) => handleKeyDown(e)}
                onChange={(e) => setFirstName(e.target.value)}
                />
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Paper>
                <TextField
                error={error === true ? true : false}
                helperText={error === true ? "Please enter your last name" : false}
                className={classes.textField}
                label="Last Name"
                value={lastName}
                onKeyDown={(e) => handleKeyDown(e)}
                onChange={(e) => setLastName(e.target.value)}
                />
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Paper>
                <TextField
                error={error === true ? true : false}
                helperText={error === true ? "Please enter your email" : false}
                className={classes.textField}
                label="Email"
                value={email}
                onKeyDown={(e) => handleKeyDown(e)}
                onChange={(e) => setEmail(e.target.value)}
                />
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                <TextField
                error={error === true ? true : false}
                helperText={(error === true)?"Please enter your password":false}
                className={classes.textField}
                label="Password"
                value={password}
                type="password"
                onKeyDown={(e) => handleKeyDown(e)}
                onChange={(e) => {
                    setPassword(e.target.value);
                    (e.target.value === '')?setError(true):setError(false);
                }}
                />
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                <TextField
                error={error === true ? true : false}
                helperText={(error === true)?"Please enter your password":false}
                className={classes.textField}
                label="Confirm Password"
                value={confirmPassword}
                type="password"
                onKeyDown={(e) => handleKeyDown(e)}
                onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    (e.target.value === '')?setError(true):setError(false);
                }}
                />
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Button
                variant="contained"
                color="primary"
                className={classes.button}
                >
                Sign Up
                </Button>
            </Grid>
        </Grid>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
