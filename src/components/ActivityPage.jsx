import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  Avatar,
  Chip,
  IconButton,
  Grid,
  Divider,
  Badge,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack,
  Favorite,
  FavoriteBorder,
  Send,
  Star,
  StarBorder,
  Person,
  Phone,
  Message,
  MoreVert,
  CheckCircle,
  Cancel,
  ArrowForward,
  CameraAlt,
  Chat,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
const ActivityPage = ({
  onBackToMatches,
  onViewProfile,
  getAge,
  getHeight,
}) => {
  const [activeTab, setActiveTab] = useState("received");
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // Sample data for demonstration
  const activityData = {
    summary: {
      acceptedInterests: 3,
      interestsReceived: 12,
      interestsSent: 8,
      shortlistedProfiles: 5,
      declinedInterests: 2,
    },
    receivedInterests: [
      {
        id: 1,
        name: "Priyanka Singh",
        age: 26,
        profileId: "TXYVVH7",
        lastSeen: "7:32 AM",
        profileImage:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        height: "5.2",
        city: "Nashik",
        caste: "Rajput",
        occupation: "Clerk",
        annualIncome: "2-5 Lakh",
        education: "MBA",
        maritalStatus: "Never Married",
        religion: "Hindu",
        motherTongue: "Hindi",
        isEmailVerified: true,
        isPhoneVerified: true,
        isIdVerified: true,
        isPhotoVerified: true,
        status: "received", // received, accepted, declined
        receivedDate: "2024-01-15",
        matchPercentage: 89,
      },
      {
        id: 2,
        name: "Kavya Iyer",
        age: 28,
        profileId: "TXYVVH8",
        lastSeen: "2 hours ago",
        profileImage:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        height: "5.4",
        city: "Mumbai",
        caste: "Iyer",
        occupation: "Software Engineer",
        annualIncome: "8-12 Lakh",
        education: "B.Tech",
        maritalStatus: "Never Married",
        religion: "Hindu",
        motherTongue: "Tamil",
        isEmailVerified: true,
        isPhoneVerified: false,
        isIdVerified: true,
        isPhotoVerified: true,
        status: "accepted",
        receivedDate: "2024-01-14",
        matchPercentage: 92,
      },
    ],
    sentInterests: [
      {
        id: 3,
        name: "Anjali Patel",
        age: 25,
        profileId: "TXYVVH9",
        lastSeen: "1 day ago",
        profileImage:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        height: "5.6",
        city: "Ahmedabad",
        caste: "Patel",
        occupation: "Doctor",
        annualIncome: "12-18 Lakh",
        education: "MBBS",
        maritalStatus: "Never Married",
        religion: "Hindu",
        motherTongue: "Gujarati",
        isEmailVerified: true,
        isPhoneVerified: true,
        isIdVerified: true,
        isPhotoVerified: true,
        status: "sent", // sent, accepted, declined
        sentDate: "2024-01-13",
        matchPercentage: 85,
      },
      {
        id: 4,
        name: "Sneha Reddy",
        age: 27,
        profileId: "TXYVVH10",
        lastSeen: "3 days ago",
        profileImage:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        height: "5.3",
        city: "Hyderabad",
        caste: "Reddy",
        occupation: "Teacher",
        annualIncome: "4-8 Lakh",
        education: "M.Ed",
        maritalStatus: "Never Married",
        religion: "Hindu",
        motherTongue: "Telugu",
        isEmailVerified: true,
        isPhoneVerified: false,
        isIdVerified: false,
        isPhotoVerified: true,
        status: "accepted",
        sentDate: "2024-01-12",
        matchPercentage: 78,
      },
    ],
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedInterest(null);
  };

  const handleInterestAction = (interestId, action) => {
    console.log(`Action ${action} on interest ${interestId}`);
    // Handle interest actions (accept, decline, etc.)
  };

  const handleViewProfile = (interest) => {
    setSelectedInterest(interest);
  };

  const handleBackToInterests = () => {
    setSelectedInterest(null);
  };

  const renderActivitySummary = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: "#333", mb: 3 }}>
        Your Activity Summary
      </Typography>
      <Box sx={{ position: "relative" }}>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={10}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 1 },
            600: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
        >
          {[
            {
              title: "Accepted Interests",
              count: activityData.summary.acceptedInterests,
              icon: <CheckCircle sx={{ color: "#4caf50" }} />,
              color: "#4caf50",
            },
            {
              title: "Interests Received",
              count: activityData.summary.interestsReceived,
              icon: <Send sx={{ color: "#2196f3" }} />,
              color: "#2196f3",
            },
            {
              title: "Interests Sent",
              count: activityData.summary.interestsSent,
              icon: <Send sx={{ color: "#ff9800" }} />,
              color: "#ff9800",
            },
            {
              title: "Shortlisted Profiles",
              count: activityData.summary.shortlistedProfiles,
              icon: <Star sx={{ color: "#e91e63" }} />,
              color: "#e91e63",
            },
            {
              title: "Declined Interests",
              count: activityData.summary.declinedInterests,
              icon: <Cancel sx={{ color: "#f44336" }} />,
              color: "#f44336",
            },
          ].map((item, index) => (
            <SwiperSlide key={item.title} className="p-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    textAlign: "center",
                    borderRadius: 3,

                    transition: "all 0.3s ease",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ mb: 2 }}>{item.icon}</Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: item.color,
                        mb: 1,
                      }}
                    >
                      {item.count}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                      }}
                    >
                      {item.title}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );

  const renderInterestCard = (interest, isReceived = false) => {
    const handleMenuOpen = (event) => {
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    const handleDialogOpen = () => {
      setDialogOpen(true);
      handleMenuClose();
    };

    const handleDialogClose = () => {
      setDialogOpen(false);
    };

    const handleChat = () => {
      // Handle chat logic here
      console.log("Chat with:", interest.id);
      handleDialogClose();
    };

    const handleCancelRequest = () => {
      // Handle cancel request logic here
      console.log("Cancel request for:", interest.id);
      handleDialogClose();
    };

    return (
      <motion.div
        key={interest.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            "&:hover": {
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <CardContent sx={{ p: 0 }} className="pb-0">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Profile Image */}
              <Box sx={{ position: "relative", width: "120px" }}>
                <Box
                  component="img"
                  src={interest.profileImage}
                  alt={interest.name}
                  sx={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    cursor: "pointer",
                    borderRadius: "50%",
                    m: 1,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProfile(interest);
                  }}
                />

                {/* Status Badge */}
              </Box>

              {/* Profile Details */}
              <Box sx={{ flex: 1, p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#1976d2",
                        mb: 0.5,
                      }}
                    >
                      {interest.name}, {getAge(interest.age)}{" "}
                      {(interest.isEmailVerified ||
                        interest.isPhoneVerified ||
                        interest.isIdVerified ||
                        interest.isPhotoVerified) && (
                        <CheckCircle sx={{ fontSize: 16, color: "blue" }} />
                      )}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                      ID: {interest.profileId} • Last seen {interest.lastSeen}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#999" }}>
                      {isReceived ? "Received on" : "Sent on"}{" "}
                      {isReceived ? interest.receivedDate : interest.sentDate}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    {/* Three-dot Menu Button */}
                    <IconButton
                      onClick={handleDialogOpen}
                      sx={{
                        color: "#666",
                        "&:hover": {
                          backgroundColor: "rgba(0,0,0,0.04)",
                        },
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          onClick={(e) => e.stopPropagation()}
        >
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              Choose an action for this connection
            </Typography>
          </DialogContent>
          <DialogActions sx={{ flexDirection: "column", gap: 1, p: 2 }}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {isReceived && interest.status === "received" && (
                <>
                  <Button
                    variant="contained"
                    startIcon={<CheckCircle />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInterestAction(interest.id, "accept");
                    }}
                    className="w-100"
                    sx={{
                      backgroundColor: "#4caf50",
                      "&:hover": { backgroundColor: "#45a049" },
                      textTransform: "none",
                      fontSize: "0.85rem",
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    className="w-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInterestAction(interest.id, "decline");
                    }}
                    sx={{
                      borderColor: "#f44336",
                      color: "#f44336",
                      "&:hover": {
                        borderColor: "#d32f2f",
                        backgroundColor: "rgba(244, 67, 54, 0.04)",
                      },
                      textTransform: "none",
                      fontSize: "0.85rem",
                    }}
                  >
                    Decline
                  </Button>
                </>
              )}

              {interest.status === "accepted" && (
                <>
                  <Button
                    variant="contained"
                    startIcon={<Message />}
                    className="w-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle chat logic
                    }}
                    sx={{
                      backgroundColor: "#e91e63",
                      "&:hover": { backgroundColor: "#c2185b" },
                      textTransform: "none",
                      fontSize: "0.85rem",
                    }}
                  >
                    Chat
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Phone />}
                    className="w-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle call logic
                    }}
                    sx={{
                      borderColor: "#4caf50",
                      color: "#4caf50",
                      "&:hover": {
                        borderColor: "#45a049",
                        backgroundColor: "rgba(76, 175, 80, 0.04)",
                      },
                      textTransform: "none",
                      fontSize: "0.85rem",
                    }}
                  >
                    Call
                  </Button>
                </>
              )}
            </Box>
            <Button
              fullWidth
              variant="text"
              onClick={handleDialogClose}
              sx={{
                textTransform: "none",
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    );
  };

  const ProfileCard = () => {
    const profileData = {
      name: "Ritisha Singh",
      age: 26,
      height: "5ft 3in",
      location: "Lucknow",
      origin: "Rajput-Thakur",
      profession: "Analyst",
      salary: "Rs. 2 - 3 Lakh",
      education: "M.Sc",
      lastSeen: "6:57 AM",
      photoCount: 14,
      shortlistedDate: "23-Oct-25",
      managedBy: "Self",
      isNearby: true,
    };

    return (
      <>
        <div className="container pt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5
                className="mb-1"
                style={{ fontWeight: "600", color: "#2d3436" }}
              >
                Shortlisted Profiles{" "}
                <span style={{ color: "#636e72", fontWeight: "400" }}>(1)</span>
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                Move ahead with your decision by sending an interest!
              </p>
            </div>
            <ArrowForward style={{ color: "#636e72", cursor: "pointer" }} />
          </div>
        </div>
        <Swiper
        className="pb-4"
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{ el: ".swiper-pagination", clickable: true }}
          scrollbar={{ el: ".swiper-scrollbar", draggable: true }}
          breakpoints={{
            320: { slidesPerView: 1 },
            900: { slidesPerView: 1.5 },
            1200: { slidesPerView: 2 },
          }}
        >
          <SwiperSlide>
            <Card
              className="border-0 shadow-sm overflow-hidden"
              style={{ borderRadius: "12px" }}
            >
              <div style={{ position: "relative", height: "450px" }}>
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=450&fit=crop"
                  alt={profileData.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                {/* Gradient Overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "60%",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                  }}
                />

                {/* Top Badges */}
                <div
                  style={{ position: "absolute", top: "12px", left: "12px" }}
                >
                  <Badge
                    bg="dark"
                    className="px-3 py-2"
                    style={{ fontSize: "12px", fontWeight: "500" }}
                  >
                    Shortlisted
                    <br />
                    <span style={{ fontSize: "11px" }}>
                      on {profileData.shortlistedDate}
                    </span>
                  </Badge>
                </div>

                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <Badge
                    bg="dark"
                    className="d-flex align-items-center gap-1 px-2 py-2"
                  >
                    <CameraAlt style={{ fontSize: "14px" }} />
                    <span>{profileData.photoCount}</span>
                  </Badge>
                  {profileData.isNearby && (
                    <Badge
                      bg="success"
                      className="px-2 py-2"
                      style={{ fontSize: "11px" }}
                    >
                      Nearby
                    </Badge>
                  )}
                </div>

                {/* Profile Info */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "60px",
                    left: "16px",
                    right: "16px",
                    color: "white",
                  }}
                >
                  <p
                    className="mb-1"
                    style={{ fontSize: "12px", opacity: 0.9 }}
                  >
                    Last seen at {profileData.lastSeen}
                  </p>
                  <h3
                    className="mb-2"
                    style={{ fontWeight: "700", fontSize: "28px" }}
                  >
                    {profileData.name}, {profileData.age}
                  </h3>
                  <p
                    className="mb-1"
                    style={{ fontSize: "13px", lineHeight: "1.6" }}
                  >
                    {profileData.height} • {profileData.location} •{" "}
                    {profileData.origin}
                  </p>
                  <p
                    className="mb-1"
                    style={{ fontSize: "13px", lineHeight: "1.6" }}
                  >
                    {profileData.profession} • {profileData.salary}
                  </p>
                  <p className="mb-2" style={{ fontSize: "13px" }}>
                    {profileData.education}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      opacity: 0.8,
                      fontStyle: "italic",
                    }}
                  >
                    Profile managed by {profileData.managedBy}
                  </p>
                </div>

                {/* Action Buttons */}
                 <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "0",
                    right: "0",
                    display: "flex",
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(10px)",
                    justifyContent: "space-around",
                  }}
                >
                  <Tooltip title="Interest" >
                    <IconButton>
                      <FavoriteBorder style={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Super Interest">
                    <IconButton>
                      <Favorite style={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Shortlisted">
                    <IconButton>
                      <Star style={{ color: "white" }}/>
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Chat">
                    <IconButton>
                      <Chat style={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </Card>
          </SwiperSlide>
          <SwiperSlide>
            <Card
              className="border-0 shadow-sm overflow-hidden"
              style={{ borderRadius: "12px" }}
            >
              <div style={{ position: "relative", height: "450px" }}>
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=450&fit=crop"
                  alt={profileData.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                {/* Gradient Overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "60%",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                  }}
                />

                {/* Top Badges */}
                <div
                  style={{ position: "absolute", top: "12px", left: "12px" }}
                >
                  <Badge
                    bg="dark"
                    className="px-3 py-2"
                    style={{ fontSize: "12px", fontWeight: "500" }}
                  >
                    Shortlisted
                    <br />
                    <span style={{ fontSize: "11px" }}>
                      on {profileData.shortlistedDate}
                    </span>
                  </Badge>
                </div>

                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <Badge
                    bg="dark"
                    className="d-flex align-items-center gap-1 px-2 py-2"
                  >
                    <CameraAlt style={{ fontSize: "14px" }} />
                    <span>{profileData.photoCount}</span>
                  </Badge>
                  {profileData.isNearby && (
                    <Badge
                      bg="success"
                      className="px-2 py-2"
                      style={{ fontSize: "11px" }}
                    >
                      Nearby
                    </Badge>
                  )}
                </div>

                {/* Profile Info */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "60px",
                    left: "16px",
                    right: "16px",
                    color: "white",
                  }}
                >
                  <p
                    className="mb-1"
                    style={{ fontSize: "12px", opacity: 0.9 }}
                  >
                    Last seen at {profileData.lastSeen}
                  </p>
                  <h3
                    className="mb-2"
                    style={{ fontWeight: "700", fontSize: "28px" }}
                  >
                    {profileData.name}, {profileData.age}
                  </h3>
                  <p
                    className="mb-1"
                    style={{ fontSize: "13px", lineHeight: "1.6" }}
                  >
                    {profileData.height} • {profileData.location} •{" "}
                    {profileData.origin}
                  </p>
                  <p
                    className="mb-1"
                    style={{ fontSize: "13px", lineHeight: "1.6" }}
                  >
                    {profileData.profession} • {profileData.salary}
                  </p>
                  <p className="mb-2" style={{ fontSize: "13px" }}>
                    {profileData.education}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      opacity: 0.8,
                      fontStyle: "italic",
                    }}
                  >
                    Profile managed by {profileData.managedBy}
                  </p>
                </div>

                {/* Action Buttons */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "0",
                    right: "0",
                    display: "flex",
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(10px)",
                    justifyContent: "space-around",
                  }}
                >
                  <Tooltip title="Interest">
                    <IconButton>
                      <FavoriteBorder style={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Super Interest">
                    <IconButton>
                      <Favorite style={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Shortlisted">
                    <IconButton>
                      <Star style={{ color: "white" }}/>
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Chat">
                    <IconButton>
                      <Chat style={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </Card>
          </SwiperSlide>
        </Swiper>
      </>
    );
  };

  const renderProfileDetail = (interest) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackToInterests}
          sx={{ mb: 2, textTransform: "none" }}
        >
          Back to Interests
        </Button>
      </Box>

      <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ position: "relative" }}>
          <Box
            component="img"
            src={interest.profileImage}
            alt={interest.name}
            sx={{ width: "100%", height: 300, objectFit: "cover" }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
              p: 3,
              color: "white",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {interest.name}, {getAge(interest.age)}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              ID: {interest.profileId} • Last seen {interest.lastSeen}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Profile managed by self
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value="about" sx={{ minHeight: "auto" }}>
              <Tab
                label="About Me"
                value="about"
                sx={{ textTransform: "none", fontWeight: 600 }}
              />
              <Tab
                label="Family"
                value="family"
                sx={{ textTransform: "none", fontWeight: 600 }}
              />
              <Tab
                label="Looking For"
                value="looking"
                sx={{ textTransform: "none", fontWeight: 600 }}
              />
            </Tabs>
          </Box>

          {/* About Me Content */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Basic Information
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  {interest.religion} - {interest.caste}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  {getHeight(interest.height)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  {interest.annualIncome} per Annum
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Mother tongue is {interest.motherTongue}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  {interest.maritalStatus}
                </Typography>
              </Grid>
            </Grid>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              I am {interest.name}, a {getAge(interest.age)}-year-old{" "}
              {interest.education} graduate working as {interest.occupation} in
              the private sector in {interest.city}. I am an independent and
              career-oriented woman looking for a life partner who shares
              similar values and aspirations.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Education
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
              {interest.education} - Post Graduation
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Career
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
              {interest.occupation} - Private Sector
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Family
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
              Father is a Businessman/Entrepreneur & Mother is a Homemaker
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              startIcon={<Star />}
              sx={{
                backgroundColor: "#e91e63",
                "&:hover": { backgroundColor: "#c2185b" },
                textTransform: "none",
              }}
            >
              Super Interest
            </Button>
            <Button
              variant="outlined"
              startIcon={<Message />}
              sx={{
                borderColor: "#1976d2",
                color: "#1976d2",
                "&:hover": {
                  borderColor: "#1565c0",
                  backgroundColor: "rgba(25, 118, 210, 0.04)",
                },
                textTransform: "none",
              }}
            >
              Chat
            </Button>
            <Button
              variant="outlined"
              startIcon={<Phone />}
              sx={{
                borderColor: "#4caf50",
                color: "#4caf50",
                "&:hover": {
                  borderColor: "#45a049",
                  backgroundColor: "rgba(76, 175, 80, 0.04)",
                },
                textTransform: "none",
              }}
            >
              Call
            </Button>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              sx={{
                borderColor: "#f44336",
                color: "#f44336",
                "&:hover": {
                  borderColor: "#d32f2f",
                  backgroundColor: "rgba(244, 67, 54, 0.04)",
                },
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (selectedInterest) {
    return renderProfileDetail(selectedInterest);
  }

  return (
    <Box>
      {renderActivitySummary()}
      {ProfileCard()}

      <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ px: 2 }}>
            <Tab
              label={`Received (${activityData.receivedInterests.length})`}
              value="received"
              sx={{ textTransform: "none", fontWeight: 600 }}
            />
            <Tab
              label={`Sent (${activityData.sentInterests.length})`}
              value="sent"
              sx={{ textTransform: "none", fontWeight: 600 }}
            />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {activeTab === "received" && (
            <Box className="d-flex flex-column gap-3">
              {activityData?.receivedInterests.length > 0 ? (
                activityData?.receivedInterests.map((interest) =>
                  renderInterestCard(interest, true)
                )
              ) : (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <Typography variant="h6" sx={{ color: "#666", mb: 2 }}>
                    No interests received yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#999" }}>
                    Start sending interests to receive responses
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {activeTab === "sent" && (
            <Box className="d-flex flex-column gap-3">
              {activityData?.sentInterests.length > 0 ? (
                activityData?.sentInterests.map((interest) =>
                  renderInterestCard(interest, false)
                )
              ) : (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <Typography variant="h6" sx={{ color: "#666", mb: 2 }}>
                    No interests sent yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#999" }}>
                    Start sending interests to profiles you like
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ActivityPage;
