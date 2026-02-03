import {
  ADD_MESSAGE,
  LOGIN_USER,
  LOGOUT_USER,
  UPDATE_MESSAGE_LIST,
  PREPEND_MESSAGE_LIST,
  RESET_MESSAGE_LIST,
  UPDATE_MESSAGE_REACTIONS,
  ERROR,
} from "./actions";
import { messages, user } from "./states";

const dedupeMessages = (items = []) => {
  const seen = new Set();
  const deduped = [];

  items.forEach((message) => {
    const key = message?._id ? message._id.toString() : `${message?.timeStamp}-${message?.message}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    deduped.push(message);
  });

  return deduped;
};

export let reducer = (state = { messages, user }, action) => {
  switch (action.type) {
    case RESET_MESSAGE_LIST:
      return {
        ...state,
        messages: [],
      };
    case UPDATE_MESSAGE_LIST:
      return {
        ...state,
        messages: dedupeMessages(action.messages),
      };
    case PREPEND_MESSAGE_LIST:
      return {
        ...state,
        messages: dedupeMessages([...action.messages, ...state.messages]),
      };
    case ADD_MESSAGE:
      return {
        ...state,
        messages: dedupeMessages([
          ...state.messages,
          {
            _id: action.messageId,
            message: action.message,
            channel: action.channel,
            timeStamp: action.timeStamp,
            user: action.user,
          },
        ]),
      };
    case UPDATE_MESSAGE_REACTIONS:
      return {
        ...state,
        messages: state.messages.map((message) =>
          message._id === action.messageId
            ? { ...message, reactions: action.reactions }
            : message
        ),
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
