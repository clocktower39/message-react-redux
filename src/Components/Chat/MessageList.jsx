import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Popover,
  TextField,
  Tooltip,
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
const RECENT_EMOJI_STORAGE_KEY = "recent_emojis";
const DEFAULT_EMOJIS = [
  "👍",
  "❤️",
  "😂",
  "🎉",
  "😄",
  "😭",
  "😡",
  "😮",
  "😍",
  "🙌",
  "👀",
  "🤔",
  "😎",
  "😅",
  "🤝",
  "✅",
  "❌",
  "🔥",
  "💯",
  "🚀",
  "⭐️",
  "🎯",
  "🥳",
  "🤩",
  "😇",
  "🤯",
  "😴",
  "🙏",
  "👏",
  "💡",
  "🥹",
  "🧠",
  "✨",
  "🫡",
  "🤖",
  "🧡",
  "💙",
  "💚",
  "💜",
  "🖤",
  "🤍",
  "🤎",
  "🩷",
  "😈",
  "🐱",
  "🐶",
  "🍕",
  "☕️",
  "🍺",
  "🎵",
];

export const MessageList = ({
  socket,
  activeChannel,
  scrollContainerRef,
  typingUsers = [],
  onMarkRead,
  readStatus = {},
  currentUserId,
}) => {
  const messages = useSelector(state => state.messages);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const topSentinelRef = useRef(null);
  const isPrependingRef = useRef(false);
  const isAtBottomRef = useRef(true);
  const lastReadSentRef = useRef(0);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [quickMessageId, setQuickMessageId] = useState(null);
  const [quickMenuPinned, setQuickMenuPinned] = useState(false);
  const [fullEmojiAnchorPosition, setFullEmojiAnchorPosition] = useState(null);
  const [customEmojiAnchorPosition, setCustomEmojiAnchorPosition] = useState(null);
  const [reactionTargetId, setReactionTargetId] = useState(null);
  const [reactionInput, setReactionInput] = useState("");
  const [recentEmojis, setRecentEmojis] = useState([]);
  const READ_THROTTLE_MS = 3000;

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
    lastReadSentRef.current = 0;
  }, [activeChannel?._id]);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_EMOJI_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentEmojis(parsed);
        }
      } catch (error) {
        setRecentEmojis([]);
      }
    }
  }, []);

  const getLatestMessageTimestamp = () => {
    if (!messages.length) {
      return null;
    }
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.timeStamp) {
      return null;
    }
    const parsed = new Date(lastMessage.timeStamp).getTime();
    return Number.isNaN(parsed) ? null : parsed;
  };

  const shouldMarkRead = () => {
    if (!currentUserId) {
      return false;
    }
    const latestTimestamp = getLatestMessageTimestamp();
    if (!latestTimestamp) {
      return false;
    }
    const lastReadAt = readStatus?.[currentUserId];
    if (!lastReadAt) {
      return true;
    }
    const lastReadTimestamp = new Date(lastReadAt).getTime();
    if (Number.isNaN(lastReadTimestamp)) {
      return true;
    }
    return latestTimestamp > lastReadTimestamp;
  };

  useEffect(() => {
    if (isAtBottomRef.current && onMarkRead && shouldMarkRead()) {
      const now = Date.now();
      if (now - lastReadSentRef.current > READ_THROTTLE_MS) {
        lastReadSentRef.current = now;
        onMarkRead();
      }
    }
  }, [messages, onMarkRead]);

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
      if (atBottom && onMarkRead && shouldMarkRead()) {
        const now = Date.now();
        if (now - lastReadSentRef.current > READ_THROTTLE_MS) {
          lastReadSentRef.current = now;
          onMarkRead();
        }
      }
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

  const normalizeUserId = (value) =>
    value && value._id ? value._id.toString() : value?.toString();

  const getReactionUsers = (reactions, emoji) => {
    const match = (reactions || []).find((entry) => entry.emoji === emoji);
    return match ? match.users || [] : [];
  };

  const getReactionCount = (reactions, emoji) => getReactionUsers(reactions, emoji).length;

  const hasReacted = (reactions, emoji) => {
    const users = getReactionUsers(reactions, emoji);
    if (!user?._id) {
      return false;
    }
    return users.some((entry) => normalizeUserId(entry) === user._id);
  };

  const getReactionTooltip = (users) => {
    const names = (users || [])
      .map((entry) => entry?.username)
      .filter(Boolean);
    if (names.length > 0) {
      return names.join(", ");
    }
    const count = (users || []).length;
    return count ? `${count} reaction${count === 1 ? "" : "s"}` : "No reactions";
  };

  const openQuickMenu = (messageId) => {
    if (!quickMenuPinned) {
      setQuickMessageId(messageId);
    }
  };

  const closeQuickMenu = () => {
    if (!quickMenuPinned) {
      setQuickMessageId(null);
    }
  };

  const toggleQuickMenu = (messageId) => {
    if (quickMenuPinned && quickMessageId === messageId) {
      setQuickMenuPinned(false);
      setQuickMessageId(null);
      return;
    }
    setQuickMenuPinned(true);
    setQuickMessageId(messageId);
  };

  const openFullPicker = (event, messageId) => {
    event.stopPropagation();
    setReactionTargetId(messageId);
    setFullEmojiAnchorPosition({ top: event.clientY, left: event.clientX });
  };

  const closeFullPicker = () => {
    setFullEmojiAnchorPosition(null);
  };

  const openCustomPicker = (event, messageId) => {
    event.stopPropagation();
    setReactionTargetId(messageId);
    setCustomEmojiAnchorPosition({ top: event.clientY, left: event.clientX });
  };

  const closeCustomPicker = () => {
    setCustomEmojiAnchorPosition(null);
    setReactionInput("");
  };

  const updateRecentEmojis = (emoji) => {
    const trimmed = emoji.trim();
    if (!trimmed) {
      return;
    }
    setRecentEmojis((prev) => {
      const next = [trimmed, ...prev.filter((item) => item !== trimmed)].slice(0, 24);
      localStorage.setItem(RECENT_EMOJI_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const submitReaction = (emoji, messageIdOverride) => {
    const targetId = messageIdOverride || reactionTargetId || quickMessageId;
    if (!targetId) {
      return;
    }
    const trimmed = emoji.trim();
    if (!trimmed) {
      return;
    }
    dispatch(reactToMessage(targetId, trimmed));
    updateRecentEmojis(trimmed);
    closeFullPicker();
    closeCustomPicker();
    setReactionTargetId(null);
    setQuickMenuPinned(false);
  };

  const otherDmUser = activeChannel?.isDM
    ? (activeChannel.users || []).find((member) => member._id !== currentUserId)
    : null;
  const lastReadAt = otherDmUser ? readStatus[otherDmUser._id] : null;
  const isQuickMenuOpen = Boolean(quickMessageId);
  const isFullPickerOpen = Boolean(fullEmojiAnchorPosition);
  const isCustomPickerOpen = Boolean(customEmojiAnchorPosition);
  const quickEmojis = useMemo(() => {
    const recent = recentEmojis.slice(0, 6);
    const defaults = DEFAULT_EMOJIS.slice(0, 6);
    const combined = [...recent, ...defaults].filter((emoji, index, arr) => arr.indexOf(emoji) === index);
    return combined.slice(0, 8);
  }, [recentEmojis]);

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
            onMouseEnter={() => openQuickMenu(message._id)}
            onMouseLeave={closeQuickMenu}
            onClick={() => {
              toggleQuickMenu(message._id);
            }}
            container
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              margin: "10px 0px",
              borderRadius: "7.5px",
              color: "var(--text-0)",
              ...(message.user?.username === user.username
                ? {
                    background:
                      "linear-gradient(135deg, rgba(255, 107, 61, 0.75), rgba(255, 138, 74, 0.75))",
                    boxShadow: "0 10px 18px rgba(255, 107, 61, 0.22)",
                  }
                : {
                    backgroundColor: "var(--bg-2)",
                    border: "1px solid var(--border)",
                  }),
            }}
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
                {(message.reactions || []).map((reaction) => {
                  const count = getReactionCount(message.reactions, reaction.emoji);
                  const reacted = hasReacted(message.reactions, reaction.emoji);
                  const users = getReactionUsers(message.reactions, reaction.emoji);
                  return (
                    <Tooltip
                      key={`${message._id}-${reaction.emoji}`}
                      title={getReactionTooltip(users)}
                      enterTouchDelay={0}
                      leaveTouchDelay={3000}
                      arrow
                    >
                        <IconButton
                          size="small"
                          onClick={(event) => {
                            event.stopPropagation();
                            dispatch(reactToMessage(message._id, reaction.emoji));
                          }}
                        sx={{
                          fontSize: "1rem",
                          borderRadius: "16px",
                          padding: "2px 6px",
                          backgroundColor: reacted ? "rgba(255, 255, 255, 0.08)" : "transparent",
                          border: reacted ? "1px solid var(--border)" : "1px solid transparent",
                        }}
                      >
                        <span>{reaction.emoji}</span>
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
                    </Tooltip>
                  );
                })}
              </Box>
              {isQuickMenuOpen && quickMessageId === message._id && (
                <Box
                  onClick={(event) => event.stopPropagation()}
                  sx={{
                    position: "absolute",
                    top: -30,
                    right: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    padding: "6px 8px",
                    borderRadius: "16px",
                    backgroundColor: "var(--bg-1)",
                    border: "1px solid var(--border)",
                    zIndex: 2,
                  }}
                >
                  {quickEmojis.map((emoji) => (
                    <IconButton
                      key={`${message._id}-${emoji}`}
                      size="small"
                      onClick={() => submitReaction(emoji, message._id)}
                      sx={{ borderRadius: "12px" }}
                    >
                      <span>{emoji}</span>
                    </IconButton>
                  ))}
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(event) => openFullPicker(event, message._id)}
                  >
                    More
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(event) => openCustomPicker(event, message._id)}
                  >
                    Custom
                  </Button>
                </Box>
              )}
            </Grid>
            <Grid size={2}>
              {message.user?.username === user.username ? (
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    dispatch(deleteMessage(message));
                  }}
                >
                  <Delete />
                </IconButton>
              ) : null}
            </Grid>
          </Grid>
        );
      })}
      {otherDmUser && lastReadAt && (
        <Typography variant="caption" sx={{ color: "var(--text-2)", padding: "4px 8px" }}>
          Last read by {otherDmUser.username} at {dayjs(lastReadAt).format("MM/DD/YYYY h:mm A")}
        </Typography>
      )}
      <Popover
        open={isFullPickerOpen}
        anchorReference="anchorPosition"
        anchorPosition={fullEmojiAnchorPosition || { top: 0, left: 0 }}
        onClose={closeFullPicker}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box sx={{ padding: 2, backgroundColor: "var(--bg-1)", color: "var(--text-0)", width: 320 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Add reaction
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {DEFAULT_EMOJIS.map((emoji) => (
              <IconButton
                key={emoji}
                size="small"
                onClick={() => submitReaction(emoji, reactionTargetId)}
                sx={{ borderRadius: "12px", border: "1px solid var(--border)" }}
              >
                <span>{emoji}</span>
              </IconButton>
            ))}
          </Box>
        </Box>
      </Popover>
      <Popover
        open={isCustomPickerOpen}
        anchorReference="anchorPosition"
        anchorPosition={customEmojiAnchorPosition || { top: 0, left: 0 }}
        onClose={closeCustomPicker}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box sx={{ padding: 2, backgroundColor: "var(--bg-1)", color: "var(--text-0)", width: 280 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Add custom emoji
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={reactionInput}
            label="Emoji"
            onChange={(event) => setReactionInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submitReaction(reactionInput, reactionTargetId);
              }
            }}
          />
          <Typography variant="caption" sx={{ color: "var(--text-2)", display: "block", mt: 1 }}>
            Use your emoji keyboard for more.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
            <Button size="small" onClick={closeCustomPicker}>
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => submitReaction(reactionInput, reactionTargetId)}
              disabled={!reactionInput.trim()}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Popover>
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
