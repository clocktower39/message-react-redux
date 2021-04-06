import { ADD_MESSAGE, UPDATE_MESSAGE_LIST } from './actions';
import { messages, user } from './states'

export let reducer = (state = { messages, user }, action) => {
    switch(action.type){
        case UPDATE_MESSAGE_LIST:
            return { 
                ...state,
                messages: [...state.messages, ...action.messages]
            }
        case ADD_MESSAGE:
            return { 
                ...state,
                messages: [...state.messages, {name: action.name, message: action.message}]
            }
        default:
            return {...state};
    }
}