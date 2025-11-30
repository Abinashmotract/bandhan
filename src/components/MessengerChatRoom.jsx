import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  Badge,
  IconButton,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  Person,
  Phone,
  MoreVert,
  Send,
  CheckCircle,
  Message,
} from "@mui/icons-material";
import { showSuccess, showError } from "../utils/toast";
import {
  sendMessageService,
  loadChatHistoryService,
  subscribeToMessagesService,
  markMessagesAsReadService,
  getCurrentUserIdFromToken,
} from "../utils/messagingService";
import { generateRoomId, initializeFirebase } from "../utils/firebase";

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
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const unsubscribeRef = useRef(null);
  const roomIdRef = useRef(null);

  useEffect(() => {
    if (profile?.id || profile?._id) {
      // Initialize Firebase first
      console.log("Initializing Firebase...");
      const initialized = initializeFirebase();
      if (!initialized) {
        console.error("Failed to initialize Firebase");
        showError(
          "Failed to initialize messaging. Please check Firebase configuration."
        );
        return;
      }

      initializeChat();
    }

    return () => {
      // Cleanup on unmount
      if (unsubscribeRef.current) {
        console.log("🔌 Unsubscribing from Firebase messages");
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [profile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeChat = async () => {
    try {
      // Get current user ID first
      const userId = await getCurrentUserIdFromToken();
      if (!userId) {
        console.error("Could not get current user ID");
        showError("Failed to load chat. Please login again.");
        return;
      }

      setCurrentUserId(userId);
      console.log(
        `Current User: ${userId}, Chat Partner: ${profile.id || profile._id}`
      );

      // Generate room ID
      const partnerId = profile.id || profile._id;
      const roomId = generateRoomId(userId, partnerId);
      roomIdRef.current = roomId;

      console.log(`Generated Room ID: ${roomId}`);

      // Check existing interest
      await checkExistingInterest();

      // Load chat history
      await loadChatHistory(roomId);

      // Setup real-time subscription
      setupRealtimeSubscription(roomId);
    } catch (error) {
      console.error("Error initializing chat:", error);
      showError("Failed to initialize chat");
    }
  };

  const setupRealtimeSubscription = (roomId) => {
    console.log(`📂 Setting up real-time subscription for room: ${roomId}`);

    // Unsubscribe from previous subscription if exists
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // Subscribe to Firebase messages
    const unsubscribe = subscribeToMessagesService(
      { roomId },
      (newMessages) => {
        console.log(
          `📨 Firebase subscription callback: ${newMessages?.length} messages in room ${roomId}`
        );

        if (newMessages && Array.isArray(newMessages)) {
          // Update messages state with ALL messages from Firebase
          setMessages(newMessages);

          // Scroll to bottom after updating
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        }
      }
    );

    unsubscribeRef.current = unsubscribe;
    console.log(`✅ Real-time subscription established for room: ${roomId}`);
  };

  const checkExistingInterest = async () => {
    try {
      if (!profile?.id && !profile?._id) return;

      const userId = profile.id || profile._id;
      const Cookies = (await import("js-cookie")).default;

      // Check if interest exists by fetching interests sent by current user
      const { conversationAPI } = await import("../services/apiService");
      const response = await conversationAPI.getConversations("interests");

      if (response.data.success && response.data.data) {
        const interests = response.data.data;
        const existingInterest = interests.find(
          (interest) =>
            interest.user?.id === userId ||
            interest.user?._id === userId ||
            interest.userId === userId
        );

        if (existingInterest) {
          setHasInterest(true);
          setInterestSent(true);
        }
      }
    } catch (error) {
      console.error("Error checking existing interest:", error);
    }
  };

  const loadChatHistory = async (roomId) => {
    try {
      setLoading(true);
      console.log(`Loading chat history from room: ${roomId}`);

      const loadedMessages = await loadChatHistoryService({
        roomId,
        limit: 50,
      });

      console.log(`Loaded ${loadedMessages.length} messages from Firebase`);
      setMessages(loadedMessages);

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

      // Scroll to bottom after loading
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (error) {
      console.error("Error loading chat history:", error);
      showError("Failed to load chat history");
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
        const errorMessage = data.message || "Failed to send interest";
        showError(errorMessage);

        if (
          errorMessage.includes("already") ||
          errorMessage.includes("Interest already")
        ) {
          setInterestSent(true);
          setHasInterest(true);
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

        // If message was sent with interest, reload chat history
        if (message.trim()) {
          setTimeout(() => {
            loadChatHistory(roomIdRef.current);
          }, 500);
          setMessage("");
        }

        if (onInterestSent) {
          onInterestSent(userId);
        }
      }
    } catch (error) {
      console.error("Error sending interest:", error);
      const errorMessage =
        error.message ||
        error.toString() ||
        "Failed to send interest. Please try again.";
      showError(errorMessage);
    } finally {
      setSendingInterest(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !profile?.id) {
      console.warn("Message empty or profile missing");
      return;
    }

    // If interest not sent yet, send interest with message
    if (!interestSent && !hasInterest) {
      console.log("Interest not sent, sending interest first");
      await handleSendInterest();
      return;
    }

    const userId = profile.id || profile._id;
    const messageText = message.trim();

    try {
      setSendingMessage(true);
      console.log("🚀 Sending message...");

      if (!currentUserId) {
        console.error("Current user ID not available");
        showError("Failed to send message");
        return;
      }

      const roomId = roomIdRef.current;
      console.log(`Sending message in room: ${roomId}`);

      // Clear input immediately
      setMessage("");

      // Send to Firebase - the subscription will handle updating the UI
      console.log("📤 Sending message to Firebase...");
      await sendMessageService({
        roomId,
        senderId: currentUserId,
        receiverId: userId,
        content: messageText,
        messageType: "text",
      });

      console.log("✅ Message sent to Firebase successfully");
      showSuccess("Message sent!");

      // Scroll to bottom after sending
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (error) {
      console.error("❌ Error sending message:", error);
      showError("Failed to send message. Please try again.");
      // Restore message text on error
      setMessage(messageText);
    } finally {
      setSendingMessage(false);
    }
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

  const profileAge =
    profile?.age || (profile?.dob ? calculateAge(profile.dob) : null);

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
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mb: interestSent ? 1 : 0,
          }}
        >
          {profileAge && (
            <Typography variant="body2">• {profileAge} years</Typography>
          )}
          {profile?.height && (
            <Typography variant="body2">
              • {formatHeight(profile.height)}
            </Typography>
          )}
          {profile?.occupation && (
            <Typography variant="body2">• {profile.occupation}</Typography>
          )}
          {profile?.caste && (
            <Typography variant="body2">• {profile.caste}</Typography>
          )}
          {profile?.location && (
            <Typography variant="body2">• {profile.location}</Typography>
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
              const senderId =
                msg.sender?._id?.toString() || msg.sender?.id?.toString();
              const isOwnMessage = senderId === currentUserId?.toString();

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
                      boxShadow: !isSystemMessage
                        ? "0 1px 2px rgba(0,0,0,0.1)"
                        : "none",
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
                  <Typography
                    variant="body2"
                    sx={{ fontStyle: "italic", color: "text.secondary" }}
                  >
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
            onChange={(e) => setMessage(e.target.value)}
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
            disabled={
              (!message.trim() && (interestSent || hasInterest)) ||
              sendingMessage
            }
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
            {sendingMessage ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Send />
            )}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default MessengerChatRoom;
