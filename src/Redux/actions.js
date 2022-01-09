import jwt from 'jwt-decode';

export const ADD_MESSAGE = 'ADD_MESSAGE';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const SIGNUP_USER = 'SIGNUP_USER';
export const UPDATE_MESSAGE_LIST = 'UPDATE_MESSAGE_LIST';
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
export const ERROR = 'ERROR';

// dev server
// const currentIP = window.location.href.split(":")[1];
// const serverURL = `http:${currentIP}:8000`;

// live server
const serverURL = "https://immense-harbor-48108.herokuapp.com";

export function sendMessage(name, message) {
    return async (dispatch, getState) => {
        const bearer = `Bearer ${localStorage.getItem('JWT_AUTH_TOKEN')}`;
        let newMessage = JSON.stringify({ name: name, message: message });

        const response = await fetch(`${serverURL}/messages`, {
            method: 'post', dataType: 'json',
            body: newMessage,
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": bearer,
            }
        });

        const data = await response.json();

        if (data.error) {
            return dispatch({
                type: ERROR,
                error: data.error
            });
        }
    }
}

export function addMessage(name, message) {
    return {
        type: ADD_MESSAGE,
        name: name,
        message: message,
        timeStamp: (new Date()),
    }
}

export function updateMessageList() {
    return async (dispatch, getState) => {
        const bearer = `Bearer ${localStorage.getItem('JWT_AUTH_TOKEN')}`;

        const response = await fetch(`${serverURL}/messages`, {
            headers: {
                "Authorization": bearer,
            }
        });
        const data = await response.json();

        return dispatch({
            type: UPDATE_MESSAGE_LIST,
            messages: [...data]
        })
    }
}

export function deleteMessage(messageToDelete) {
    return async (dispatch, getState) => {
        const state = getState();

        const messages = state.messages.filter((message) => message._id !== messageToDelete._id)

        return dispatch({
            type: UPDATE_MESSAGE_LIST,
            messages
        });
    }
}

export function signupUser(user) {
    return async (dispatch, getState) => {
        const response = await fetch(`${serverURL}/signup`, {
            method: 'post',
            dataType: 'json',
            body: user,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        const data = await response.json();
        if (data.error) {
            return dispatch({
                type: ERROR,
                error: data.error
            });
        }

        return dispatch(loginUser(user));
    }
}

export function loginUser(user) {
    return async (dispatch, getState) => {
        const response = await fetch(`${serverURL}/login`, {
            method: 'post',
            dataType: 'json',
            body: user,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        const data = await response.json();
        if (data.error) {
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
        const bearer = `Bearer ${localStorage.getItem('JWT_AUTH_TOKEN')}`;

        const response = await fetch(`${serverURL}/checkAuthToken`, {
            headers: {
                "Authorization": bearer,
            }
        })

        const text = await response.text().then(item => item);
        if (text === "Authorized") {
            const decodedAccessToken = jwt(token);
            return dispatch({
                type: LOGIN_USER,
                user: decodedAccessToken,
            });
        }
        else {
            localStorage.removeItem('JWT_AUTH_TOKEN');
            return dispatch({
                type: LOGOUT_USER
            })
        }
    }
}


export function logoutUser() {
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