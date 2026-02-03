import React, { useCallback, useEffect, useRef, useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import OnlineStatusBar from "./OnlineStatusBar";
import ChannelSelection from "./ChannelSelection";
import { Grid } from "@mui/material";
import { serverURL } from "../../Redux/actions";
import { useSelector } from "react-redux";

export default function Chat({ socket }) {
  const currentUserId = useSelector((state) => state.user._id);
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimeoutsRef = useRef(new Map());
  const messagesContainerRef = useRef(null);
  const [readStatus, setReadStatus] = useState({});

  const loadChannels = useCallback(async () => {
    const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;

    const response = await fetch(`${serverURL}/api/channels`, {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: bearer,
      },
    })
      .then((res) => res.json());

    const channelList = Array.isArray(response) ? response : [];
    setChannels(channelList);
    setActiveChannel((current) => {
      if (current && channelList.some((channel) => channel._id === current._id)) {
        return current;
      }
      return channelList[0] || null;
    });
  }, []);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  const handleChannelClick = (channel) => {
    setActiveChannel(channel);
  };

  const handleDmCreated = (channel) => {
    setChannels((prev) => {
      if (prev.some((existing) => existing._id === channel._id)) {
        return prev;
      }
      return [...prev, channel];
    });
    setActiveChannel(channel);
  };

  const fetchReadStatus = useCallback(async (channelId) => {
    const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;
    const response = await fetch(`${serverURL}/api/channels/${channelId}/read-status`, {
      headers: { Authorization: bearer },
    });
    const data = await response.json();
    if (!data || !Array.isArray(data.reads)) {
      return;
    }
    setReadStatus((prev) => {
      const next = { ...prev };
      data.reads.forEach((entry) => {
        next[entry.userId] = entry.lastReadAt;
      });
      return next;
    });
  }, []);

  const markChannelRead = useCallback(async (channelId) => {
    if (!channelId) {
      return;
    }
    const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;
    const response = await fetch(`${serverURL}/api/channels/${channelId}/read`, {
      method: "POST",
      headers: { Authorization: bearer },
    });
    const data = await response.json();
    if (data?.userId && data?.lastReadAt) {
      setReadStatus((prev) => ({ ...prev, [data.userId]: data.lastReadAt }));
    }
  }, []);

  useEffect(() => {
    if (!socket || !activeChannel?._id) {
      return undefined;
    }

    socket.emit("join_channel", activeChannel._id);

    return () => {
      socket.emit("leave_channel", activeChannel._id);
    };
  }, [socket, activeChannel?._id, loadChannels]);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    const handleTyping = ({ channelId, userId, username }) => {
      if (!activeChannel?._id || channelId !== activeChannel._id) {
        return;
      }

      setTypingUsers((prev) => {
        if (prev.some((user) => user.userId === userId)) {
          return prev;
        }
        return [...prev, { userId, username }];
      });

      const existingTimeout = typingTimeoutsRef.current.get(userId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      const timeout = setTimeout(() => {
        setTypingUsers((prev) => prev.filter((user) => user.userId !== userId));
        typingTimeoutsRef.current.delete(userId);
      }, 3000);

      typingTimeoutsRef.current.set(userId, timeout);
    };

    const handleStopTyping = ({ channelId, userId }) => {
      if (!activeChannel?._id || channelId !== activeChannel._id) {
        return;
      }

      setTypingUsers((prev) => prev.filter((user) => user.userId !== userId));
      const existingTimeout = typingTimeoutsRef.current.get(userId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
        typingTimeoutsRef.current.delete(userId);
      }
    };

    const handleKicked = ({ channelId }) => {
      if (activeChannel?._id === channelId) {
        setTypingUsers([]);
      }
      loadChannels();
    };

    const handleReadReceipt = ({ channelId, userId, lastReadAt }) => {
      if (!activeChannel?._id || channelId !== activeChannel._id) {
        return;
      }
      setReadStatus((prev) => ({ ...prev, [userId]: lastReadAt }));
    };

    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);
    socket.on("channel_kicked", handleKicked);
    socket.on("channel_banned", handleKicked);
    socket.on("read_receipt", handleReadReceipt);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
      socket.off("channel_kicked", handleKicked);
      socket.off("channel_banned", handleKicked);
      socket.off("read_receipt", handleReadReceipt);
    };
  }, [socket, activeChannel?._id, loadChannels]);

  useEffect(() => {
    typingTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    typingTimeoutsRef.current.clear();
    setTypingUsers([]);
    if (activeChannel?._id) {
      fetchReadStatus(activeChannel._id);
      markChannelRead(activeChannel._id);
    }
  }, [activeChannel?._id, fetchReadStatus, markChannelRead]);

  return activeChannel ? (
    <Grid container sx={{ height: "100vh" }}>
      {/* Channel list */}
      <Grid
        container
        size={3}
        sx={{
          backgroundColor: "var(--bg-2)",
          overflowY: "auto",
          display: { xs: "none", sm: "flex" },
        }}
      >
        <ChannelSelection
          channels={channels}
          currentUserId={currentUserId}
          handleChannelClick={handleChannelClick}
          onDmCreated={handleDmCreated}
        />
      </Grid>

      {/* Message pane */}
      <Grid
        container
        size={{ xs: 8, sm: 6, }}
        sx={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100vh",
          backgroundColor: "var(--bg-1)",
        }}
      >
        {/* Scrollable messages */}
        <Grid
          ref={messagesContainerRef}
          sx={{ flexGrow: 1, overflowY: "auto", scrollbarWidth: "thin" }}
        >
          <MessageList
            socket={socket}
            activeChannel={activeChannel}
            scrollContainerRef={messagesContainerRef}
            typingUsers={typingUsers}
            onMarkRead={() => markChannelRead(activeChannel?._id)}
            readStatus={readStatus}
            currentUserId={currentUserId}
          />
        </Grid>

        {/* Composer */}
        <Grid sx={{ backgroundColor: "var(--bg-2)" }}>
          <MessageInput socket={socket} activeChannel={activeChannel} />
        </Grid>
      </Grid>

      {/* Online users */}
      <Grid
        container
        size={{ xs: 4, sm: 3, }}
        sx={{ backgroundColor: "var(--bg-2)", overflowY: "auto", overflowX: "hidden" }}
      >
        <OnlineStatusBar socket={socket} activeChannel={activeChannel} />
      </Grid>
    </Grid>
  ) : (
    <>Loading</>
  );
}
