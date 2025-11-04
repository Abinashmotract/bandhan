import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Avatar,
  Chip,
  IconButton,
  TextField,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import {
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Verified as VerifiedIcon,
  Height as HeightIcon,
  Group as GroupIcon,
  AttachMoney as AttachMoneyIcon,
  CameraAlt as CameraAltIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Chat as ChatIcon,
  Send as SendIcon,
  Collections as CollectionsIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { showSuccess, showError } from "../utils/toast";

const MatchCard = ({
  match,
  onShowInterest,
  onShowSuperInterest,
  onViewProfile,
  onToggleShortlist,
  onChatClick,
  getAge,
  getHeight,
}) => {
  const [showInterestInput, setShowInterestInput] = useState(false);
  const [interestMessage, setInterestMessage] = useState("");
  const [interestSent, setInterestSent] = useState(match.hasShownInterest || false);
  const [sendingInterest, setSendingInterest] = useState(false);
  const [hasImage, setHasImage] = useState(!!match.profileImage);
  const [isShortlisted, setIsShortlisted] = useState(match.isShortlisted || false);
  const [hasShownSuperInterest, setHasShownSuperInterest] = useState(match.hasShownSuperInterest || false);
  const [processingSuperInterest, setProcessingSuperInterest] = useState(false);
  const [processingShortlist, setProcessingShortlist] = useState(false);

  const handleShortlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setProcessingShortlist(true);
      const { API_BASE_URL } = await import("../utils/api");
      const Cookies = (await import("js-cookie")).default;
      const token = Cookies.get("accessToken");

      if (!token) {
        showError("Please login to shortlist");
        return;
      }

      if (isShortlisted) {
        // Remove from shortlist
        const response = await fetch(`${API_BASE_URL}/matches/shortlist`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            profileId: match._id,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setIsShortlisted(false);
          showSuccess("Profile removed from shortlist");
          // Update parent component state without triggering another API call
          if (onToggleShortlist) {
            // Pass a flag to indicate state was already updated
            onToggleShortlist(match._id, false);
          }
        } else {
          showError(data.message || "Failed to remove from shortlist");
        }
      } else {
        // Add to shortlist
        const response = await fetch(`${API_BASE_URL}/matches/shortlist`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            profileId: match._id,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setIsShortlisted(true);
          showSuccess("Profile added to shortlist");
          // Update parent component state without triggering another API call
          if (onToggleShortlist) {
            // Pass a flag to indicate state was already updated
            onToggleShortlist(match._id, true);
          }
        } else {
          // Handle "already shortlisted" error gracefully
          if (data.message && data.message.includes("already")) {
            setIsShortlisted(true);
            showSuccess("Profile is already in your shortlist");
            // Update parent state even when already shortlisted
            if (onToggleShortlist) {
              onToggleShortlist(match._id, true);
            }
          } else {
            showError(data.message || "Failed to add to shortlist");
          }
        }
      }
    } catch (error) {
      console.error("Error toggling shortlist:", error);
      showError("Failed to update shortlist. Please try again.");
    } finally {
      setProcessingShortlist(false);
    }
  };

  const handleInterestClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (interestSent) {
      return;
    }
    setShowInterestInput(true);
  };

  const handleSendInterest = async () => {
    if (!interestMessage.trim()) {
      showError("Please enter a message");
      return;
    }

    try {
      setSendingInterest(true);
      const profileId = match._id;

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
          message: interestMessage.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || "Failed to send interest";
        showError(errorMessage);

        if (errorMessage.includes("already") || errorMessage.includes("Interest already")) {
          setInterestSent(true);
          setShowInterestInput(false);
          if (onShowInterest) {
            onShowInterest(profileId);
          }
          return;
        }
        return;
      }

      if (data.success) {
        setInterestSent(true);
        setShowInterestInput(false);
        setInterestMessage("");
        showSuccess("Your interest has been sent!");
        if (onShowInterest) {
          onShowInterest(profileId);
        }
      } else {
        showError(data.message || "Failed to send interest");
      }
    } catch (error) {
      console.error("Error sending interest:", error);
      showError(error.message || "Failed to send interest. Please try again.");
    } finally {
      setSendingInterest(false);
    }
  };

  const handleRequestPhoto = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const { API_BASE_URL } = await import("../utils/api");
      const Cookies = (await import("js-cookie")).default;
      const token = Cookies.get("accessToken");

      if (!token) {
        showError("Please login to request photo");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/matches/request-photo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profileId: match._id,
        }),
      });

      // Check if response is HTML (404 error page) or not found
      if (response.status === 404) {
        showError("Photo request feature is not available yet");
        return;
      }

      // Check content type
      const contentType = response.headers.get("content-type");
      if (contentType && !contentType.includes("application/json")) {
        showError("Photo request feature is not available yet");
        return;
      }

      try {
        const data = await response.json();

        if (response.ok && data.success) {
          showSuccess("Photo request sent successfully!");
        } else {
          showError(data.message || "Failed to request photo");
        }
      } catch (parseError) {
        // If JSON parsing fails, it's likely an HTML error page
        showError("Photo request feature is not available yet");
      }
    } catch (error) {
      console.error("Error requesting photo:", error);
      showError("Photo request feature is not available yet");
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
    <motion.div
      key={match._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: "100%",
          display: "flex",
          flexDirection: "row",
          borderRadius: 3,
          overflow: "hidden",
          transition: "all 0.3s ease",
          border: "none",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          "&:hover": {
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            transform: "translateY(-2px)",
          },
        }}
      >
        {/* Left Section - Profile Image */}
        <Box
          sx={{
            position: "relative",
            width: "33%",
            flexShrink: 0,
            backgroundColor: "#1a1a2e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "260px",
          }}
        >
          {hasImage && match.profileImage ? (
            <>
              <CardMedia
                component="img"
                height="100%"
                image={getImageUrl(match.profileImage)}
                alt={match.name}
                onError={(e) => {
                  setHasImage(false);
                  e.target.style.display = "none";
                }}
                sx={{
                  cursor: "pointer",
                  objectFit: "cover",
                  objectPosition: "top",
                  height: "100%",
                  width: "100%",
                  maxHeight: "260px",
                  transition: "transform 0.3s ease",
                }}
                onClick={() => onViewProfile(match)}
              />
              {/* Photo Count Badge */}
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <CollectionsIcon sx={{ color: "white", fontSize: 16 }} />
                <Typography
                  variant="caption"
                  sx={{ color: "white", fontWeight: 600, fontSize: "0.75rem" }}
                >
                  {match.photos?.length || Math.floor(Math.random() * 8) + 1}
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "3rem",
                  }}
                >
                  👤
                </Avatar>
                <Button
                  variant="contained"
                  onClick={handleRequestPhoto}
                  sx={{
                    mt: 2,
                    backgroundColor: "white",
                    color: "#333",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    },
                  }}
                >
                  Request photo
                </Button>
              </Box>
            </>
          )}
        </Box>

        {/* Right Section - Profile Details */}
        <Box
          sx={{
            flex: 1,
            px: 2,
            pt: 2,
            pb: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Top Section - Status and Name */}
          <Box>
            {/* Active Status */}
            <Typography
              variant="caption"
              sx={{
                color: "#9e9e9e",
                fontSize: "0.75rem",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                mb: 1,
                display: "block",
              }}
            >
              Active Today
            </Typography>

            {/* Name, Age and Verification */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#1976d2",
                  fontSize: "1.4rem",
                  lineHeight: 1.2,
                  cursor:"pointer"
                }}
                onClick={() => onViewProfile(match)}
              >
                {match?.name}, {getAge(match?.dob) || "N/A"}
              </Typography>
              {(match.isEmailVerified ||
                match.isPhoneVerified ||
                match.isIdVerified ||
                match.isPhotoVerified) && (
                <VerifiedIcon sx={{ color: "#1976d2", fontSize: 20 }} />
              )}
            </Box>


            {/* Basic Information */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  mb: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                {getHeight(match.height) || "5ft 0in"} •{" "}
                {match.city || "Madhogarh"} •{" "}
                {match.caste || "Kshatriya-Sengar"}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  mb: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <WorkIcon sx={{ fontSize: 14, color: "#999" }} />
                {match.occupation || "Not planning to work"} •{" "}
                {match.annualIncome || "No Income"}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <SchoolIcon sx={{ fontSize: 14, color: "#999" }} />
                {match.education || "B.A"} •
                <GroupIcon sx={{ fontSize: 14, color: "#999", ml: 0.5 }} />
                {match.maritalStatus || "Never Married"}
              </Typography>
            </Box>
          </Box>

          {/* Message Sent Status */}
          {interestSent && !showInterestInput && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                backgroundColor: "#fce4ec",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CheckCircleIcon sx={{ color: "#dc2626", fontSize: 20 }} />
              <Typography
                variant="body2"
                sx={{
                  color: "#dc2626",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                Message Sent
              </Typography>
            </Box>
          )}

          {/* Bottom Section - Action Buttons OR Interest Input Field */}
          {showInterestInput && !interestSent ? (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                width: "100%",
              }}
            >
              <TextField
                size="small"
                placeholder="Send a personalised message"
                value={interestMessage}
                onChange={(e) => setInterestMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && interestMessage.trim()) {
                    e.preventDefault();
                    handleSendInterest();
                  }
                }}
                disabled={sendingInterest}
                autoFocus
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleSendInterest}
                        disabled={!interestMessage.trim() || sendingInterest}
                        edge="end"
                        size="small"
                        sx={{
                          bgcolor: "#dc2626",
                          color: "white",
                          "&:hover": {
                            bgcolor: "#b91c1c",
                          },
                          "&.Mui-disabled": {
                            bgcolor: "#f5f5f5",
                            color: "#ccc",
                          },
                          width: 28,
                          height: 28,
                        }}
                      >
                        {sendingInterest ? (
                          <CircularProgress size={14} color="inherit" />
                        ) : (
                          <SendIcon sx={{ fontSize: 16 }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  flex: 1,
                  maxWidth: "60%",
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                    pr: 0.5,
                    fontSize: "0.875rem",
                    "&:hover": {
                      backgroundColor: "#eeeeee",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "white",
                      boxShadow: "0 0 0 2px rgba(220, 38, 38, 0.1)",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    py: 0.75,
                  },
                }}
              />
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  setShowInterestInput(false);
                  setInterestMessage("");
                }}
                disabled={sendingInterest}
                sx={{
                  textTransform: "none",
                  color: "#1976d2",
                  minWidth: "auto",
                  px: 2,
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.08)",
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  cursor: interestSent ? "default" : "pointer",
                  color: interestSent ? "#999" : "#51365F",
                  flex: "1 1 auto",
                  minWidth: 0,
                  opacity: interestSent ? 0.6 : 1,
                  "&:hover": { opacity: interestSent ? 0.6 : 0.8 },
                }}
                onClick={handleInterestClick}
              >
                <SendIcon sx={{ fontSize: 18 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: interestSent ? "#999" : "#51365F",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  Interest
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  cursor: processingSuperInterest || hasShownSuperInterest ? "default" : "pointer",
                  color: hasShownSuperInterest ? "#e91e63" : "#51365F",
                  flex: "1 1 auto",
                  minWidth: 0,
                  opacity: processingSuperInterest || hasShownSuperInterest ? 0.7 : 1,
                  "&:hover": { opacity: processingSuperInterest || hasShownSuperInterest ? 0.7 : 0.8 },
                }}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  if (hasShownSuperInterest || processingSuperInterest) {
                    return;
                  }

                  try {
                    setProcessingSuperInterest(true);
                    const { API_BASE_URL } = await import("../utils/api");
                    const Cookies = (await import("js-cookie")).default;
                    const token = Cookies.get("accessToken");

                    if (!token) {
                      showError("Please login to send super interest");
                      return;
                    }

                    const response = await fetch(`${API_BASE_URL}/matches/super-interest`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        profileId: match._id,
                      }),
                    });

                    const data = await response.json();

                    if (response.ok && data.success) {
                      setHasShownSuperInterest(true);
                      showSuccess("Super interest sent successfully!");
                      if (onShowSuperInterest) {
                        onShowSuperInterest(match._id);
                      }
                    } else {
                      // Handle limit reached error with a more user-friendly message
                      if (data.code === "SUPER_INTEREST_LIMIT_REACHED" || 
                          (data.message && data.message.includes("limit"))) {
                        showError("Daily super interest limit reached. Upgrade to premium for unlimited super interests.");
                      } else {
                        showError(data.message || "Failed to send super interest");
                      }
                    }
                  } catch (error) {
                    console.error("Error sending super interest:", error);
                    showError("Failed to send super interest. Please try again.");
                  } finally {
                    setProcessingSuperInterest(false);
                  }
                }}
              >
                {processingSuperInterest ? (
                  <CircularProgress size={14} sx={{ color: "#51365F" }} />
                ) : hasShownSuperInterest ? (
                  <FavoriteIcon sx={{ fontSize: 18, color: "#e91e63" }} />
                ) : (
                  <FavoriteBorderIcon sx={{ fontSize: 18 }} />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    color: hasShownSuperInterest ? "#e91e63" : "#51365F",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  {hasShownSuperInterest ? "Super Interest Sent" : "Super Interest"}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  cursor: processingShortlist ? "default" : "pointer",
                  color: isShortlisted ? "#ff9800" : "#51365F",
                  flex: "1 1 auto",
                  minWidth: 0,
                  opacity: processingShortlist ? 0.7 : 1,
                  "&:hover": { opacity: processingShortlist ? 0.7 : 0.8 },
                }}
                onClick={handleShortlistClick}
              >
                {processingShortlist ? (
                  <CircularProgress size={14} sx={{ color: "#51365F" }} />
                ) : isShortlisted ? (
                  <StarIcon sx={{ fontSize: 18, color: "#ff9800" }} />
                ) : (
                  <StarBorderIcon sx={{ fontSize: 18 }} />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    color: isShortlisted ? "#ff9800" : "#51365F",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isShortlisted ? "Shortlisted" : "Shortlist"}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  cursor: "pointer",
                  color: "#51365F",
                  flex: "1 1 auto",
                  minWidth: 0,
                  "&:hover": { opacity: 0.8 },
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onChatClick) {
                    onChatClick(match);
                  }
                }}
              >
                <ChatIcon sx={{ fontSize: 18 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#51365F",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  Chat
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Card>
    </motion.div>
  );
};

export default MatchCard;
