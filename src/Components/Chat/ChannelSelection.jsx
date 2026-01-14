import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { ChatBubble, } from "@mui/icons-material";

export default function ChannelSelection({ socket, channels, activeChannel, handleChannelClick }) {
  return (
    <Box
      sx={{
        color: "var(--text-0)",
        padding: "75px 0 95px 0",
        backgroundColor: "var(--bg-2)",
        width: "100%",
        borderRight: "1px solid var(--border)",
      }}
    >
      <Typography textAlign="center" sx={{ color: "var(--text-1)", letterSpacing: "0.6px" }}>
        Channels
      </Typography>
      <List>
        {channels.map((channel) => (
          <ListItem key={channel._id} disablePadding>
            <ListItemButton onClick={() => handleChannelClick(channel)}>
              <ListItemIcon sx={{ color: "inherit" }}><ChatBubble /></ListItemIcon>
              <ListItemText primary={channel.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
