import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from 'react-redux';
import { store } from './Redux/store';
import socketIOClient from "socket.io-client";
import { serverURL } from "./Redux/actions";

const socket = socketIOClient(serverURL, { transports: ["websocket"], upgrade: false });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App socket={socket} />
    </Provider>
  </StrictMode>
);
