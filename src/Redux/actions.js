import jwt from 'jwt-decode';

export const ADD_MESSAGE = 'ADD_MESSAGE';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const SIGNUP_USER = 'SIGNUP_USER';
export const UPDATE_MESSAGE_LIST = 'UPDATE_MESSAGE_LIST';
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
export const ERROR = 'ERROR';

export function addMessage(name, message){
    return {
        type: ADD_MESSAGE,
        name: name,
        message: message,
        timeStamp: (new Date()),
    }
}
export function updateMessageList(messages){
    return {
        type: UPDATE_MESSAGE_LIST,
        messages: messages
    }
}

export function signupUser(user){
    return async (dispatch, getState) => {
        const response = await fetch('https://immense-harbor-48108.herokuapp.com/signup', {
            method: 'post',
            dataType: 'json',
            body: user,
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          })
        const data = await response.json();
        if(data.error){
            return dispatch({
                type: ERROR,
                error: data.error
            });
        }

        return dispatch(loginUser(user));
    }
}

export function loginUser(user){
    return async (dispatch, getState) => {
        const response = await fetch('https://immense-harbor-48108.herokuapp.com/login', {
            method: 'post',
            dataType: 'json',
            body: user,
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          })
        const data = await response.json();
        if(data.error){
            return dispatch({
                type: ERROR,
                error: data.error
            });
        }
        const accessToken = data.accessToken;
        const decodedAccessToken = jwt(accessToken);
        
        localStorage.setItem('JWT_AUTH_TOKEN', accessToken);
        return dispatch({
            type: LOGIN_USER,
            user: decodedAccessToken,
        });
    }
}

export const loginJWT = (token) => {
    return async (dispatch, getState) => {
        const decodedAccessToken = jwt(token);
        return dispatch({
            type: LOGIN_USER,
            user: decodedAccessToken,
        });
    }
}


export function logoutUser(){
    return async (dispatch, getState) => {
        localStorage.removeItem('JWT_AUTH_TOKEN');
        return dispatch({
            type: LOGOUT_USER
        })
    }
}

export const updateUserInfo = (user) => {
    return {
        type: LOGIN_USER,
        user
    }
}