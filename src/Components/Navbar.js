import React from 'react'
import { Link, useLocation } from 'react-router-dom';
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
    const location = useLocation();
    
    const handleLogout = () => {
        localStorage.removeItem('username');
        dispatch(logoutUser());
      }
      
    return (
        <AppBar className={classes.root} >
            <Link to="/">
                <Typography variant='h4' className={classes.navTitle}>Bonfire</Typography>
            </Link>

            {(!props.user.username)?

            (location.pathname === '/signup')?

            <Link to="/">
                <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                >
                Login
                </Button>
            </Link>
            :
        
            <Link to="/signup">
                <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                >
                Sign Up
                </Button>
            </Link>
        
            :
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
