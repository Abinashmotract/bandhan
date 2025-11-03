import React, { useState } from "react";
import {
  Box,
  Drawer,
  Typography,
  TextField,
  IconButton,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Send as SendIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";
import { showSuccess, showError } from "../utils/toast";

const InterestPanel = ({ open, onClose, profile, onInterestSent }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendInterest = async () => {
    if (!profile?._id && !profile?.id) {
      showError("Profile ID not available");
      return;
    }

    if (!message.trim()) {
      showError("Please enter a message");
      return;
    }

    try {
      setSending(true);
      const profileId = profile._id || profile.id;
      
      const { API_BASE_URL } = await import("../utils/api");
      const Cookies = (await import("js-cookie")).default;
      const token = Cookies.get("accessToken");

      if (!token) {
        showError("Please login to send interest");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/matches/interest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profileId: profileId,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || "Failed to send interest";
        showError(errorMessage);
        
        // If interest already exists, still show success
        if (errorMessage.includes("already") || errorMessage.includes("Interest already")) {
          showSuccess("Interest already sent to this profile");
          if (onInterestSent) {
            onInterestSent(profileId);
          }
          handleClose();
          return;
        }
        return;
      }

      if (data.success) {
        showSuccess("Your interest has been sent!");
        if (onInterestSent) {
          onInterestSent(profileId);
        }
        handleClose();
      } else {
        showError(data.message || "Failed to send interest");
      }
    } catch (error) {
      console.error("Error sending interest:", error);
      showError(error.message || "Failed to send interest. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setMessage("");
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && message.trim()) {
      e.preventDefault();
      handleSendInterest();
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/uploads/") || imagePath.startsWith("uploads/")) {
      return `http://localhost:3000/${imagePath.startsWith("/") ? imagePath.slice(1) : imagePath}`;
    }
    return `http://localhost:3000/uploads/${imagePath}`;
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 480 },
          maxWidth: "100%",
        },
      }}
      SlideProps={{
        direction: "left",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          bgcolor: "background.paper",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FavoriteBorderIcon sx={{ color: "#51365F", fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#51365F" }}>
              Send Interest
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Profile Info */}
        {profile && (
          <Box
            sx={{
              p: 3,
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              src={getImageUrl(profile.profileImage)}
              sx={{ width: 64, height: 64 }}
            >
              {profile.name?.charAt(0) || "?"}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {profile.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {profile.city || profile.location || "N/A"}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Message Input Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            p: 3,
          }}
        >
          <Typography
            variant="body1"
            sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
          >
            Write a message to express your interest
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={8}
            placeholder="Hi! I saw your profile and I think we have a lot in common. I would love to know more about you..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            autoFocus
          />

          <Box sx={{ mt: "auto" }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={
                sending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SendIcon />
                )
              }
              onClick={handleSendInterest}
              disabled={!message.trim() || sending}
              sx={{
                bgcolor: "#51365F",
                color: "white",
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                "&:hover": {
                  bgcolor: "#3d2847",
                },
                "&.Mui-disabled": {
                  bgcolor: "#e0e0e0",
                  color: "#999",
                },
              }}
            >
              {sending ? "Sending..." : "Send Interest"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default InterestPanel;

