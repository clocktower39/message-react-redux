import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { serverURL } from "../../Redux/actions";

const emptyForm = {
  name: "",
  description: "",
  isPublic: true,
  users: [],
  admins: [],
};

const uniqueIds = (ids = []) => [...new Set(ids.filter(Boolean))];
const normalizeId = (value) => (value && value._id ? value._id : value);

export default function ManageChannels() {
  const userId = useSelector((state) => state.user._id);
  const [channels, setChannels] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState({ type: "", message: "" });

  const userLookup = useMemo(
    () => new Map(users.map((user) => [user._id, user])),
    [users]
  );

  const manageableChannels = useMemo(() => {
    if (!userId) {
      return [];
    }
    return channels.filter((channel) => {
      const createdById = normalizeId(channel.createdBy);
      const adminIds = (channel.admins || []).map(normalizeId);
      return createdById === userId || adminIds.includes(userId);
    });
  }, [channels, userId]);

  const canManageSelected = useMemo(() => {
    if (!selectedId) {
      return true;
    }
    return manageableChannels.some((channel) => channel._id === selectedId);
  }, [manageableChannels, selectedId]);

  const selectedUsers = useMemo(
    () => form.users.map((id) => userLookup.get(id)).filter(Boolean),
    [form.users, userLookup]
  );

  const selectedAdmins = useMemo(
    () => form.admins.map((id) => userLookup.get(id)).filter(Boolean),
    [form.admins, userLookup]
  );

  const loadUsers = async () => {
    const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;
    const response = await fetch(`${serverURL}/users`, {
      headers: { Authorization: bearer },
    });
    const data = await response.json();
    setUsers(data.users || []);
  };

  const loadChannels = async () => {
    const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;
    const response = await fetch(`${serverURL}/api/channels`, {
      headers: { Authorization: bearer },
    });
    const data = await response.json();
    setChannels(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadUsers();
    loadChannels();
  }, []);

  useEffect(() => {
    if (userId && form.admins.length === 0 && selectedId === null) {
      setForm((prev) => ({ ...prev, admins: uniqueIds([userId]) }));
    }
  }, [userId, form.admins.length, selectedId]);

  const resetForm = () => {
    setSelectedId(null);
    setForm({
      ...emptyForm,
      admins: userId ? [userId] : [],
    });
    setStatus({ type: "", message: "" });
  };

  const selectChannel = (channel) => {
    const channelUsers = (channel.users || []).map(normalizeId);
    const channelAdmins = (channel.admins || []).map(normalizeId);

    setSelectedId(channel._id);
    setForm({
      name: channel.name || "",
      description: channel.description || "",
      isPublic: Boolean(channel.isPublic),
      users: channelUsers,
      admins: uniqueIds(channelAdmins),
    });
    setStatus({ type: "", message: "" });
  };

  const handlePublicChange = (event) => {
    const nextIsPublic = event.target.checked;
    setForm((prev) => ({
      ...prev,
      isPublic: nextIsPublic,
      users: nextIsPublic
        ? prev.users
        : uniqueIds([...prev.users, ...prev.admins, userId]),
    }));
  };

  const handleUsersChange = (event, values) => {
    const nextUsers = values.map((user) => user._id);
    setForm((prev) => ({
      ...prev,
      users: prev.isPublic
        ? uniqueIds(nextUsers)
        : uniqueIds([...nextUsers, ...prev.admins, userId]),
    }));
  };

  const handleAdminsChange = (event, values) => {
    const nextAdmins = uniqueIds(values.map((user) => user._id));
    setForm((prev) => ({
      ...prev,
      admins: nextAdmins,
      users: prev.isPublic
        ? prev.users
        : uniqueIds([...prev.users, ...nextAdmins, userId]),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      isPublic: form.isPublic,
      users: form.users,
      admins: uniqueIds([...form.admins, userId]),
    };

    const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;
    const url = selectedId
      ? `${serverURL}/api/channels/${selectedId}`
      : `${serverURL}/api/channels`;
    const method = selectedId ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: bearer,
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      setStatus({
        type: "error",
        message: error.error || "Failed to save channel.",
      });
      return;
    }

    const saved = await response.json();
    await loadChannels();
    setSelectedId(saved._id);
    setForm({
      name: saved.name || "",
      description: saved.description || "",
      isPublic: Boolean(saved.isPublic),
      users: (saved.users || []).map(normalizeId),
      admins: (saved.admins || []).map(normalizeId),
    });
    setStatus({
      type: "success",
      message: selectedId ? "Channel updated." : "Channel created.",
    });
  };

  const handleDelete = async () => {
    if (!selectedId) {
      return;
    }

    if (!window.confirm("Delete this channel? This cannot be undone.")) {
      return;
    }

    const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;
    const response = await fetch(`${serverURL}/api/channels/${selectedId}`, {
      method: "DELETE",
      headers: { Authorization: bearer },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      setStatus({
        type: "error",
        message: error.error || "Failed to delete channel.",
      });
      return;
    }

    await loadChannels();
    resetForm();
    setStatus({ type: "success", message: "Channel deleted." });
  };

  return (
    <Box sx={{ padding: "90px 24px 32px" }}>
      <Typography variant="h4" sx={{ color: "var(--accent)", fontFamily: "Poppins" }}>
        Manage Channels
      </Typography>
      <Typography sx={{ color: "var(--text-1)", marginBottom: 2 }}>
        Create, rename, or remove channels and manage access.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: 2, backgroundColor: "var(--bg-2)", color: "var(--text-0)" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Channels</Typography>
              <Button variant="outlined" size="small" onClick={resetForm}>
                New
              </Button>
            </Box>
            <Divider sx={{ my: 1, borderColor: "var(--border)" }} />
            <List>
              {channels.map((channel) => {
                const isManageable = manageableChannels.some(
                  (manageable) => manageable._id === channel._id
                );
                return (
                <ListItemButton
                  key={channel._id}
                  selected={channel._id === selectedId}
                  onClick={() => selectChannel(channel)}
                >
                  <ListItemText
                    primary={channel.name}
                    secondary={
                      channel.isPublic ? "Public" : isManageable ? "Private (manager)" : "Private"
                    }
                  />
                </ListItemButton>
                );
              })}
              {channels.length === 0 && (
                <Typography sx={{ padding: 2, color: "var(--text-2)" }}>
                  No channels available yet.
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ padding: 3, backgroundColor: "var(--bg-1)", color: "var(--text-0)" }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              {selectedId ? "Edit channel" : "Create a new channel"}
            </Typography>

            {status.message && (
              <Alert severity={status.type} sx={{ mb: 2 }}>
                {status.message}
              </Alert>
            )}
            {!canManageSelected && selectedId && (
              <Alert severity="info" sx={{ mb: 2 }}>
                You can view this channel, but only its creator or admins can edit it.
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Channel name"
                variant="outlined"
                fullWidth
                required
                disabled={!canManageSelected && Boolean(selectedId)}
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                disabled={!canManageSelected && Boolean(selectedId)}
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, description: event.target.value }))
                }
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={form.isPublic}
                    onChange={handlePublicChange}
                    disabled={!canManageSelected && Boolean(selectedId)}
                  />
                }
                label={form.isPublic ? "Public channel" : "Private channel"}
                sx={{ mb: 2 }}
              />

              <Autocomplete
                multiple
                options={users}
                getOptionLabel={(option) => option.username || ""}
                value={selectedUsers}
                onChange={handleUsersChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Members"
                    placeholder="Select users"
                    disabled={!canManageSelected && Boolean(selectedId)}
                    helperText={
                      form.isPublic
                        ? "Optional for public channels."
                        : "Private channels require members."
                    }
                  />
                )}
                sx={{ mb: 2 }}
                isOptionEqualToValue={(option, value) => option._id === value._id}
              />

              <Autocomplete
                multiple
                options={users}
                getOptionLabel={(option) => option.username || ""}
                value={selectedAdmins}
                onChange={handleAdminsChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Admins"
                    placeholder="Select admins"
                    disabled={!canManageSelected && Boolean(selectedId)}
                  />
                )}
                sx={{ mb: 3 }}
                isOptionEqualToValue={(option, value) => option._id === value._id}
              />

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!canManageSelected && Boolean(selectedId)}
                >
                  {selectedId ? "Save changes" : "Create channel"}
                </Button>
                {selectedId && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleDelete}
                    disabled={!canManageSelected}
                  >
                    Delete channel
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
