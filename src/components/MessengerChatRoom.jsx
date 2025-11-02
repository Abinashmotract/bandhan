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
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (profile?.id || profile?._id) {
      checkExistingInterest();
      loadChatHistory();
    }
  }, [profile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const checkExistingInterest = async () => {
    try {
      // Check if interest already exists by checking the conversations/interests endpoint
      // This is a simplified check - you might want to add a dedicated endpoint
      setHasInterest(false);
    } catch (error) {
      console.error("Error checking existing interest:", error);
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
        setMessages(response.data.data.messages || []);
        
        // Check if "You sent interest" message exists
        const interestMessage = response.data.data.messages?.find(
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
        throw new Error(data.message || "Failed to send interest");
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
        showError(data.message || "Failed to send interest");
      }
    } catch (error) {
      console.error("Error sending interest:", error);
      showError(
        error.response?.data?.message ||
          "Failed to send interest. Please try again."
      );
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

    try {
      const userId = profile.id || profile._id;
      const response = await messagingAPI.sendMessage(userId, {
        content: message.trim(),
        messageType: "text",
      });

      if (response.data.success) {
        // Add message to local state
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
              const isOwnMessage =
                msg.sender?._id === "current" || msg.sender?._id === "system";

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
            disabled={!message.trim() && (interestSent || hasInterest)}
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
            <Send />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default MessengerChatRoom;

