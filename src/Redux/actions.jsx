import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const ADD_MESSAGE = "ADD_MESSAGE";
export const LOGIN_USER = "LOGIN_USER";
export const LOGOUT_USER = "LOGOUT_USER";
export const SIGNUP_USER = "SIGNUP_USER";
export const UPDATE_MESSAGE_LIST = "UPDATE_MESSAGE_LIST";
export const UPDATE_USER_INFO = "UPDATE_USER_INFO";
export const ERROR = "ERROR";

// dev server
// const currentIP = window.location.href.split(":")[1];
// export const serverURL = `http:${currentIP}:8000`;

// live server
export const serverURL = "https://immense-harbor-48108.herokuapp.com";

export function sendMessage(message, socketId, activeChannel) {
  return async (dispatch, getState) => {
    const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;

    const response = await fetch(`${serverURL}/messages`, {
      method: "post",
      dataType: "json",
      body: JSON.stringify({ message, channel: activeChannel }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: bearer,
      },
    });

    const data = await response.json();

    if (data.error) {
      return dispatch({
        type: ERROR,
        error: data.error,
      });
    }
  };
}

export function addMessage(messageId, message, channel, timeStamp, user) {
  return {
    type: ADD_MESSAGE,
    messageId,
    message,
    channel,
    timeStamp,
    user: { ...user },
  };
}

export function updateMessageList() {
  return async (dispatch, getState) => {
    const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;

    const response = await fetch(`${serverURL}/messages`, {
      headers: {
        Authorization: bearer,
      },
    });
    const data = await response.json();

    return dispatch({
      type: UPDATE_MESSAGE_LIST,
      messages: [...data],
    });
  };
}

// user requests to delete their message
export function deleteMessage(messageToDelete) {
  return async (dispatch, getState) => {
    const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;
    let newMessage = JSON.stringify({ message: messageToDelete });

    const response = await fetch(`${serverURL}/deleteMessage`, {
      method: "post",
      dataType: "json",
      body: newMessage,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: bearer,
      },
    });

    const data = await response.json();

    if (data.error) {
      return dispatch({
        type: ERROR,
        error: data.error,
      });
    }
  };
}

// server io emit removes request deleted message
export function removeMessage(removedMessageId) {
  return async (dispatch, getState) => {
    const state = getState();
    const messages = state.messages.filter((message) => message._id !== removedMessageId);

    return dispatch({
      type: UPDATE_MESSAGE_LIST,
      messages,
    });
  };
}

export function uploadProfilePicture(formData) {
  return async (dispatch, getState) => {
    const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;

    axios
      .post(`${serverURL}/user/image/upload`, formData, {
        headers: { Authorization: bearer },
      })
      .then(async (res) => {
        const accessToken = res.data.accessToken;
        const decodedAccessToken = jwt(accessToken);

        localStorage.setItem("JWT_AUTH_TOKEN", accessToken);
        return dispatch({
          type: LOGIN_USER,
          user: decodedAccessToken,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function removeProfilePicture() {
  return async (dispatch, getState) => {
    const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;

    fetch(`${serverURL}/user/remove/image`, {
      headers: {
        Authorization: bearer,
      },
    });
  };
}

export function signupUser(user) {
  return async (dispatch) => {
    const response = await fetch(`${serverURL}/signup`, {
      method: "post",
      dataType: "json",
      body: JSON.stringify(user),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const data = await response.json();
    if (data.error) {
      return dispatch({
        type: ERROR,
        error: data.error,
      });
    }

    return dispatch(loginUser({ email: user.email, password: user.password }));
  };
}

export function loginUser(user) {
  return async (dispatch) => {
    const response = await fetch(`${serverURL}/login`, {
      method: "post",
      dataType: "json",
      body: user,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const data = await response.json();
    if (data.error) {
      return dispatch({
        type: ERROR,
        error: data.error,
      });
    }
    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;
    const decodedAccessToken = jwtDecode(accessToken);

    localStorage.setItem("JWT_AUTH_TOKEN", accessToken);
    localStorage.setItem("JWT_REFRESH_TOKEN", refreshToken);
    return dispatch({
      type: LOGIN_USER,
      user: decodedAccessToken,
    });
  };
}

export const loginJWT = () => {
  return async (dispatch) => {
    const refreshToken = localStorage.getItem("JWT_REFRESH_TOKEN");

    const response = await fetch(`${serverURL}/refresh-tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify({ refreshToken }), // Send the refresh token in the request body
    });

    const data = await response.json();
    if (data.accessToken) {
      const decodedAccessToken = jwtDecode(data.accessToken);
      localStorage.setItem("JWT_AUTH_TOKEN", data.accessToken);
      return dispatch({
        type: LOGIN_USER,
        user: decodedAccessToken,
      });
    } else {
      return dispatch({
        type: LOGOUT_USER,
      });
    }
  };
};

export function logoutUser() {
  return async (dispatch) => {
    localStorage.removeItem("JWT_AUTH_TOKEN");
    localStorage.removeItem("JWT_REFRESH_TOKEN");
    return dispatch({
      type: LOGOUT_USER,
    });
  };
}

export const updateUserInfo = (user) => {
  return {
    type: LOGIN_USER,
    user,
  };
};
