import { ADD_MESSAGE, LOGIN_USER, LOGOUT_USER, UPDATE_MESSAGE_LIST, ERROR } from "./actions";
import { messages, user } from "./states";

export let reducer = (state = { messages, user }, action) => {
  switch (action.type) {
    case UPDATE_MESSAGE_LIST:
      return {
        ...state,
        messages: [...action.messages],
      };
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            _id: action.messageId,
            message: action.message,
            timeStamp: action.timeStamp,
            user: action.user,
          },
        ],
      };
    case LOGIN_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.user,
        },
      };
    case LOGOUT_USER:
      return {
        ...state,
        user: {},
      };
    case ERROR:
      return {
        ...state,
        error: { ...action.error },
      };
    default:
      return { ...state };
  }
};
