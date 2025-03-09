import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Avatar,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { Delete, MoreHoriz } from '@mui/icons-material';
import { updateMessageList, deleteMessage, removeMessage, serverURL } from "../../Redux/actions";

export const MessageList = (props) => {
  const messages = useSelector(state => state.messages);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    dispatch(updateMessageList());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    props.socket.on("remove_message", (data) => {
      dispatch(removeMessage(data));
    }); // eslint-disable-next-line
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{
      padding: "75px 5px 0 5px",
    }}>
      <h4 style={{
        textAlign: "center",
        color: "white",
      }}>Messages:</h4>
      {messages.map((message, i) => {
        return (
          <Grid
            key={message._id || i}
            sx={
              message.user.username === user.username
                ? {
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: "10px 0px",
                  borderRadius: "7.5px",
                  backgroundColor: "rgb(21, 101, 192)",
                  color: "white"
                }
                : {
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: "10px 0px",
                  borderRadius: "7.5px",
                  backgroundColor: "#23272A",
                  color: "white"
                }
            }
            container
          >
            <Grid container item xs={2} sx={{ justifyContent: 'center', }}>
              <Avatar src={message.user.profilePicture ? `${serverURL}/user/image/${message.user.profilePicture}` : null} />
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h6" display="inline">
                {message.user.username}{" "}
              </Typography>
              <Typography
                variant="subtitle1"
                display="inline"
                sx={{
                  fontSize: "16px",
                  opacity: ".33",
                }}
              >
                {message.timeStamp == null
                  ? null
                  : `${new Date(message.timeStamp)
                    .toLocaleDateString()
                    .substr(
                      0,
                      new Date(message.timeStamp).toLocaleDateString()
                        .length - 5
                    )} ${new Date(message.timeStamp).toLocaleTimeString()}`}
              </Typography>
              <Typography variant="subtitle1" display="block">
                {message.message}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              {message.user.username === user.username ? (
                <IconButton onClick={() => dispatch(deleteMessage(message))}>
                  <Delete />
                </IconButton>
              ) : (
                <>
                  <IconButton aria-haspopup="true" onClick={handleClick}>
                    <MoreHoriz />
                  </IconButton>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>👍🏽</MenuItem>
                    <MenuItem onClick={handleClose}>🍞</MenuItem>
                    <MenuItem onClick={handleClose}>👎🏽</MenuItem>
                  </Menu>
                </>
              )}
            </Grid>
          </Grid>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;