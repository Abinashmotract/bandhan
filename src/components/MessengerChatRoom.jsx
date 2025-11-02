import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  Badge,
  IconButton,
  Button,
  TextField,
  Card,
  CardContent,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  Person,
  Phone,
  MoreVert,
  Send,
  CheckCircle,
} from "@mui/icons-material";
import { interactionAPI, messagingAPI } from "../services/apiService";
import { showSuccess, showError } from "../utils/toast";
import { getSocket, disconnectSocket } from "../utils/socket";

// Helper function to get image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  return imagePath;
};

// Helper function to format height
const formatHeight = (height) => {
  if (!height) return "N/A";
  if (typeof height === "string" && height.includes("ft")) return height;
  if (typeof height === "string" && height.includes("_")) {
    return height.replace("_", "'").replace("in", '"');
  }
  return height;
};

// Helper function to calculate age from DOB
const calculateAge = (dob) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const MessengerChatRoom = ({ profile, onBack, onInterestSent }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingInterest, setSendingInterest] = useState(false);
  const [interestSent, setInterestSent] = useState(false);
  const [hasInterest, setHasInterest] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const roomIdRef = useRef(null);

  useEffect(() => {
    if (profile?.id || profile?._id) {
      checkExistingInterest();
      loadChatHistory();
      setupWebSocket();
    }

    return () => {
      // Cleanup on unmount
      if (socketRef.current) {
        const socket = socketRef.current;
        
        // Remove all event listeners
        socket.off('new_message');
        socket.off('message_received');
        socket.off('message_sent');
        socket.off('user_typing');
        socket.off('user_stopped_typing');
        socket.off('message_error');
        socket.off('connect_error');
        
        // Leave room
        if (roomIdRef.current) {
          socket.emit('leave_room', roomIdRef.current);
        }
        
        // Clear typing timeout
        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }
      }
    };
  }, [profile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const setupWebSocket = async () => {
    try {
      const socket = getSocket();
      if (!socket) {
        console.warn('Socket not available');
        return;
      }

      socketRef.current = socket;

      // Generate room ID for this chat (same for both users)
      const userId = profile.id || profile._id;
      const Cookies = (await import("js-cookie")).default;
      const token = Cookies.get("accessToken");
      
      if (!token) {
        console.warn('No token available for socket');
        return;
      }

      // Get current user ID from token or use a helper
      const getCurrentUserId = async () => {
        try {
          const { API_BASE_URL } = await import("../utils/api");
          const response = await fetch(`${API_BASE_URL}/auth/user`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            const userId = data.user?._id || data.user?.id || data.data?._id || data.data?.id;
            setCurrentUserId(userId);
            return userId;
          }
        } catch (err) {
          console.error('Error getting current user ID:', err);
        }
        return null;
      };

      // Setup room joining after getting current user ID
      getCurrentUserId().then((currentUserId) => {
        if (currentUserId && userId) {
          // Create consistent room ID (sorted IDs to ensure same room for both users)
          const roomIds = [currentUserId.toString(), userId.toString()].sort();
          const roomId = `chat_${roomIds[0]}_${roomIds[1]}`;
          roomIdRef.current = roomId;
          
          socket.emit('join_room', roomId);
          console.log(`Joined room: ${roomId}`);
        }
      });

      // Listen for new messages
      socket.on('new_message', (data) => {
        if (data.success && data.message) {
          const msg = data.message;
          const profileUserId = profile.id || profile._id;
          
          // Only add message if it's for this chat
          // Check if message is from the profile user (they're sending to us)
          if (msg.sender?._id === profileUserId || 
              msg.sender?.id === profileUserId ||
              msg.receiver?._id === profileUserId || 
              msg.receiver?.id === profileUserId) {
            setMessages((prev) => {
              // Check if message already exists
              const exists = prev.some(m => 
                m._id === msg._id || 
                (m.content === msg.content && 
                 m.createdAt && msg.createdAt &&
                 Math.abs(new Date(m.createdAt).getTime() - new Date(msg.createdAt).getTime()) < 1000)
              );
              if (exists) return prev;
              
              return [...prev, {
                _id: msg._id,
                content: msg.content,
                messageType: msg.messageType,
                sender: msg.sender,
                receiver: msg.receiver,
                createdAt: msg.createdAt,
                isRead: msg.isRead
              }];
            });
            // Scroll to bottom after adding message
            setTimeout(() => {
              scrollToBottom();
            }, 100);
          }
        }
      });

      // Listen for message received in room
      socket.on('message_received', (data) => {
        if (data.message) {
          setMessages((prev) => {
            const exists = prev.some(m => m._id === data.message._id);
            if (exists) return prev;
            return [...prev, {
              _id: data.message._id,
              content: data.message.content,
              messageType: data.message.messageType,
              sender: data.message.sender,
              createdAt: data.message.createdAt,
              isRead: false
            }];
          });
        }
      });

      // Listen for message sent confirmation
      socket.on('message_sent', (data) => {
        if (data.success && data.message) {
          setMessages((prev) => {
            const exists = prev.some(m => 
              m._id === data.message._id || 
              (m.content === data.message.content && 
               m.createdAt && data.message.createdAt &&
               Math.abs(new Date(m.createdAt).getTime() - new Date(data.message.createdAt).getTime()) < 1000)
            );
            if (exists) return prev;
            return [...prev, {
              _id: data.message._id,
              content: data.message.content,
              messageType: data.message.messageType,
              sender: data.message.sender,
              receiver: data.message.receiver,
              createdAt: data.message.createdAt,
              isRead: data.message.isRead
            }];
          });
          setSendingMessage(false);
          // Scroll to bottom after adding message
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        }
      });

      // Listen for typing indicators
      socket.on('user_typing', (data) => {
        if (data.userId === userId) {
          setIsTyping(true);
        }
      });

      socket.on('user_stopped_typing', (data) => {
        setIsTyping(false);
      });

      // Listen for errors
      socket.on('message_error', (data) => {
        showError(data.message || 'Failed to send message');
        setSendingMessage(false);
      });

      // Listen for connection errors
      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        showError('Connection error. Please refresh the page.');
      });

    } catch (error) {
      console.error('Error setting up WebSocket:', error);
    }
  };

  const checkExistingInterest = async () => {
    try {
      if (!profile?.id && !profile?._id) return;
      
      const userId = profile.id || profile._id;
      const { API_BASE_URL } = await import("../utils/api");
      const Cookies = (await import("js-cookie")).default;
      const token = Cookies.get("accessToken");
      
      // Check if interest exists by fetching interests sent by current user
      const { conversationAPI } = await import("../services/apiService");
      const response = await conversationAPI.getConversations('interests');
      
      if (response.data.success && response.data.data) {
        const interests = response.data.data;
        const existingInterest = interests.find(
          (interest) => 
            (interest.user?.id === userId || interest.user?._id === userId) ||
            (interest.userId === userId)
        );
        
        if (existingInterest) {
          setHasInterest(true);
          setInterestSent(true);
        }
      }
    } catch (error) {
      console.error("Error checking existing interest:", error);
      // Don't show error to user, just assume no interest exists
    }
  };

  const loadChatHistory = async () => {
    if (!profile?.id && !profile?._id) return;

    try {
      setLoading(true);
      const userId = profile.id || profile._id;
      const response = await messagingAPI.getChatHistory(userId, {
        page: 1,
        limit: 50,
      });

      if (response.data.success) {
        const loadedMessages = response.data.data.messages || [];
        
        // Reverse messages since API returns newest first, but we want oldest first for display
        const sortedMessages = [...loadedMessages].reverse();
        setMessages(sortedMessages);
        
        // Scroll to bottom after loading messages
        setTimeout(() => {
          scrollToBottom();
        }, 100);
        
        // Check if "You sent interest" message exists
        const interestMessage = loadedMessages.find(
          (msg) =>
            msg.content?.toLowerCase().includes("interest") ||
            msg.messageType === "system"
        );
        if (interestMessage) {
          setInterestSent(true);
          setHasInterest(true);
        }
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInterest = async () => {
    if (!profile?.id && !profile?._id) {
      showError("Profile ID not available");
      return;
    }

    if (interestSent || hasInterest) {
      showError("Interest already sent to this profile");
      return;
    }

    try {
      setSendingInterest(true);
      const userId = profile.id || profile._id;
      
      // Use the matches API endpoint for sending interest
      const { API_BASE_URL } = await import("../utils/api");
      const Cookies = (await import("js-cookie")).default;
      
      const token = Cookies.get("accessToken");
      const response = await fetch(`${API_BASE_URL}/matches/interest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profileId: userId,
          message: message.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show the actual API error message
        const errorMessage = data.message || "Failed to send interest";
        showError(errorMessage);
        
        // If interest already exists, mark it as sent so UI reflects the state
        if (errorMessage.includes("already") || errorMessage.includes("Interest already")) {
          setInterestSent(true);
          setHasInterest(true);
          // Reload conversations to show in Interests tab
          setTimeout(() => {
            if (onInterestSent) {
              onInterestSent(userId);
            }
          }, 300);
        }
        return;
      }

      if (data.success) {
        setInterestSent(true);
        setHasInterest(true);
        showSuccess("Your interest has been sent!");

        // Add system message to chat
        const systemMessage = {
          _id: Date.now().toString(),
          content: "You sent interest",
          messageType: "system",
          sender: { _id: "system", name: "System" },
          receiver: { _id: userId },
          createdAt: new Date(),
          isRead: true,
        };

        setMessages((prev) => [...prev, systemMessage]);

        // If message was sent, add it to messages and reload chat history
        if (message.trim()) {
          // Reload chat history to get the actual message from backend
          setTimeout(() => {
            loadChatHistory();
          }, 500);
          setMessage("");
        }

        // Notify parent component
        if (onInterestSent) {
          onInterestSent(userId);
        }
      } else {
        // Show the actual API error message
        showError(data.message || "Failed to send interest");
      }
    } catch (error) {
      console.error("Error sending interest:", error);
      // Show the error message - check if it's a string or has a message property
      const errorMessage = error.message || error.toString() || "Failed to send interest. Please try again.";
      showError(errorMessage);
    } finally {
      setSendingInterest(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !profile?.id) return;

    // If interest not sent yet, send interest with message
    if (!interestSent && !hasInterest) {
      await handleSendInterest();
      return;
    }

    const socket = socketRef.current;
    if (!socket || !socket.connected) {
      // Fallback to REST API if socket is not connected
      try {
        const userId = profile.id || profile._id;
        const response = await messagingAPI.sendMessage(userId, {
          content: message.trim(),
          messageType: "text",
        });

        if (response.data.success) {
          const newMessage = {
            _id: response.data.data._id || Date.now().toString(),
            content: message.trim(),
            messageType: "text",
            sender: { _id: "current", name: "You" },
            receiver: { _id: userId },
            createdAt: new Date(),
            isRead: false,
          };

          setMessages((prev) => [...prev, newMessage]);
          setMessage("");
        }
      } catch (error) {
        console.error("Error sending message:", error);
        showError("Failed to send message. Please try again.");
      }
      return;
    }

    try {
      setSendingMessage(true);
      const userId = profile.id || profile._id;
      const roomId = roomIdRef.current;

      // Send message via WebSocket
      socket.emit('send_message', {
        receiverId: userId,
        content: message.trim(),
        messageType: 'text',
        roomId: roomId
      });

      // Clear input immediately for better UX
      setMessage("");

      // Stop typing indicator
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      socket.emit('typing_stop', { roomId, receiverId: userId });

    } catch (error) {
      console.error("Error sending message via WebSocket:", error);
      showError("Failed to send message. Please try again.");
      setSendingMessage(false);
    }
  };

  // Handle typing indicator
  const handleTyping = () => {
    const socket = socketRef.current;
    const userId = profile?.id || profile?._id;
    const roomId = roomIdRef.current;

    if (!socket || !socket.connected || !userId || !roomId) return;

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Emit typing start
    socket.emit('typing_start', { roomId, receiverId: userId });

    // Set timeout to stop typing after 3 seconds
    const timeout = setTimeout(() => {
      socket.emit('typing_stop', { roomId, receiverId: userId });
      setTypingTimeout(null);
    }, 3000);

    setTypingTimeout(timeout);
  };

  const formatTime = (date) => {
    if (!date) return "";
    const messageDate = new Date(date);
    const hours = messageDate.getHours();
    const minutes = messageDate.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, "0")} ${ampm}`;
  };

  const profileAge = profile?.age || (profile?.dob ? calculateAge(profile.dob) : null);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: "white",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={onBack} size="small">
            <ArrowBack />
          </IconButton>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              profile?.isOnline ? (
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    bgcolor: "#4caf50",
                    borderRadius: "50%",
                    border: "2px solid white",
                  }}
                />
              ) : null
            }
          >
            <Avatar
              src={getImageUrl(profile?.profileImage || profile?.avatar)}
              sx={{ width: 48, height: 48 }}
            >
              {profile?.name?.charAt(0) || "?"}
            </Avatar>
          </Badge>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {profile?.name || "Unknown"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {profile?.isOnline ? "Online" : "Offline"}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton size="small">
            <Person />
          </IconButton>
          <IconButton size="small">
            <Phone />
          </IconButton>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {/* Profile Info */}
      <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderBottom: "1px solid #e0e0e0" }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: interestSent ? 1 : 0 }}>
          {profileAge && <Typography variant="body2">• {profileAge} years</Typography>}
          {profile?.height && (
            <Typography variant="body2">• {formatHeight(profile.height)}</Typography>
          )}
          {profile?.occupation && (
            <Typography variant="body2">• {profile.occupation}</Typography>
          )}
          {profile?.caste && (
            <Typography variant="body2">
              • {profile.caste}
            </Typography>
          )}
          {profile?.location && (
            <Typography variant="body2">
              • {profile.location}
            </Typography>
          )}
          {profile?.annualIncome && (
            <Typography variant="body2">• {profile.annualIncome}</Typography>
          )}
          {profile?.maritalStatus && (
            <Typography variant="body2">• {profile.maritalStatus}</Typography>
          )}
        </Box>

        {/* Interest Sent Confirmation */}
        {interestSent && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 1,
              color: "#4caf50",
            }}
          >
            <CheckCircle sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Your interest has been sent
            </Typography>
          </Box>
        )}

        {/* Send Interest Button (if not sent) */}
        {!interestSent && !hasInterest && (
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={handleSendInterest}
            disabled={sendingInterest}
            sx={{
              mt: 2,
              bgcolor: "#dc2626",
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#b91c1c",
              },
            }}
          >
            {sendingInterest ? "Sending..." : "Send Interest"}
          </Button>
        )}
      </Box>

      {/* Chat Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          bgcolor: "#f5f7fa",
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {messages.length === 0 && interestSent && (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  color: "text.secondary",
                }}
              >
                <Typography variant="body2">Start the conversation!</Typography>
              </Box>
            )}
            {messages.map((msg, index) => {
              const isSystemMessage = msg.messageType === "system";
              // Check if message is from current user
              // Handle both string and ObjectId comparison
              const senderId = msg.sender?._id?.toString() || msg.sender?.id?.toString() || msg.sender?._id || msg.sender?.id;
              const currentUserIdStr = currentUserId?.toString();
              const isOwnMessage =
                senderId === currentUserIdStr || 
                senderId === "current" || 
                senderId === "system" ||
                (msg.sender?._id === "current") ||
                (msg.sender?.id === "current");

              return (
                <Box
                  key={msg._id || index}
                  sx={{
                    display: "flex",
                    justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "70%",
                      bgcolor: isSystemMessage
                        ? "transparent"
                        : isOwnMessage
                        ? "#dc2626"
                        : "white",
                      color: isSystemMessage
                        ? "text.secondary"
                        : isOwnMessage
                        ? "white"
                        : "text.primary",
                      p: isSystemMessage ? 0 : 1.5,
                      borderRadius: 2,
                      boxShadow: !isSystemMessage ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
                    }}
                  >
                    <Typography variant="body2">{msg.content}</Typography>
                    {!isSystemMessage && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mt: 0.5,
                          justifyContent: "flex-end",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "0.7rem",
                            opacity: 0.8,
                          }}
                        >
                          {formatTime(msg.createdAt)}
                        </Typography>
                        {isOwnMessage && (
                          <CheckCircle sx={{ fontSize: 12, opacity: 0.8 }} />
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
            
            {/* Typing Indicator */}
            {isTyping && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1.5,
                  mb: 1,
                }}
              >
                <Avatar
                  src={getImageUrl(profile?.profileImage || profile?.avatar)}
                  sx={{ width: 32, height: 32 }}
                >
                  {profile?.name?.charAt(0) || "?"}
                </Avatar>
                <Box
                  sx={{
                    bgcolor: "#f0f0f0",
                    borderRadius: 3,
                    p: 1.5,
                    maxWidth: "70%",
                  }}
                >
                  <Typography variant="body2" sx={{ fontStyle: "italic", color: "text.secondary" }}>
                    {profile?.name || "User"} is typing...
                  </Typography>
                </Box>
              </Box>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      {/* Message Input */}
      <Box
        sx={{
          p: 2,
          bgcolor: "white",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        {!interestSent && !hasInterest && (
          <Typography
            variant="caption"
            sx={{ display: "block", mb: 1, color: "text.secondary" }}
          >
            Sending message will also send this member your interest
          </Typography>
        )}
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Write here..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              // Trigger typing indicator when user types
              if (interestSent || hasInterest) {
                handleTyping();
              }
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!interestSent && !hasInterest) {
                  handleSendInterest();
                } else {
                  handleSendMessage();
                }
              }
            }}
            size="small"
            multiline
            maxRows={3}
            disabled={sendingMessage}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
          <IconButton
            onClick={() => {
              if (!interestSent && !hasInterest) {
                handleSendInterest();
              } else {
                handleSendMessage();
              }
            }}
            disabled={(!message.trim() && (interestSent || hasInterest)) || sendingMessage}
            sx={{
              bgcolor: "#dc2626",
              color: "white",
              "&:hover": {
                bgcolor: "#b91c1c",
              },
              "&.Mui-disabled": {
                bgcolor: "#e0e0e0",
                color: "#999",
              },
            }}
          >
            {sendingMessage ? <CircularProgress size={20} color="inherit" /> : <Send />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default MessengerChatRoom;

