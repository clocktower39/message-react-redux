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
      <Grid container item xs={3} sx={{ backgroundColor: "#2c2f33", overflowY: "auto" }}>
        <ChannelSelection socket={socket} />
      </Grid>

      {/* Chat Area */}
      <Grid
        container
        item
        xs={6}
        sx={{ display: "flex", flexDirection: "column", position: "relative", height: "100vh" }}
      >
        {/* Messages List (scrollable) */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", paddingBottom: "72px" }}>
          <MessageList socket={socket} />
        </Box>

        {/* Fixed Message Input */}
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: "50%", // Centers it based on the grid
            transform: "translateX(-50%)", // Adjusts centering
            width: "50vw", // Adjust width dynamically (change as needed)
            backgroundColor: "#2C2F33",
          }}
        >
          <MessageInput socket={socket} />
        </Box>
      </Grid>

      {/* Online Status Bar */}
      <Grid container item xs={3} sx={{ backgroundColor: "#2c2f33", overflowY: "auto" }}>
        <OnlineStatusBar socket={socket} />
      </Grid>
    </Grid>
  );
}
