import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Avatar,
  Box,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import dayjs from 'dayjs';
import {
  deleteMessage,
  removeMessage,
  fetchMessagePage,
  resetMessageList,
  reactToMessage,
  UPDATE_MESSAGE_REACTIONS,
  serverURL,
} from "../../Redux/actions";

const PAGE_SIZE = 30;
const REACTION_OPTIONS = ["👍", "🔥", "😂", "🎉", "😄"];

export const MessageList = ({ socket, activeChannel, scrollContainerRef, typingUsers = [] }) => {
  const messages = useSelector(state => state.messages);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const topSentinelRef = useRef(null);
  const isPrependingRef = useRef(false);
  const isAtBottomRef = useRef(true);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isPrependingRef.current) {
      return;
    }
    if (isAtBottomRef.current) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (!activeChannel?._id) {
      return;
    }

    let isMounted = true;
    const loadInitial = async () => {
      setLoading(true);
      dispatch(resetMessageList());
      const data = await dispatch(
        fetchMessagePage({ channelId: activeChannel._id, limit: PAGE_SIZE, mode: "replace" })
      );
      if (isMounted) {
        setCursor(data?.nextCursor || null);
        setHasMore(Boolean(data?.hasMore));
        setLoading(false);
        scrollToBottom();
      }
    };

    loadInitial();

    return () => {
      isMounted = false;
    };
  }, [activeChannel?._id, dispatch]);

  const loadOlderMessages = useCallback(async () => {
    if (!activeChannel?._id || !hasMore || loading) {
      return;
    }
    const container = scrollContainerRef?.current;
    const previousScrollHeight = container?.scrollHeight || 0;
    const previousScrollTop = container?.scrollTop || 0;

    isPrependingRef.current = true;
    setLoading(true);

    const data = await dispatch(
      fetchMessagePage({
        channelId: activeChannel._id,
        cursor,
        limit: PAGE_SIZE,
        mode: "prepend",
      })
    );

    setCursor(data?.nextCursor || null);
    setHasMore(Boolean(data?.hasMore));
    setLoading(false);

    requestAnimationFrame(() => {
      if (container) {
        const nextScrollHeight = container.scrollHeight;
        container.scrollTop = nextScrollHeight - previousScrollHeight + previousScrollTop;
      }
      isPrependingRef.current = false;
    });
  }, [activeChannel?._id, cursor, dispatch, hasMore, loading, scrollContainerRef]);

  useEffect(() => {
    const container = scrollContainerRef?.current;
    if (!container) {
      return undefined;
    }

    const handleScroll = () => {
      const threshold = 80;
      const atBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
      isAtBottomRef.current = atBottom;
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainerRef, activeChannel?._id]);

  useEffect(() => {
    const container = scrollContainerRef?.current;
    const sentinel = topSentinelRef.current;
    if (!container || !sentinel) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadOlderMessages();
        }
      },
      {
        root: container,
        rootMargin: "120px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [loadOlderMessages, scrollContainerRef]);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }
    const handleRemove = (data) => {
      dispatch(removeMessage(data));
    };
    const handleReaction = (data) => {
      if (!data?.messageId) {
        return;
      }
      dispatch({
        type: UPDATE_MESSAGE_REACTIONS,
        messageId: data.messageId,
        reactions: data.reactions || [],
      });
    };
    socket.on("remove_message", handleRemove);
    socket.on("message_reaction", handleReaction);

    return () => {
      socket.off("remove_message", handleRemove);
      socket.off("message_reaction", handleReaction);
    };
  }, [socket, dispatch]);

  const getReactionCount = (reactions, emoji) => {
    const match = (reactions || []).find((entry) => entry.emoji === emoji);
    return match ? (match.users || []).length : 0;
  };

  const hasReacted = (reactions, emoji) => {
    const match = (reactions || []).find((entry) => entry.emoji === emoji);
    if (!match || !user?._id) {
      return false;
    }
    return (match.users || []).some((id) => id.toString() === user._id);
  };

  return (
    <div style={{
      padding: "75px 5px 0 5px",
    }}>
      <h4 style={{
        textAlign: "center",
        color: "var(--text-1)",
        letterSpacing: "0.6px",
      }}>{activeChannel.name} Messages: </h4>
      <div ref={topSentinelRef} style={{ height: 1 }} />
      {messages.map((message, i) => {
        return (
          <Grid
            key={message._id || i}
            sx={
              message.user?.username === user.username
                ? {
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: "10px 0px",
                  borderRadius: "7.5px",
                  background: "linear-gradient(135deg, rgba(255, 107, 61, 0.75), rgba(255, 138, 74, 0.75))",
                  color: "var(--text-0)",
                  boxShadow: "0 10px 18px rgba(255, 107, 61, 0.22)"
                }
                : {
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: "10px 0px",
                  borderRadius: "7.5px",
                  backgroundColor: "var(--bg-2)",
                  color: "var(--text-0)",
                  border: "1px solid var(--border)"
                }
            }
            container
          >
            <Grid container size={2} sx={{ justifyContent: 'center', }}>
              <Avatar
                src={
                  message.user?.profilePicture
                    ? `${serverURL}/user/image/${message.user.profilePicture}`
                    : null
                }
              />
            </Grid>
            <Grid size={8}>
              <Typography variant="body2" display="inline">
                {message.user?.username || "Unknown"}{" "}
              </Typography>
              <Typography
                variant="subtitle2"
                display="inline"
                sx={{
                  opacity: ".33",
                }}
              >
                {dayjs(message.timeStamp).format("MM/DD/YYYY h:mm:ss A")}
              </Typography>
              <Typography variant="body1" display="block">
                {message.message}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: 1 }}>
                {REACTION_OPTIONS.map((emoji) => {
                  const count = getReactionCount(message.reactions, emoji);
                  const reacted = hasReacted(message.reactions, emoji);
                  return (
                    <IconButton
                      key={`${message._id}-${emoji}`}
                      size="small"
                      onClick={() => dispatch(reactToMessage(message._id, emoji))}
                      sx={{
                        fontSize: "1rem",
                        borderRadius: "16px",
                        padding: "2px 6px",
                        backgroundColor: reacted ? "rgba(255, 255, 255, 0.08)" : "transparent",
                        border: reacted ? "1px solid var(--border)" : "1px solid transparent",
                      }}
                    >
                      <span>{emoji}</span>
                      {count > 0 && (
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{ marginLeft: "4px", color: "var(--text-2)" }}
                        >
                          {count}
                        </Typography>
                      )}
                    </IconButton>
                  );
                })}
              </Box>
            </Grid>
            <Grid size={2}>
              {message.user?.username === user.username ? (
                <IconButton onClick={() => dispatch(deleteMessage(message))}>
                  <Delete />
                </IconButton>
              ) : null}
            </Grid>
          </Grid>
        );
      })}
      {typingUsers.length > 0 && (
        <Typography variant="caption" sx={{ color: "var(--text-2)", padding: "4px 8px" }}>
          {typingUsers.map((typingUser) => typingUser.username).join(", ")}{" "}
          {typingUsers.length === 1 ? "is" : "are"} typing...
        </Typography>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
