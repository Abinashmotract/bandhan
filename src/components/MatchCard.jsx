import React from "react";
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
  ThumbUp as ThumbUpIcon,
  Collections as CollectionsIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const MatchCard = ({
  match,
  onShowInterest,
  onShowSuperInterest,
  onViewProfile,
  onToggleShortlist,
  getAge,
  getHeight,
}) => {
  const handleShortlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleShortlist(match._id);
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
          }}
        >
          <CardMedia
            component="img"
            height="100%"
            image={
              match.profileImage?.startsWith("http")
                ? match.profileImage
                : match.profileImage
                ? (match.profileImage.startsWith("/uploads/") || match.profileImage.startsWith("uploads/")
                    ? `http://localhost:3000/${match.profileImage.startsWith("/") ? match.profileImage.slice(1) : match.profileImage}`
                    : `http://localhost:3000/uploads/${match.profileImage}`)
                : "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
            }
            alt={match.name}
            onError={(e) => {
              // Fallback to default image if loading fails
              e.target.src = "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
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
                }}
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

            {/* Compatibility Tag */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "#51365F",
                border: "2px solid #51365F",
                borderRadius: 2,
                px: 1.5,
                py: 0.5,
                mb: 2,
              }}
            >
              <ThumbUpIcon sx={{ color: "white", fontSize: 16, mr: 0.5 }} />
              <Typography
                variant="caption"
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                Most Compatible
              </Typography>
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

          {/* Bottom Section - Action Buttons */}
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
                cursor: "pointer",
                color: "#51365F",
                flex: "1 1 auto",
                minWidth: 0,
                "&:hover": { opacity: 0.8 },
              }}
              onClick={() => onShowInterest(match._id)}
            >
              <SendIcon sx={{ fontSize: 18 }} />
              <Typography
                variant="body2"
                sx={{
                  color: "#51365F",
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
                cursor: "pointer",
                color: "#51365F",
                flex: "1 1 auto",
                minWidth: 0,
                "&:hover": { opacity: 0.8 },
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onShowSuperInterest(match._id);
              }}
            >
              {match.isShortlisted ? (
                <FavoriteIcon sx={{ fontSize: 18, color: "#e91e63" }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 18 }} />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: match.isShortlisted ? "#e91e63" : "#51365F",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap",
                }}
              >
                Super Interest
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
                onToggleShortlist(match._id);
              }}
            >
              <StarIcon sx={{ fontSize: 18 }} />
              <Typography
                variant="body2"
                sx={{
                  color: "#51365F",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap",
                }}
              >
                Shortlist
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
        </Box>
      </Card>
    </motion.div>
  );
};

export default MatchCard;
