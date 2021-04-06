export const ADD_MESSAGE = 'ADD_MESSAGE';
export const UPDATE_MESSAGE_LIST = 'UPDATE_MESSAGE_LIST';

export function addMessage(name, message){
    return {
        type: ADD_MESSAGE,
        name: name,
        message: message,
    }
}
export function updateMessageList(messages){
    return {
        type: UPDATE_MESSAGE_LIST,
        messages: messages
    }
}