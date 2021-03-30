export const ADD_MESSAGE = 'ADD_MESSAGE';

export function addMessage(user, message){
    return {
        type: ADD_MESSAGE,
        user: user,
        message: message,
    }
}