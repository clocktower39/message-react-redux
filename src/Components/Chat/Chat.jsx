import React, { useState, useEffect } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import OnlineStatusBar from "./OnlineStatusBar";
import ChannelSelection from "./ChannelSelection";
import { Grid, Box } from "@mui/material";
import { serverURL } from "../../Redux/actions";

export default function Chat({ socket }) {
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);

  useEffect(() => {
    const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;

    fetch(`${serverURL}/api/channels`, {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: bearer,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setChannels(data);
        setActiveChannel(data[0] || null);
      });
  }, []);

  const handleChannelClick = (channel) => {
    setActiveChannel(channel);
    socket.emit("join_channel", channel._id);
  };

  return activeChannel ? (
    <Grid container sx={{ height: "100vh" }}>
      {/* Campground Selection Bar */}
      <Grid
        container
        item
        sm={3}
        sx={{
          backgroundColor: "#2c2f33",
          overflowY: "auto",
          display: { xs: "none", sm: "flex" },
        }}
      >
        <ChannelSelection
          socket={socket}
          channels={channels}
          handleChannelClick={handleChannelClick}
        />
      </Grid>

      {/* Chat Area */}
      <Grid
        container
        item
        xs={8}
        sm={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100vh",
        }}
      >
        {/* Messages List (scrollable) */}
        <Grid sx={{ flexGrow: 1, overflowY: "auto", scrollbarWidth: "thin" }}>
          <MessageList socket={socket} activeChannel={activeChannel} />
        </Grid>

        {/* Message Input */}
        <Grid sx={{ backgroundColor: "#2C2F33" }}>
          <MessageInput socket={socket} activeChannel={activeChannel} />
        </Grid>
      </Grid>

      {/* Online Status Bar */}
      <Grid
        container
        item
        xs={4}
        sm={3}
        sx={{ backgroundColor: "#2c2f33", overflowY: "auto", overflowX: "hidden" }}
      >
        <OnlineStatusBar socket={socket} activeChannel={activeChannel} />
      </Grid>
    </Grid>
  ) : (
    <>Loading</>
  );
}
