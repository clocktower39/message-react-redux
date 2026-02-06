import React, { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
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

  const getUserId = (user) => (typeof user === "string" ? user : user?._id);

  const getUserLabel = (user) => {
    if (!user) {
      return "Unknown user";
    }
    if (typeof user === "string") {
      const match = users.find((entry) => entry._id === user);
      return match?.username || match?.email || match?._id || user;
    }
    return (
      user.username ||
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.email ||
      user._id ||
      "Unknown user"
    );
  };

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

      <Stack spacing={3}>
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

        <Paper sx={{ padding: 2, backgroundColor: "var(--bg-1)", color: "var(--text-0)" }}>
          <Typography variant="h6">Friend Requests</Typography>
          <Divider sx={{ my: 1, borderColor: "var(--border)" }} />
          <List>
            {incoming.map((user) => {
              const userId = getUserId(user);
              return (
              <ListItem key={userId} secondaryAction={
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button size="small" variant="contained" onClick={() => acceptRequest(userId)}>
                    Accept
                  </Button>
                  <Button size="small" variant="outlined" onClick={() => declineRequest(userId)}>
                    Decline
                  </Button>
                </Box>
              }>
                <ListItemText primary={getUserLabel(user)} />
              </ListItem>
            )})}
            {incoming.length === 0 && (
              <ListItem>
                <ListItemText primary="No incoming requests." />
              </ListItem>
            )}
          </List>
        </Paper>

        <Paper sx={{ padding: 2, backgroundColor: "var(--bg-1)", color: "var(--text-0)" }}>
          <Typography variant="h6">Outgoing Requests</Typography>
          <Divider sx={{ my: 1, borderColor: "var(--border)" }} />
          <List>
            {outgoing.map((user) => {
              const userId = getUserId(user);
              return (
                <ListItem key={userId}>
                  <ListItemText primary={getUserLabel(user)} secondary="Pending" />
                </ListItem>
              );
            })}
            {outgoing.length === 0 && (
              <ListItem>
                <ListItemText primary="No outgoing requests." />
              </ListItem>
            )}
          </List>
        </Paper>

        <Paper sx={{ padding: 2, backgroundColor: "var(--bg-1)", color: "var(--text-0)" }}>
          <Typography variant="h6">Friends</Typography>
          <Divider sx={{ my: 1, borderColor: "var(--border)" }} />
          <List>
            {friends.map((user) => {
              const userId = getUserId(user);
              return (
                <ListItem
                  key={userId}
                  secondaryAction={
                    <Button size="small" variant="outlined" onClick={() => removeFriend(userId)}>
                      Remove
                    </Button>
                  }
                >
                  <ListItemText primary={getUserLabel(user)} />
                </ListItem>
              );
            })}
            {friends.length === 0 && (
              <ListItem>
                <ListItemText primary="No friends yet." />
              </ListItem>
            )}
          </List>
        </Paper>
      </Stack>
    </Box>
  );
}
