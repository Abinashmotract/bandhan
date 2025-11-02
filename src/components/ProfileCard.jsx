import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Rating,
  CircularProgress,
} from "@mui/material";
import {
  Favorite as LikeIcon,
  FavoriteBorder as LikeBorderIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Cake as CakeIcon,
  Language as LanguageIcon,
  Message as MessageIcon,
  VerifiedUser as VerifiedIcon,
  Star as StarIcon,
  Diamond as DiamondIcon,
  EmojiEvents as CrownIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSubscription } from '../hooks/useSubscription';
import ProfileAccessRestriction from "./ProfileAccessRestriction";
import InterestButton from "./InterestButton";
import { useDispatch, useSelector } from "react-redux";
import {
  likeProfile,
  superlikeProfile,
  addToFavourites,
} from "../store/slices/interactionSlice";
import toast from "react-hot-toast";
import { interactionAPI } from "../services/apiService";

const ProfileCard = ({ profile, onProfileClick, showActions = true }) => {
  const navigate = useNavigate();
  const { checkProfileAccess, canSendInterest, canSendMessage } =
    useSubscription();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [liked, setLiked] = useState(profile.isLiked || false);
  const [favourited, setFavourited] = useState(profile.isFavourited || false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const hasAccess = checkProfileAccess(profile);
  const canSendInterestToProfile = canSendInterest();
  const canSendMessageToProfile = canSendMessage();

  const getPlanIcon = (planName) => {
    switch (planName) {
      case "Basic":
        return <LockIcon sx={{ color: "#9c27b0" }} />;
      case "Entry":
        return <StarIcon sx={{ color: "#51365F" }} />;
      case "Advanced":
        return <DiamondIcon sx={{ color: "#ff6f00" }} />;
      case "Premium":
        return <CrownIcon sx={{ color: "#4caf50" }} />;
      case "Elite":
        return <CrownIcon sx={{ color: "#ff9800" }} />;
      default:
        return <StarIcon />;
    }
  };

  const getPlanColor = (planName) => {
    switch (planName) {
      case "Basic":
        return "#9c27b0";
      case "Entry":
        return "#51365F";
      case "Advanced":
        return "#ff6f00";
      case "Premium":
        return "#4caf50";
      case "Elite":
        return "#ff9800";
      default:
        return "#51365F";
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like profiles");
      return;
    }

    try {
      if (liked) {
        // Unlike logic here
        setLiked(false);
        toast.success("Removed from likes");
      } else {
        await dispatch(likeProfile(profile._id));
        setLiked(true);
        toast.success("Added to likes");
      }
    } catch (error) {
      toast.error("Failed to like profile");
    }
  };

  const handleFavourite = async () => {
    if (!user) {
      toast.error("Please login to add to favourites");
      return;
    }

    try {
      if (favourited) {
        // Remove from favourites logic here
        setFavourited(false);
        toast.success("Removed from favourites");
      } else {
        await dispatch(addToFavourites(profile._id));
        setFavourited(true);
        toast.success("Added to favourites");
      }
    } catch (error) {
      toast.error("Failed to add to favourites");
    }
  };

  const handleMessage = () => {
    if (!canSendMessageToProfile) {
      navigate("/membership");
      return;
    }
    // Navigate to chat or open message dialog
    toast.info("Messaging feature coming soon");
  };

  const calculateAge = (dob) => {
    if (!dob) return "Not specified";
    const today = new Date();
    const birthDate = new Date(dob);
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

  const formatHeight = (height) => {
    if (!height) return "Not specified";
    const feet = Math.floor(height / 12);
    const inches = height % 12;
    return `${feet}'${inches}"`;
  };

  const ProfileContent = () => (
    <>
      <Card
        sx={{
          maxWidth: 400,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
          },
          border: profile.requiresSubscription
            ? `2px solid ${getPlanColor("Entry")}`
            : "1px solid #e0e0e0",
        }}
        onClick={() => onProfileClick && onProfileClick(profile)}
      >
        {/* Profile Image */}
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="300"
            image={(() => {
              // Use specific images for featured profiles
              if (profile._id === "68d8385868c4ba9ede975941") {
                return "https://imgs.search.brave.com/g4dLcOCvvKbKMmqnuJ1au8GRGfARNC5KepKZ9jmUc44/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cudGVsdWd1b25lLmNvbS9waG90b3MvdXBsb2Fkc0V4dC91cGxvYWRzL0thdnlhJTIwS2FseWFucmFtL0thdnlhJTIwS2FseWFuUmFtJTIwTmV3JTIwR2FsbGVyeS9LYXZ5YSUyMEthbHlhblJh bSUyMEdhbGxlcnkud2VicA";
              } else if (profile._id === "68d8385868c4ba9ede975942") {
                return "https://imgs.search.brave.com/F599isaQp8REE-T6yabqck42qIFYv2n4TL9WkiB3HM4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cuZGl0dW5pdmVyc2l0eS5lZHUuaW4vdXBsb2Fkcy9mYWN1bHR5X2ltYWdlcy8xNjg3ODU3MTA4XzEyYzBjZWYyMWE4YzM5N2NiODMzLndlYnA";
              } else if (profile._id === "68d8385868c4ba9ede975935") {
                return "https://imgs.search.brave.com/FW7DkG27fkN2oDlgfKHD8UzOwhuYnBXDn0RFUIWs16I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0aWMudG9paW1nLmNvbS90aHVtYi9pbWdz/aXplLTIzNDU2LG1zaWQtODgxNDAxMDAsd2lkdGgtNjAwLHJl/c2l6ZW1vZGUtNC84ODE0MDEwMC5qcGc";
              }
              return profile.profileImage || "/default-profile.jpg";
            })()}
            alt={profile.name}
            sx={{ objectFit: "cover" }}
          />

          {/* Premium Badge */}
          {profile.requiresSubscription && (
            <Chip
              icon={getPlanIcon("Entry")}
              label="Premium"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: getPlanColor("Entry"),
                color: "white",
                fontWeight: "bold",
              }}
            />
          )}

          {/* Verification Badge */}
          {profile.isVerified && (
            <Chip
              icon={<VerifiedIcon />}
              label="Verified"
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                backgroundColor: "#4caf50",
                color: "white",
                fontWeight: "bold",
              }}
            />
          )}

          {/* Action Buttons */}
          {showActions && (
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                display: "flex",
                gap: 1,
              }}
            >
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
                }}
              >
                {liked ? (
                  <LikeIcon sx={{ color: "#51365F" }} />
                ) : (
                  <LikeBorderIcon />
                )}
              </IconButton>

              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavourite();
                }}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
                }}
              >
                <StarIcon sx={{ color: favourited ? "#ff9800" : "#666" }} />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Profile Content */}
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          {/* Name and Basic Info */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              sx={{ color: "#000", fontWeight: "bold", mb: 0.5 }}
            >
              {profile.name}, {calculateAge(profile.dob)}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <LocationIcon sx={{ fontSize: 16, color: "#666" }} />
              <Typography variant="body2" sx={{ color: "#666" }}>
                {profile.location || "Location not specified"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <WorkIcon sx={{ fontSize: 16, color: "#666" }} />
              <Typography variant="body2" sx={{ color: "#666" }}>
                {profile.profession || "Profession not specified"}
              </Typography>
            </Box>
          </Box>

          {/* Key Details */}
          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                sx={{ color: "#000", fontWeight: "bold" }}
              >
                Height
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                {formatHeight(profile.height)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                sx={{ color: "#000", fontWeight: "bold" }}
              >
                Religion
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                {profile.religion || "Not specified"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                sx={{ color: "#000", fontWeight: "bold" }}
              >
                Education
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                {profile.education || "Not specified"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                sx={{ color: "#000", fontWeight: "bold" }}
              >
                Marital Status
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                {profile.maritalStatus || "Not specified"}
              </Typography>
            </Grid>
          </Grid>

          {/* Bio Preview */}
          {profile.bio && (
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                mb: 2,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {profile.bio}
            </Typography>
          )}

          {/* Action Buttons */}
          {showActions && (
            <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
              <InterestButton
                profile={profile}
                onInterestSent={() => {
                  // Handle interest sent callback
                  toast.success("Interest sent successfully!");
                }}
              />

              <Button
                variant="outlined"
                startIcon={<MessageIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMessage();
                }}
                disabled={!canSendMessageToProfile}
                sx={{
                  flex: 1,
                  borderColor: canSendMessageToProfile ? "#51365F" : "#ccc",
                  color: canSendMessageToProfile ? "#51365F" : "#666",
                  "&:hover": {
                    borderColor: canSendMessageToProfile ? "#ad1457" : "#ccc",
                    backgroundColor: canSendMessageToProfile
                      ? "#51365F10"
                      : "transparent",
                  },
                }}
              >
                {canSendMessageToProfile ? "Message" : "Upgrade to Message"}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

    </>
  );

  // If profile requires subscription and user doesn't have access, show restriction
  if (profile.requiresSubscription && !hasAccess) {
    return (
      <ProfileAccessRestriction
        profile={profile}
        onUpgrade={() => navigate("/membership")}
      >
        <ProfileContent />
      </ProfileAccessRestriction>
    );
  }

  return <ProfileContent />;
};

export default ProfileCard;
