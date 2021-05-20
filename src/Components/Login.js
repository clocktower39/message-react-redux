import React, { useState }  from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Button, TextField, Grid, Paper, makeStyles } from '@material-ui/core';
import { loginUser } from '../Redux/actions';

const useStyles = makeStyles({
    root: {
        padding: '125px 0',
        textAlign: 'center',
    },
    textField: {
        margin: '12px',
    },
    button: {
    },

  });

export const Login = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [error, setError] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [password, setPassword] = useState('');
    const [disableButtonDuringLogin, setDisableButtonDuringLogin] = useState(false);
    const user = useSelector(state => state.user);

    const handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            handleLoginAttempt(e);
        }
    }
    const handleLoginAttempt = (e) => {
        if(username  && password){
            setDisableButtonDuringLogin(true);
            dispatch(loginUser(JSON.stringify({username: username, password: password}))).then(res=>{
                if(res.error){
                    setError(true);
                }
                setDisableButtonDuringLogin(false);
            });
            localStorage.setItem('username', username);
        }
        else{
            setDisableButtonDuringLogin(false);
        }
    }

    if(user.username){
        return (<Redirect to={{ pathname: '/'}} />)
    }
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
                <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={(e) => handleLoginAttempt(e)}
                disabled={disableButtonDuringLogin}
                >
                Login
                </Button>
            </Grid>
        </Grid>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
