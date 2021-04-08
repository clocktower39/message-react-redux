import React, { useState, useEffect }  from 'react';
import { connect } from 'react-redux';
import { Button, TextField, makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux'
import { loginUser } from '../Redux/actions';

const useStyles = makeStyles({
    root: {
        textAlign: 'center',
    },
    textField: {
        margin: '12px',
    },
    button: {
        height: '100%',
    },

  });

export const Login = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [error, setError] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [password, setPassword] = useState('');

    const handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            handleLoginAttempt(e);
        }
    }
    const handleLoginAttempt = (e) => {
        if(username){
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
        <div className={classes.root}>
        <TextField
          error={error === true ? true : false}
          helperText={error === true ? "Please enter your username" : false}
          className={classes.textField}
          label="Username"
          value={username}
          onKeyDown={(e) => handleKeyDown(e)}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          error={error === true ? true : false}
          helperText={(error === true)?"Please enter your password":false}
          className={classes.textField}
          label="Password"
          value={password}
          onKeyDown={(e) => handleKeyDown(e)}
          onChange={(e) => {
              setPassword(e.target.value);
              (e.target.value === '')?setError(true):setError(false);
          }}
        />
        <Button
          className={classes.button}
          onClick={(e) => handleLoginAttempt(e)}
        >
          Login
        </Button>
        </div>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
