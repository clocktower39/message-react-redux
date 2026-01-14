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
import dayjs from 'dayjs';
import { updateMessageList, deleteMessage, removeMessage, serverURL } from "../../Redux/actions";

export const MessageList = ({ socket, activeChannel, }) => {
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
    socket.on("remove_message", (data) => {
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
        color: "var(--text-1)",
        letterSpacing: "0.6px",
      }}>{activeChannel.name} Messages: </h4>
      {messages.filter(message => message.channel === activeChannel._id).map((message, i) => {
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
                  background: "linear-gradient(135deg, rgba(255, 107, 61, 0.75), rgba(255, 138, 74, 0.75))",
                  color: "var(--text-0)",
                  boxShadow: "0 10px 18px rgba(255, 107, 61, 0.22)"
                }
                : {
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: "10px 0px",
                  borderRadius: "7.5px",
                  backgroundColor: "var(--bg-2)",
                  color: "var(--text-0)",
                  border: "1px solid var(--border)"
                }
            }
            container
          >
            <Grid container size={2} sx={{ justifyContent: 'center', }}>
              <Avatar src={message.user.profilePicture ? `${serverURL}/user/image/${message.user.profilePicture}` : null} />
            </Grid>
            <Grid size={8}>
              <Typography variant="body2" display="inline">
                {message.user.username}{" "}
              </Typography>
              <Typography
                variant="subtitle2"
                display="inline"
                sx={{
                  opacity: ".33",
                }}
              >
                {dayjs(message.timeStamp).format("MM/DD/YYYY h:mm:ss A")}
              </Typography>
              <Typography variant="body1" display="block">
                {message.message}
              </Typography>
            </Grid>
            <Grid size={2}>
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
