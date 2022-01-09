import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './Redux/store';
import socketIOClient from "socket.io-client";

// dev server
// const currentIP = window.location.href.split(":")[1];
// const serverURL = `http:${currentIP}:8000`;

// live server
const ENDPOINT = "https://immense-harbor-48108.herokuapp.com";

const socket = socketIOClient(ENDPOINT,{transports: ['websocket'], upgrade: false});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App  socket={socket}/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
