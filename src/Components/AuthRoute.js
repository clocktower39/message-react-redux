import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { loginUser } from '../Redux/actions';
import Loading from './Loading';

export const AuthRoute = (props) => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(localStorage.getItem('authorizationToken'));
    const Component = props.component;

    const handleLoginAttempt = async(e) => {
        //change into post request to login, if successful then dispatch login with returned data
        let loginAttempt = JSON.stringify({username:localStorage.getItem('username'), password:'', authenticated: localStorage.getItem('authenticated') });

        dispatch(loginUser(loginAttempt)).then(()=>setLoading(false));
    }

    useEffect(()=>{
        if(localStorage.getItem('authorizationToken')){
            handleLoginAttempt();
        }
        // eslint-disable-next-line
    },[])

    return loading!==null?<Loading />:(isAuthenticated === true)?<Component />:<Redirect to={{ pathname: '/login'}} />;
}

export default AuthRoute
