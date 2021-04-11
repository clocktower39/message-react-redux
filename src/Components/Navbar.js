import React from 'react'
import { AppBar, Button, makeStyles, Typography } from '@material-ui/core';
import { connect, useDispatch } from 'react-redux'
import { logoutUser } from '../Redux/actions';

const useStyles = makeStyles({
    root: {
        textAlign: 'center',
        padding: '15px',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
  });

export const Navbar = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    
    const handleLogout = () => {
        localStorage.removeItem('username');
        dispatch(logoutUser());
      }
      
    return (
        <AppBar className={classes.root} >
            <Typography variant='h4' className={classes.navTitle}>Bonfire</Typography>
            {(!props.user.username)?
            <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={(e) => alert('set up sign up')}
            >
            Sign Up
            </Button>:
            <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={(e) => handleLogout()}
            >
            Logout
            </Button>}
            
        </AppBar>
    )
}

const mapStateToProps = (state) => ({
    user: {...state.user},
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
