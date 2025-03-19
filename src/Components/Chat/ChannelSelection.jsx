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
      sx={{ color: "white", padding: "75px 0 95px 0", backgroundColor: "#23272a", width: "100%" }}
    >
      <Typography textAlign="center">Channels</Typography>
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
