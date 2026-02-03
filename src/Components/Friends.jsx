import React, { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { serverURL } from "../Redux/actions";

export default function Friends() {
  const currentUserId = useSelector((state) => state.user._id);
  const [friends, setFriends] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [status, setStatus] = useState("");

  const availableUsers = useMemo(() => {
    const friendIds = new Set(friends.map((friend) => friend._id));
    const incomingIds = new Set(incoming.map((user) => user._id));
    const outgoingIds = new Set(outgoing.map((user) => user._id));
    return users.filter(
      (user) =>
        user._id !== currentUserId &&
        !friendIds.has(user._id) &&
        !incomingIds.has(user._id) &&
        !outgoingIds.has(user._id)
    );
  }, [users, friends, incoming, outgoing, currentUserId]);

  const loadFriends = async () => {
    const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;
    const response = await fetch(`${serverURL}/friends`, {
      headers: { Authorization: bearer },
    });
    const data = await response.json();
    setFriends(Array.isArray(data.friends) ? data.friends : []);
    setIncoming(Array.isArray(data.incoming) ? data.incoming : []);
    setOutgoing(Array.isArray(data.outgoing) ? data.outgoing : []);
  };

  const loadUsers = async () => {
    const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;
    const response = await fetch(`${serverURL}/users`, {
      headers: { Authorization: bearer },
    });
    const data = await response.json();
    setUsers(Array.isArray(data.users) ? data.users : []);
  };

  useEffect(() => {
    loadFriends();
    loadUsers();
  }, []);

  const sendRequest = async () => {
    if (!selectedUser) {
      return;
    }
    const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;
    const response = await fetch(`${serverURL}/friends/request`, {
      method: "POST",
      headers: {
        Authorization: bearer,
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ userId: selectedUser._id }),
    });
    const data = await response.json();
    if (data.error) {
      setStatus(data.error);
    } else {
      setStatus("Friend request sent.");
      setSelectedUser(null);
      setFriends(Array.isArray(data.friends) ? data.friends : []);
      setIncoming(Array.isArray(data.incoming) ? data.incoming : []);
      setOutgoing(Array.isArray(data.outgoing) ? data.outgoing : []);
    }
  };

  const acceptRequest = async (userId) => {
    const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;
    const response = await fetch(`${serverURL}/friends/accept`, {
      method: "POST",
      headers: {
        Authorization: bearer,
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    if (!data.error) {
      setFriends(Array.isArray(data.friends) ? data.friends : []);
      setIncoming(Array.isArray(data.incoming) ? data.incoming : []);
      setOutgoing(Array.isArray(data.outgoing) ? data.outgoing : []);
    }
  };

  const declineRequest = async (userId) => {
    const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;
    const response = await fetch(`${serverURL}/friends/decline`, {
      method: "POST",
      headers: {
        Authorization: bearer,
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    if (!data.error) {
      setFriends(Array.isArray(data.friends) ? data.friends : []);
      setIncoming(Array.isArray(data.incoming) ? data.incoming : []);
      setOutgoing(Array.isArray(data.outgoing) ? data.outgoing : []);
    }
  };

  const removeFriend = async (userId) => {
    const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;
    const response = await fetch(`${serverURL}/friends/remove`, {
      method: "DELETE",
      headers: {
        Authorization: bearer,
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    if (!data.error) {
      setFriends(Array.isArray(data.friends) ? data.friends : []);
      setIncoming(Array.isArray(data.incoming) ? data.incoming : []);
      setOutgoing(Array.isArray(data.outgoing) ? data.outgoing : []);
    }
  };

  return (
    <Box sx={{ padding: "90px 24px 32px" }}>
      <Typography variant="h4" sx={{ color: "var(--accent)", fontFamily: "Poppins" }}>
        Friends
      </Typography>
      <Typography sx={{ color: "var(--text-1)", marginBottom: 2 }}>
        Manage your friend list and requests.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: 2, backgroundColor: "var(--bg-2)", color: "var(--text-0)" }}>
            <Typography variant="h6">Add Friend</Typography>
            <Divider sx={{ my: 1, borderColor: "var(--border)" }} />
            <Autocomplete
              options={availableUsers}
              getOptionLabel={(option) => option.username || ""}
              value={selectedUser}
              onChange={(event, value) => setSelectedUser(value)}
              renderInput={(params) => (
                <TextField {...params} label="User" placeholder="Select a user" />
              )}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={sendRequest} disabled={!selectedUser}>
              Send Request
            </Button>
            {status && (
              <Typography sx={{ marginTop: 2, color: "var(--text-2)" }}>{status}</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ padding: 2, backgroundColor: "var(--bg-1)", color: "var(--text-0)" }}>
            <Typography variant="h6">Friend Requests</Typography>
            <Divider sx={{ my: 1, borderColor: "var(--border)" }} />
            <List>
              {incoming.map((user) => (
                <ListItem key={user._id} secondaryAction={
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button size="small" variant="contained" onClick={() => acceptRequest(user._id)}>
                      Accept
                    </Button>
                    <Button size="small" variant="outlined" onClick={() => declineRequest(user._id)}>
                      Decline
                    </Button>
                  </Box>
                }>
                  <ListItemText primary={user.username} />
                </ListItem>
              ))}
              {incoming.length === 0 && (
                <ListItem>
                  <ListItemText primary="No incoming requests." />
                </ListItem>
              )}
            </List>

            <Divider sx={{ my: 2, borderColor: "var(--border)" }} />

            <Typography variant="h6">Outgoing Requests</Typography>
            <List>
              {outgoing.map((user) => (
                <ListItem key={user._id}>
                  <ListItemText primary={user.username} secondary="Pending" />
                </ListItem>
              ))}
              {outgoing.length === 0 && (
                <ListItem>
                  <ListItemText primary="No outgoing requests." />
                </ListItem>
              )}
            </List>

            <Divider sx={{ my: 2, borderColor: "var(--border)" }} />

            <Typography variant="h6">Friends</Typography>
            <List>
              {friends.map((user) => (
                <ListItem
                  key={user._id}
                  secondaryAction={
                    <Button size="small" variant="outlined" onClick={() => removeFriend(user._id)}>
                      Remove
                    </Button>
                  }
                >
                  <ListItemText primary={user.username} />
                </ListItem>
              ))}
              {friends.length === 0 && (
                <ListItem>
                  <ListItemText primary="No friends yet." />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
