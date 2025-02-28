import React, { useState, useEffect } from "react";
import { Button, Container, TextField, Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { addMessage, sendMessage } from "../../Redux/actions";

export const MessageInput = (props) => {
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleMessageSubmit(e);
    }
  };

  const handleMessageSubmit = (e) => {
    if (message !== '') {
      dispatch(sendMessage(message))
      setMessage('');
    }
  }

  useEffect(() => {
    props.socket.on("message", (data) => {
      console.log('socket message')
      dispatch(addMessage(data._id, data.message, data.timeStamp, data.user, ));
    }); // eslint-disable-next-line
  }, []);

  return (
    <Container maxWidth="sm">
      <Grid
        container
        sx={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          backgroundColor: "#23272a",
          padding: '12.5px 0px'
        }}
      >
        <Grid item xs={12}>
          <TextField
            fullWidth
            error={error === true ? true : false}
            helperText={error === true ? "Please enter a message" : false}
            label="Message"
            value={message}
            onKeyDown={(e) => handleKeyDown(e)}
            onChange={(e) => {
              setMessage(e.target.value);
              e.target.value === "" ? setError(true) : setError(false);
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
