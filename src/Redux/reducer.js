import { ADD_MESSAGE } from './actions';
import { messages, user } from './states'

export let reducer = (state = { messages, user }, action) => {
    let newState = {...state};
    switch(action.type){
        case ADD_MESSAGE:
            newState.messages.push(
                {
                    user: action.user,
                    message: action.message
                })
            return newState; 
        default:
            break;
    }
    return state;
}