import { ADD_MESSAGE, LOGIN_USER, LOGOUT_USER, UPDATE_MESSAGE_LIST } from './actions';
import { messages, user } from './states'

export let reducer = (state = { messages, user }, action) => {
    switch(action.type){
        case UPDATE_MESSAGE_LIST:
            return { 
                ...state,
                messages: [...action.messages]
            }
        case ADD_MESSAGE:
            return { 
                ...state,
                messages: [...state.messages, {name: action.name, message: action.message}]
            }
        case LOGIN_USER:
            return { 
                ...state,
                user: {
                    ...action.user,
                    username: action.user.username
                },
            }
        case LOGOUT_USER:
            return { 
                ...state,
                user: {
                },
            }
        default:
            return {...state};
    }
}