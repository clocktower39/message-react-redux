import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Button, IconButton, makeStyles, Typography } from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import { connect, useDispatch } from 'react-redux'
import { logoutUser } from '../Redux/actions';
import Logo from '../img/BonfireLogo.png';

const useStyles = makeStyles({
    root: {
        textAlign: 'center',
        padding: '15px',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#23272a',
    },
    Link: {
        color: 'white',
        textDecoration: 'none',
    }
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
            <Link to="/" className={classes.Link} >
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center',}}>
                    <Typography variant='h4' className={classes.navTitle}>Bonfire</Typography>
                    <img src={Logo} alt="Bonfire logo" style={{height: '25px', width: '25px',}}/>
                </div>
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
        
            :<div>
            <Link to="/account">
            <IconButton style={props.user.username === "GUEST"?{display: 'none'}:{color: 'white'}}><Settings /></IconButton>
            </Link>
            <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={(e) => handleLogout()}
            >
            Logout
            </Button>
            </div>}
            
        </AppBar>
    )
}

const mapStateToProps = (state) => ({
    user: {...state.user},
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
