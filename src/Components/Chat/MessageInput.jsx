import React, { useEffect, useRef, useState } from "react";
import { Button, Container, TextField, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, sendMessage } from "../../Redux/actions";

export const MessageInput = ({ socket, activeChannel }) => {
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const lastTypingSentRef = useRef(0);
  const typingTimeoutRef = useRef(null);
  const typingActiveRef = useRef(false);
  const TYPING_THROTTLE_MS = 1500;
  const STOP_TYPING_DELAY_MS = 2000;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleMessageSubmit(e);
    }
  };

  const handleMessageSubmit = (e) => {
    if (message !== "" && activeChannel?._id) {
      dispatch(sendMessage(message, activeChannel?._id));
      emitStopTyping();
      setMessage("");
    }
  };

  const emitTyping = () => {
    if (!socket || !activeChannel?._id || !user?._id) {
      return;
    }

    const now = Date.now();
    if (now - lastTypingSentRef.current < TYPING_THROTTLE_MS) {
      return;
    }

    lastTypingSentRef.current = now;
    typingActiveRef.current = true;
    socket.emit("typing", {
      channelId: activeChannel._id,
      userId: user._id,
      username: user.username,
    });
  };

  const emitStopTyping = () => {
    if (!socket || !activeChannel?._id || !user?._id) {
      return;
    }

    if (!typingActiveRef.current) {
      return;
    }

    typingActiveRef.current = false;
    socket.emit("stop_typing", {
      channelId: activeChannel._id,
      userId: user._id,
    });
  };

  const handleTypingChange = (value) => {
    setMessage(value);
    value === "" ? setError(true) : setError(false);

    if (!value) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      emitStopTyping();
      return;
    }

    emitTyping();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping();
    }, STOP_TYPING_DELAY_MS);
  };

  useEffect(() => {
    if (!socket) {
      return undefined;
    }
    const handleMessage = (data) => {
      if (!activeChannel?._id || data.channel !== activeChannel._id) {
        return;
      }
      dispatch(addMessage(data._id, data.message, data.channel, data.timeStamp, data.user));
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket, dispatch, activeChannel?._id]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (socket && activeChannel?._id && user?._id && typingActiveRef.current) {
        socket.emit("stop_typing", {
          channelId: activeChannel._id,
          userId: user._id,
        });
        typingActiveRef.current = false;
      }
    };
  }, [socket, activeChannel?._id, user?._id]);

  return (
    <Container maxWidth="sm">
      <Grid
        container
        sx={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          backgroundColor: "var(--bg-2)",
          padding: "14px 0px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <Grid size={12}>
          <TextField
            fullWidth
            error={error === true ? true : false}
            helperText={error === true ? "Please enter a message" : false}
            label="Message"
            value={message}
            onKeyDown={(e) => handleKeyDown(e)}
            onChange={(e) => {
              handleTypingChange(e.target.value);
            }}
            InputProps={{
              endAdornment: (
                <Button variant="contained" color="primary" onClick={(e) => handleMessageSubmit(e)}>
                  Send
                </Button>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default MessageInput;
