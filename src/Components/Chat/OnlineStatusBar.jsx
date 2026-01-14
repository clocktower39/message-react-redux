import React, { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { green, grey } from "@mui/material/colors";
import { serverURL } from "../../Redux/actions";

export default function OnlineStatusBar({ socket, activeChannel }) {
  const [users, setUsers] = useState([]);
  const [clientStatuses, setClientStatuses] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;
      try {
        const response = await fetch(`${serverURL}/users`, {
          headers: {
            Authorization: bearer,
          },
        });

        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (socket) {
      // Listen for current client statuses
      socket.on("currentClientStatuses", (statuses) => {
        setClientStatuses(statuses);
      });

      // Listen for individual client status changes
      socket.on("clientStatusChanged", ({ userId, status }) => {
        setClientStatuses((prevStatuses) => ({
          ...prevStatuses,
          [userId]: status,
        }));
      });

      // Request current online statuses from the server
      socket.emit("requestClientStatuses");

      // Clean up socket listeners on unmount
      return () => {
        socket.off("currentClientStatuses");
        socket.off("clientStatusChanged");
      };
    }
  }, [socket]);

  return (
    <Box
      sx={{
        color: "var(--text-0)",
        padding: "75px 0 95px 0",
        backgroundColor: "var(--bg-2)",
        width: "100%",
        borderLeft: "1px solid var(--border)",
      }}
    >
      <Typography textAlign="center" sx={{ color: "var(--text-1)", letterSpacing: "0.6px" }}>
        Users
      </Typography>
      <List>
        {users
          .filter(
            (user) =>
              activeChannel.isPublic ||
              activeChannel?.users?.some((channelUser) => channelUser._id === user._id)
          )
          .map((user) => {
            const isOnline = clientStatuses[user._id] === "online";

            return (
              <ListItem key={user._id} disablePadding>
                <ListItemButton>
                  <ListItemAvatar>
                    <Badge
                      color="success"
                      variant="dot"
                      invisible={!isOnline}
                      sx={{
                        "& .MuiBadge-dot": {
                          backgroundColor: isOnline ? green[500] : grey[500],
                        },
                      }}
                    >
                      <Avatar
                        src={
                          user.profilePicture
                            ? `${serverURL}/user/image/${user.profilePicture}`
                            : null
                        }
                      />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.username}
                    sx={{ color: isOnline ? green[500] : grey[400] }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>
    </Box>
  );
}
