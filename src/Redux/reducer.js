import { ADD_MESSAGE, UPDATE_MESSAGE_LIST } from './actions';
import { messages, user } from './states'

export let reducer = (state = { messages, user }, action) => {
    let newState = { ...state };
    switch(action.type){
        case UPDATE_MESSAGE_LIST:
            console.log('UPDATE_MESSAGE_LIST');
            newState.messages = fetch('http://10.37.39.39:3000/messages');
            return Object.assign({}, newState); 
        case ADD_MESSAGE:
            console.log('adding message')
            state.messages.push(
                {
                    name: action.name,
                    message: action.message
                })
            return Object.assign({}, newState); 
        default:
            return state;
    }
}