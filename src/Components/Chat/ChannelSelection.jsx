import React, { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { ChatBubble } from "@mui/icons-material";
import { serverURL } from "../../Redux/actions";

export default function ChannelSelection({
  channels,
  handleChannelClick,
  onDmCreated,
  currentUserId,
}) {
  const [friends, setFriends] = useState([]);
  const [dmOpen, setDmOpen] = useState(false);
  const [dmTarget, setDmTarget] = useState(null);

  const channelList = useMemo(
    () => channels.filter((channel) => !channel.isDM),
    [channels]
  );
  const dmList = useMemo(() => channels.filter((channel) => channel.isDM), [channels]);

  useEffect(() => {
    const loadFriends = async () => {
      const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;
      const response = await fetch(`${serverURL}/friends`, {
        headers: { Authorization: bearer },
      });
      const data = await response.json();
      setFriends(Array.isArray(data.friends) ? data.friends : []);
    };
    loadFriends();
  }, []);

  const handleCreateDm = async () => {
    if (!dmTarget) {
      return;
    }

    const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;
    const response = await fetch(`${serverURL}/api/dms`, {
      method: "POST",
      headers: {
        Authorization: bearer,
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ userId: dmTarget._id }),
    });
    const data = await response.json();
    if (data && data._id) {
      onDmCreated?.(data);
    }
    setDmOpen(false);
    setDmTarget(null);
  };

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
        {channelList.map((channel) => (
          <ListItem key={channel._id} disablePadding>
            <ListItemButton onClick={() => handleChannelClick(channel)}>
              <ListItemIcon sx={{ color: "inherit" }}>
                <ChatBubble />
              </ListItemIcon>
              <ListItemText primary={channel.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ borderColor: "var(--border)", my: 1 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", px: 2, pb: 1 }}>
        <Typography sx={{ color: "var(--text-1)", letterSpacing: "0.6px" }}>
          Direct Messages
        </Typography>
        <Button size="small" variant="outlined" onClick={() => setDmOpen(true)}>
          New
        </Button>
      </Box>
      <List>
        {dmList.map((channel) => {
          const names = (channel.users || [])
            .filter((user) => user._id !== currentUserId)
            .map((user) => user.username)
            .join(", ");
          return (
            <ListItem key={channel._id} disablePadding>
              <ListItemButton onClick={() => handleChannelClick(channel)}>
                <ListItemIcon sx={{ color: "inherit" }}>
                  <ChatBubble />
                </ListItemIcon>
                <ListItemText primary={names || "Direct Message"} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Dialog open={dmOpen} onClose={() => setDmOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Start a DM</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={friends}
            getOptionLabel={(option) => option.username || ""}
            value={dmTarget}
            onChange={(event, value) => setDmTarget(value)}
            renderInput={(params) => (
              <TextField {...params} label="Friend" placeholder="Pick a friend" />
            )}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDmOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateDm} disabled={!dmTarget}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
