export const ADD_MESSAGE = 'ADD_MESSAGE';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const UPDATE_MESSAGE_LIST = 'UPDATE_MESSAGE_LIST';

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

export function loginUser(user){
    return {
        type: LOGIN_USER,
        user: user
    }
}

export function logoutUser(){
    return {
        type: LOGOUT_USER
    }
}
