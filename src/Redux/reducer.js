import { ADD_MESSAGE } from './actions';
import { messages, user } from './states'

export let reducer = (state = { messages, user }, action) => {
    let newState = { ...state };
    switch(action.type){
        case ADD_MESSAGE:
            console.log('adding message')
            state.messages.push(
                {
                    user: action.user,
                    message: action.message
                })
            return Object.assign({}, newState); 
        default:
            return state;
    }
}