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
import { Groups as GroupsIcon, Grade as GradeIcon } from "@mui/icons-material";

export default function ChannelSelection() {
  const [channels, setChannels] = useState([
    { _id: 1, title: "General", icon: <GroupsIcon />, authorized: true, },
    { _id: 2, title: "Premium", icon: <GradeIcon />, authorized: false, },
  ]);
  return (
    <Box
      sx={{ color: "white", padding: "75px 0 95px 0", backgroundColor: "#23272a", width: "100%" }}
    >
      <Typography textAlign="center">Channels</Typography>
      <List>
        {channels.map((channel) => (
          <ListItem key={channel._id} disablePadding>
            <ListItemButton disabled={!channel.authorized}>
              <ListItemIcon sx={{ color: "inherit" }}>{channel.icon}</ListItemIcon>
              <ListItemText primary={channel.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
