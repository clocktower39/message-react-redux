import React, { useEffect, useRef } from "react";
import { connect, useDispatch } from "react-redux";
import {
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { Person, Delete, MoreHoriz } from '@mui/icons-material';
import { updateMessageList, deleteMessage } from "../../Redux/actions";

export const MessageList = (props) => {

  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [props.messages]);

  useEffect(() => {
    fetch("https://immense-harbor-48108.herokuapp.com/messages/", {
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("JWT_AUTH_TOKEN"),
      }),
    })
      .then((res) => res.json())
      .then((data) => dispatch(updateMessageList([...data])));
    // eslint-disable-next-line
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
      padding: "75px 0 95px 0",
    }}>
      <h4 style={{
        textAlign: "center",
        color: "white",
      }}>Messages:</h4>
      {props.messages.map((message, i) => {
        return (
          <Grid
            key={message._id || i}
            sx={
              message.name === props.user.username
                ? {
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: "10px",
                  borderRadius: "7.5px",
                  backgroundColor: "#3f51b5",
                  color: "white"
                }
                : {
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: "10px",
                  borderRadius: "7.5px",
                  backgroundColor: "#23272A",
                  color: "white"
                }
            }
            container
          >
            <Grid item xs={2}>
              <Person sx={{
                padding: "15px",
              }} />
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h6" display="inline">
                {message.name}{" "}
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
              {message.name === props.user.username ? (
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

const mapStateToProps = (state) => ({
  messages: [...state.messages],
  user: state.user,
});

const mapDispatchToProps = {
  updateMessageList,
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);
