import React from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import OnlineStatusBar from "./OnlineStatusBar";
import ChannelSelection from "./ChannelSelection";
import { Grid, Box } from "@mui/material";

export default function Chat({ socket }) {
  return (
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
        <ChannelSelection socket={socket} />
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
        <Grid sx={{ flexGrow: 1, overflowY: "auto" }}>
          <MessageList socket={socket} />
        </Grid>

        {/* Message Input */}
        <Grid sx={{ backgroundColor: "#2C2F33", }}>
          <MessageInput socket={socket} />
        </Grid>
      </Grid>

      {/* Online Status Bar */}
      <Grid container item xs={4} sm={3} sx={{ backgroundColor: "#2c2f33", overflowY: "auto", overflowX: 'hidden', }}>
        <OnlineStatusBar socket={socket} />
      </Grid>
    </Grid>
  );
}
