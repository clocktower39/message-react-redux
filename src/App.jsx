import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import Chat from "./Components/Chat/Chat";
import Account from "./Components/Account/Account";
import ManageChannels from "./Components/Channels/ManageChannels";
import AuthRoute from "./Components/AuthRoute";
import NotFoundPage from "./Components/NotFoundPage";
import socketIOClient from "socket.io-client";
import { ThemeProvider } from "@mui/material";
import { serverURL } from "./Redux/actions";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { theme } from "./theme";

function App() {
  const userId = useSelector((state) => state.user._id);
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    if (userId) {
      const newSocket = socketIOClient(serverURL, {
        query: { userId },
        transports: ["websocket"],
        upgrade: false,
      });
      setSocket(newSocket);

      return () => newSocket.disconnect();
    }
  }, [userId]);

  return (
    <ThemeProvider theme={theme}>
      <Router basename="/message/">
        <Navbar />
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<SignUp />} />

          <Route exact path="/" element={<AuthRoute />}>
            <Route exact path="/" element={<Chat socket={socket} />} />
          </Route>
          <Route exact path="/account" element={<AuthRoute />}>
            <Route exact path="/account" element={<Account />} />
          </Route>
          <Route exact path="/channels" element={<AuthRoute />}>
            <Route exact path="/channels" element={<ManageChannels />} />
          </Route>

          <Route exact path="/*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
