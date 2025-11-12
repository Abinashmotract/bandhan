import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import InterestsTabView from "./InterestsTabView";
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
import { useNavigate } from "react-router-dom";
import {
  getOnlineMatches,
  getShortlistedProfiles,
  getInterestsReceived,
  getInterestsSent,
  getAcceptedInterests,
  getDeclinedInterests,
  updateActivitySummary,
  acceptInterest,
  declineInterest,
} from "../store/slices/activitySlice";
import { showSuccess, showError } from "../utils/toast";
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
  onShowInterest,
  onShowSuperInterest,
  onChatClick,
}) => {
  const dispatch = useDispatch();
  const {
    onlineMatches,
    shortlistedProfiles,
    interestsReceived,
    interestsSent,
    acceptedInterests,
    declinedInterests,
    summary,
    loading: {
      onlineMatches: loadingOnline,
      shortlisted: loadingShortlisted,
      received: loadingReceived,
      sent: loadingSent,
      accepted: loadingAccepted,
      declined: loadingDeclined,
    },
    error: activityErrors,
  } = useSelector((state) => state.activity);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("received");
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentInterest, setCurrentInterest] = useState(null);
  const [isCurrentInterestReceived, setIsCurrentInterestReceived] =
    useState(false);
  const [selectedCard, setSelectedCard] = useState(null); // Track which summary card is clicked
  const [activeProfileTab, setActiveProfileTab] = useState("about"); // Track active tab in profile detail view
  const [unshortlistDialogOpen, setUnshortlistDialogOpen] = useState(false);
  const [profileToUnshortlist, setProfileToUnshortlist] = useState(null);

  const handleUnshortlist = async (profileId) => {
    try {
      const Cookies = (await import("js-cookie")).default;
      const token = Cookies.get("accessToken");
      const { API_BASE_URL } = await import("../utils/api");
      const response = await fetch(
        `${API_BASE_URL}/matches/shortlist/${profileId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to unshortlist profile");
      }

      const result = await response.json();
      showSuccess("Profile removed from shortlist");

      await dispatch(getShortlistedProfiles());
      dispatch(updateActivitySummary());

      return result;
    } catch (error) {
      showError(error.message || "Failed to unshortlist profile");
      throw error;
    }
  };

  const handleUnshortlistClick = (profile) => {
    setProfileToUnshortlist(profile);
    setUnshortlistDialogOpen(true);
  };

  const handleConfirmUnshortlist = async () => {
    if (profileToUnshortlist) {
      try {
        await handleUnshortlist(profileToUnshortlist.id);
        setUnshortlistDialogOpen(false);
        setProfileToUnshortlist(null);
      } catch (error) {
        // Error is already handled in handleUnshortlist
      }
    }
  };

  const handleCancelUnshortlist = () => {
    setUnshortlistDialogOpen(false);
    setProfileToUnshortlist(null);
  };
  useEffect(() => {
    const loadActivityData = async () => {
      try {
        // Load all activity data in parallel
        await Promise.all([
          dispatch(getOnlineMatches()),
          dispatch(getShortlistedProfiles()),
          dispatch(getInterestsReceived()),
          dispatch(getInterestsSent()),
          dispatch(getAcceptedInterests()),
          dispatch(getDeclinedInterests()),
        ]);
        dispatch(updateActivitySummary());
      } catch (error) {
        console.error("Error loading activity data:", error);
      }
    };

    loadActivityData();
  }, [dispatch]);

  const handleInterestAction = async (
    interestId,
    action,
    isReceived = true
  ) => {
    try {
      if (action === "approved") {
        await dispatch(acceptInterest(interestId)).unwrap();
        showSuccess("Interest accepted successfully");
      } else if (action === "decline") {
        await dispatch(declineInterest(interestId)).unwrap();
        showSuccess("Interest declined");
      }
      // Reload data after action
      await Promise.all([
        dispatch(getInterestsReceived()),
        dispatch(getInterestsSent()),
      ]);
      dispatch(updateActivitySummary());
    } catch (error) {
      showError(error || "Failed to process interest");
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Helper function to format last seen
  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return "N/A";
    try {
      const date = new Date(lastSeen);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} min ago`;
      if (diffHours < 24)
        return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      return formatDate(lastSeen);
    } catch {
      return lastSeen;
    }
  };

  // Helper function to map API interest data to component format
  // const mapInterestToComponentFormat = (interest, isReceived = true) => {
  //   const user = isReceived ? interest.fromUser : interest.targetUser;
  //   return {
  //     id: interest.id || interest._id,
  //     name: user?.name || "Unknown",
  //     age: user?.age || (user?.dob ? getAge(user.dob) : null),
  //     profileId: user?.customId || "N/A",
  //     lastSeen: formatLastSeen(user?.lastSeen),
  //     profileImage: user?.profileImage || "",
  //     height: user?.height || "N/A",
  //     city: user?.city || user?.location || "N/A",
  //     state: user?.state || "N/A",
  //     occupation: user?.occupation || "N/A",
  //     education: user?.education || user?.highestQualification || "N/A",
  //     maritalStatus: user?.maritalStatus || "N/A",
  //     religion: user?.religion || "N/A",
  //     caste: user?.caste || "N/A",
  //     motherTongue: Array.isArray(user?.motherTongue)
  //       ? user.motherTongue.join(", ")
  //       : user?.motherTongue || "N/A",
  //     annualIncome: user?.annualIncome || "N/A",
  //     about: user?.about || "",
  //     dob: user?.dob,
  //     location: user?.location || user?.city || "N/A",
  //     // Family information
  //     fatherOccupation: user?.fatherOccupation || "N/A",
  //     motherOccupation: user?.motherOccupation || "N/A",
  //     brothers: user?.brothers || 0,
  //     brothersMarried: user?.brothersMarried || false,
  //     sisters: user?.sisters || 0,
  //     sistersMarried: user?.sistersMarried || false,
  //     familyType: user?.familyType || "N/A",
  //     familyIncome: user?.familyIncome || "N/A",
  //     nativePlace: user?.nativePlace || "N/A",
  //     familyStatus: user?.familyStatus || "N/A",
  //     // Preferences (Looking For)
  //     preferences: user?.preferences || {},
  //     status: interest.status || (isReceived ? "received" : "sent"),
  //     receivedDate: isReceived ? formatDate(interest.createdAt) : null,
  //     sentDate: !isReceived ? formatDate(interest.createdAt) : null,
  //     createdAt: interest.createdAt,
  //     // Keep reference to original interest for API calls
  //     originalInterest: interest,
  //   };
  // };

  // Helper function to map API interest data to component format
const mapInterestToComponentFormat = (interest, isReceived = true) => {
  // For accepted interests, the user data is in toUser
  const user = isReceived 
    ? (interest.toUser || interest.fromUser) // Use toUser for received/accepted, fallback to fromUser
    : (interest.targetUser || interest.toUser); // Use targetUser for sent, fallback to toUser
  
  return {
    id: interest.id || interest._id,
    name: user?.name || "Unknown",
    age: user?.age || (user?.dob ? getAge(user.dob) : null),
    profileId: user?.customId || "N/A",
    lastSeen: formatLastSeen(user?.lastSeen),
    profileImage: user?.profileImage || "",
    height: user?.height || "N/A",
    city: user?.city || user?.location || "N/A",
    state: user?.state || "N/A",
    occupation: user?.occupation || "N/A",
    education: user?.education || user?.highestQualification || "N/A",
    maritalStatus: user?.maritalStatus || "N/A",
    religion: user?.religion || "N/A",
    caste: user?.caste || "N/A",
    motherTongue: Array.isArray(user?.motherTongue)
      ? user.motherTongue.join(", ")
      : user?.motherTongue || "N/A",
    annualIncome: user?.annualIncome || "N/A",
    about: user?.about || "",
    dob: user?.dob,
    location: user?.location || user?.city || "N/A",
    // Family information
    fatherOccupation: user?.fatherOccupation || "N/A",
    motherOccupation: user?.motherOccupation || "N/A",
    brothers: user?.brothers || 0,
    brothersMarried: user?.brothersMarried || false,
    sisters: user?.sisters || 0,
    sistersMarried: user?.sistersMarried || false,
    familyType: user?.familyType || "N/A",
    familyIncome: user?.familyIncome || "N/A",
    nativePlace: user?.nativePlace || "N/A",
    familyStatus: user?.familyStatus || "N/A",
    // Preferences (Looking For)
    preferences: user?.preferences || {},
    status: interest.status || (isReceived ? "received" : "sent"),
    receivedDate: isReceived ? formatDate(interest.createdAt) : null,
    sentDate: !isReceived ? formatDate(interest.createdAt) : null,
    createdAt: interest.createdAt,
    // Keep reference to original interest for API calls
    originalInterest: interest,
  };
};

  // Map received interests from API
  const receivedInterests = Array.isArray(interestsReceived)
    ? interestsReceived.map((interest) =>
        mapInterestToComponentFormat(interest, true)
      )
    : [];

  // Map sent interests from API
  const sentInterests = Array.isArray(interestsSent)
    ? interestsSent.map((interest) =>
        mapInterestToComponentFormat(interest, false)
      )
    : [];

  // Handle card click to show/hide data
  const handleCardClick = (cardType) => {
    if (selectedCard === cardType) {
      setSelectedCard(null); // Toggle off if same card clicked
    } else {
      setSelectedCard(cardType); // Show data for clicked card
    }
  };

  // Map accepted interests from API
  const mappedAcceptedInterests = Array.isArray(acceptedInterests)
    ? acceptedInterests.map((interest) =>
        mapInterestToComponentFormat(interest, true)
      )
    : [];

  // Map declined interests from API
  const mappedDeclinedInterests = Array.isArray(declinedInterests)
    ? declinedInterests.map((interest) =>
        mapInterestToComponentFormat(interest, true)
      )
    : [];

  // Get data for selected card
  const getCardData = (cardType) => {
    switch (cardType) {
      case "accepted":
        return mappedAcceptedInterests;
      case "received":
        return receivedInterests;
      case "sent":
        return sentInterests;
      // case "shortlisted":
      //   return shortlistedProfiles;
      case "declined":
        return mappedDeclinedInterests;
      default:
        return [];
    }
  };
  console.log("mappedAcceptedInterests", mappedAcceptedInterests);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedInterest(null);
  };

  const handleViewProfile = (interest) => {
    setSelectedInterest(interest);
    setActiveProfileTab("about"); // Reset to About Me tab when viewing a new profile
  };

  const handleBackToInterests = () => {
    setSelectedInterest(null);
    setActiveProfileTab("about"); // Reset to About Me tab when going back
  };
  console.log("summary", summary);
  const renderActivitySummary = () => {
    const summaryCards = [
      {
        title: "Accepted Interests",
        count: summary.acceptedInterests || summary.length || 0,
        icon: <CheckCircle sx={{ color: "#4caf50" }} />,
        color: "#4caf50",
        type: "accepted",
      },
      {
        title: "Interests Received",
        count: summary.interestsReceived || 0,
        icon: <Send sx={{ color: "#2196f3" }} />,
        color: "#2196f3",
        type: "received",
      },
      {
        title: "Interests Sent",
        count: summary.interestsSent || 0,
        icon: <Send sx={{ color: "#ff9800" }} />,
        color: "#ff9800",
        type: "sent",
      },
      // {
      //   title: "Shortlisted Profiles",
      //   count: summary.shortlistedProfiles || 0,
      //   icon: <Star sx={{ color: "#e91e63" }} />,
      //   color: "#e91e63",
      //   type: "shortlisted",
      // },
      {
        title: "Declined Interests",
        count: summary.declinedInterests || 0,
        icon: <Cancel sx={{ color: "#f44336" }} />,
        color: "#f44336",
        type: "declined",
      },
    ];

    return (
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
            {summaryCards.map(
              (item, index) => (
                console.log("item", item),
                (
                  <SwiperSlide key={item.title} className="p-1">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        onClick={() => handleCardClick(item.type)}
                        sx={{
                          height: "100%",
                          textAlign: "center",
                          borderRadius: 3,
                          cursor: "pointer",
                          border:
                            selectedCard === item.type
                              ? `2px solid ${item.color}`
                              : "2px solid transparent",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: `0 4px 12px rgba(0,0,0,0.15)`,
                          },
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
                            {item.count || item.length || 0}
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
                )
              )
            )}
          </Swiper>
        </Box>

        {/* Display data below selected card */}
        {selectedCard && (
          <Box sx={{ mt: 3 }}>
            <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {summaryCards.find((c) => c.type === selectedCard)?.title}
                  </Typography>
                  <Button
                    onClick={() => setSelectedCard(null)}
                    size="small"
                    sx={{ textTransform: "none" }}
                  >
                    Close
                  </Button>
                </Box>
                {getCardData(selectedCard).length > 0 ? (
                  <Box className="d-flex flex-column gap-3">
                    {getCardData(selectedCard).map((item) =>
                      selectedCard === "shortlisted"
                        ? renderShortlistedCard(item)
                        : renderInterestCard(
                            item,
                            selectedCard === "received" ||
                              selectedCard === "accepted" ||
                              selectedCard === "declined"
                          )
                    )}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body1" sx={{ color: "#666" }}>
                      No data available for{" "}
                      {summaryCards.find((c) => c.type === selectedCard)?.title}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    );
  };

  const renderInterestCard = (interest, isReceived = false) => {
    const handleMenuOpen = (event) => {
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    const handleDialogOpen = (interest, isReceived) => {
      setCurrentInterest(interest);
      setIsCurrentInterestReceived(isReceived);
      setDialogOpen(true);
      handleMenuClose();
    };

    const handleDialogClose = () => {
      setDialogOpen(false);
      setCurrentInterest(null);
      setIsCurrentInterestReceived(false);
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

    console.log("interest" , interest)

    return (
      <motion.div
        key={interest.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          onClick={() => handleViewProfile(interest)}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            cursor: "pointer",
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
                    borderRadius: "50%",
                    m: 1,
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDialogOpen(interest, isReceived); // Pass both interest and isReceived
                      }}
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
              {/* Accept/Decline buttons for RECEIVED interests with status "sent" */}
              {isCurrentInterestReceived &&
                currentInterest?.status === "sent" && (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<CheckCircle />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInterestAction(
                          currentInterest.id,
                          "approved",
                          true
                        );
                        handleDialogClose();
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
                        handleInterestAction(
                          currentInterest.id,
                          "decline",
                          true
                        );
                        handleDialogClose();
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

              {/* Chat/Call buttons for ACCEPTED interests */}
              {currentInterest?.status === "accepted" && (
                <>
                  <Button
                    variant="contained"
                    startIcon={<Message />}
                    className="w-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle chat logic
                      handleDialogClose();
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
                      handleDialogClose();
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

              {/* Cancel Request button for SENT interests (not received) */}
              {!isCurrentInterestReceived &&
                currentInterest?.status === "sent" && (
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    className="w-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle cancel sent interest logic
                      console.log("Cancel sent interest:", currentInterest.id);
                      handleDialogClose();
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
                    Cancel Request
                  </Button>
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

  // Helper function to map shortlisted profile to component format
  const mapShortlistedProfile = (profile) => {
    const user = profile.userId || profile;
    return {
      id: profile.id || profile._id || user?._id,
      name: user?.name || "Unknown",
      age: user?.age || (user?.dob ? getAge(user.dob) : null),
      profileId: user?.customId || "N/A",
      height: user?.height || "N/A",
      location: user?.location || user?.city || "N/A",
      city: user?.city || "N/A",
      state: user?.state || "N/A",
      caste: user?.caste || "N/A",
      religion: user?.religion || "N/A",
      occupation: user?.occupation || "N/A",
      education: user?.education || user?.highestQualification || "N/A",
      maritalStatus: user?.maritalStatus || "N/A",
      motherTongue: Array.isArray(user?.motherTongue)
        ? user.motherTongue.join(", ")
        : user?.motherTongue || "N/A",
      annualIncome: user?.annualIncome || "N/A",
      about: user?.about || "",
      profileImage: user?.profileImage || "",
      customId: user?.customId || "N/A",
      shortlistedDate: formatDate(profile.shortlistedAt || profile.createdAt),
      photos: user?.photos || [],
      // Family information
      fatherOccupation: user?.fatherOccupation || "N/A",
      motherOccupation: user?.motherOccupation || "N/A",
      brothers: user?.brothers || 0,
      brothersMarried: user?.brothersMarried || false,
      sisters: user?.sisters || 0,
      sistersMarried: user?.sistersMarried || false,
      familyType: user?.familyType || "N/A",
      familyIncome: user?.familyIncome || "N/A",
      nativePlace: user?.nativePlace || "N/A",
      familyStatus: user?.familyStatus || "N/A",
      // Preferences (Looking For)
      preferences: user?.preferences || {},
      // Keep reference to original profile
      originalProfile: profile,
    };
  };
  // Map shortlisted profiles
  const mappedShortlistedProfiles = Array.isArray(shortlistedProfiles)
    ? shortlistedProfiles.map(mapShortlistedProfile)
    : [];

  const renderShortlistedCard = (profile) => {
    console.log(profile)
    return (
      <motion.div
        key={profile.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            cursor: "pointer",
            "&:hover": {
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s ease",
          }}
          onClick={() => handleViewProfile(profile)}
        >
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{ display: "flex", alignItems: "flex-start", p: 2, gap: 2 }}
            >
              <Avatar
                src={profile.profileImage}
                sx={{ width: 100, height: 100, flexShrink: 0 }}
              />
              <Box sx={{ flex: 1 }}>
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {profile.name}
                    {profile.age ? `, ${profile.age}` : ""}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                    ID: {profile.profileId} • {profile.city}
                    {profile.state && profile.state !== "N/A"
                      ? `, ${profile.state}`
                      : ""}
                  </Typography>
                </Box>

                {/* Description */}
                <Typography
                  variant="body2"
                  sx={{ color: "#555", mb: 1.5, lineHeight: 1.5 }}
                >
                  {profile.about ? (
                    profile.about.substring(0, 150) +
                    (profile.about.length > 150 ? "..." : "")
                  ) : (
                    <>
                      {profile.name}
                      {profile.age ? `, ${profile.age}` : ""}
                      {profile.education && profile.education !== "N/A"
                        ? `, ${profile.education} graduate`
                        : ""}
                      {profile.occupation && profile.occupation !== "N/A"
                        ? ` working as ${profile.occupation}`
                        : ""}
                      {profile.city && profile.city !== "N/A"
                        ? ` in ${profile.city}`
                        : ""}
                    </>
                  )}
                </Typography>

                {/* Additional Info */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  {profile.religion && profile.religion !== "N/A" && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#666",
                        backgroundColor: "#f5f5f5",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {profile.religion}
                      {profile.caste && profile.caste !== "N/A"
                        ? ` - ${profile.caste}`
                        : ""}
                    </Typography>
                  )}
                  {profile.height && profile.height !== "N/A" && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#666",
                        backgroundColor: "#f5f5f5",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      Height: {getHeight(profile.height)}
                    </Typography>
                  )}
                  {profile.maritalStatus && profile.maritalStatus !== "N/A" && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#666",
                        backgroundColor: "#f5f5f5",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {profile.maritalStatus}
                    </Typography>
                  )}
                </Box>

                <Typography
                  variant="caption"
                  sx={{ color: "#999", display: "block", mt: 1 }}
                >
                  Shortlisted on {profile.shortlistedDate}
                </Typography>

                {/* Buttons */}
                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<Favorite />}
                    sx={{
                      backgroundColor: "#e91e63",
                      "&:hover": { backgroundColor: "#c2185b" },
                      textTransform: "none",
                    }}
                  >
                    Interest
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Message />}
                    sx={{
                      borderColor: "#1976d2",
                      color: "#1976d2",
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#1565c0",
                        backgroundColor: "rgba(25, 118, 210, 0.04)",
                      },
                    }}
                  >
                    Chat
                  </Button>
                  <Tooltip title="Remove from shortlist">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnshortlistClick(profile);
                      }}
                      sx={{ color: "#f44336" }}
                    >
                      <Cancel />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const ProfileCard = () => {
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
                <span style={{ color: "#636e72", fontWeight: "400" }}>
                  ({shortlistedProfiles?.profiles?.length})
                </span>
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                Move ahead with your decision by sending an interest!
              </p>
            </div>
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
          {shortlistedProfiles?.profiles?.length > 0 ? (
            shortlistedProfiles?.profiles?.map((profile, index) => (
              <SwiperSlide key={profile.id || index}>
                <Card
                  className="border-0 shadow-sm overflow-hidden"
                  style={{ borderRadius: "12px" }}
                >
                  <div style={{ position: "relative", height: "450px" }}>
                    <img
                      src={
                        profile.profileImage ||
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=450&fit=crop"
                      }
                      alt={profile.name}
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
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        color: "white",
                      }}
                    >
                      <Badge
                        bg="dark"
                        className="px-3 py-2"
                        style={{ fontSize: "12px", fontWeight: "500" }}
                      >
                        Shortlisted
                        <br />
                        <span
                          style={{
                            fontSize: "11px",
                            lineHeight: "15px",
                            marginLeft: "6px",
                          }}
                        >
                          on{" "}
                          {new Date(
                            profile?.shortlistedAt
                          ).toLocaleDateString()}
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
                        className="d-flex align-items-center gap-1 px-2 py-2 text-light"
                      >
                        <CameraAlt
                          style={{ fontSize: "14px", color: "white" }}
                        />
                        <span>{profile.photos?.length || 0}</span>
                      </Badge>
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
                        {profile.lastSeen
                          ? `Last seen ${formatLastSeen(profile.lastSeen)}`
                          : ""}
                      </p>
                      <h3
                        className="mb-2"
                        style={{ fontWeight: "700", fontSize: "28px" }}
                      >
                        {profile.name}
                        {profile.age ? `, ${profile.age}` : ""}
                      </h3>
                      <p
                        className="mb-1"
                        style={{ fontSize: "13px", lineHeight: "1.6" }}
                      >
                        {profile.height} • {profile.location} • {profile.caste}
                      </p>
                      <p
                        className="mb-1"
                        style={{ fontSize: "13px", lineHeight: "1.6" }}
                      >
                        {profile.occupation} • {profile.education}
                      </p>
                      <p className="mb-2" style={{ fontSize: "13px" }}>
                        ID: {profile.customId}
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
                        <IconButton onClick={() => onShowInterest(profile.id)}>
                          <FavoriteBorder style={{ color: "white" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Super Interest">
                        <IconButton
                          onClick={() => onShowSuperInterest(profile.id)}
                        >
                          <Favorite style={{ color: "white" }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Remove from Shortlist">
                        <IconButton
                          onClick={() => handleUnshortlistClick(profile)}
                        >
                          <Star style={{ color: "gold" }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Chat">
                        <IconButton onClick={() => onChatClick(profile)}>
                          <Chat style={{ color: "white" }} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                </Card>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <Card sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  No shortlisted profiles yet
                </Typography>
              </Card>
            </SwiperSlide>
          )}
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
              {interest.name}
              {interest.age ? `, ${interest.age}` : ""}
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
            <Tabs
              value={activeProfileTab}
              onChange={(e, newValue) => setActiveProfileTab(newValue)}
              sx={{ minHeight: "auto" }}
            >
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
          {activeProfileTab === "about" && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Basic Information
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {interest.religion &&
                  interest.religion !== "N/A" &&
                  interest.caste &&
                  interest.caste !== "N/A" && (
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        {interest.religion} - {interest.caste}
                      </Typography>
                    </Grid>
                  )}
                {interest.height && interest.height !== "N/A" && (
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Height: {getHeight(interest.height)}
                    </Typography>
                  </Grid>
                )}
                {interest.annualIncome && interest.annualIncome !== "N/A" && (
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Annual Income: {interest.annualIncome}
                    </Typography>
                  </Grid>
                )}
                {interest.motherTongue && interest.motherTongue !== "N/A" && (
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Mother tongue: {interest.motherTongue}
                    </Typography>
                  </Grid>
                )}
                {interest.maritalStatus && interest.maritalStatus !== "N/A" && (
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Marital Status: {interest.maritalStatus}
                    </Typography>
                  </Grid>
                )}
                {interest.city && interest.city !== "N/A" && (
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Location: {interest.city}
                      {interest.state && interest.state !== "N/A"
                        ? `, ${interest.state}`
                        : ""}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              {interest.about ? (
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {interest.about}
                </Typography>
              ) : (
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {interest.name}
                  {interest.age ? `, ${interest.age}` : ""}
                  {interest.education && interest.education !== "N/A"
                    ? `, ${interest.education} graduate`
                    : ""}
                  {interest.occupation && interest.occupation !== "N/A"
                    ? ` working as ${interest.occupation}`
                    : ""}
                  {interest.city && interest.city !== "N/A"
                    ? ` in ${interest.city}`
                    : ""}
                </Typography>
              )}

              {interest.education && interest.education !== "N/A" && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Education
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
                    {interest.education}
                  </Typography>
                </>
              )}

              {interest.occupation && interest.occupation !== "N/A" && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Career
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
                    {interest.occupation}
                    {interest.city && interest.city !== "N/A"
                      ? ` in ${interest.city}`
                      : ""}
                  </Typography>
                </>
              )}
            </Box>
          )}

          {/* Family Content */}
          {activeProfileTab === "family" && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Family Background
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                {interest.familyType && interest.familyType !== "N/A" && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                      Family Type
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {interest.familyType.charAt(0).toUpperCase() +
                        interest.familyType.slice(1)}
                    </Typography>
                  </Grid>
                )}

                {interest.nativePlace && interest.nativePlace !== "N/A" && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                      Native Place
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {interest.nativePlace}
                    </Typography>
                  </Grid>
                )}

                {interest.familyIncome && interest.familyIncome !== "N/A" && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                      Family Income
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {interest.familyIncome}
                    </Typography>
                  </Grid>
                )}

                {interest.familyStatus && interest.familyStatus !== "N/A" && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                      Family Status
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {interest.familyStatus.charAt(0).toUpperCase() +
                        interest.familyStatus.slice(1).replace(/_/g, " ")}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Parents Information
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                {interest.fatherOccupation &&
                  interest.fatherOccupation !== "N/A" && (
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body2"
                        sx={{ color: "#666", mb: 0.5 }}
                      >
                        Father's Occupation
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {interest.fatherOccupation.charAt(0).toUpperCase() +
                          interest.fatherOccupation.slice(1).replace(/_/g, " ")}
                      </Typography>
                    </Grid>
                  )}

                {interest.motherOccupation &&
                  interest.motherOccupation !== "N/A" && (
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body2"
                        sx={{ color: "#666", mb: 0.5 }}
                      >
                        Mother's Occupation
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {interest.motherOccupation.charAt(0).toUpperCase() +
                          interest.motherOccupation.slice(1).replace(/_/g, " ")}
                      </Typography>
                    </Grid>
                  )}
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Siblings Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                    Brothers
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {interest.brothers || 0}
                    {interest.brothers > 0 &&
                      interest.brothersMarried !== undefined && (
                        <span
                          style={{
                            color: "#666",
                            fontSize: "0.875rem",
                            marginLeft: "8px",
                          }}
                        >
                          ({interest.brothersMarried ? "Married" : "Unmarried"})
                        </span>
                      )}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                    Sisters
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {interest.sisters || 0}
                    {interest.sisters > 0 &&
                      interest.sistersMarried !== undefined && (
                        <span
                          style={{
                            color: "#666",
                            fontSize: "0.875rem",
                            marginLeft: "8px",
                          }}
                        >
                          ({interest.sistersMarried ? "Married" : "Unmarried"})
                        </span>
                      )}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Looking For Content */}
          {activeProfileTab === "looking" && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Partner Preferences
              </Typography>

              {interest.preferences &&
              Object.keys(interest.preferences).length > 0 ? (
                <>
                  {/* Age Range */}
                  {interest.preferences.ageRange && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                        Age Range
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {interest.preferences.ageRange.min || "N/A"} -{" "}
                        {interest.preferences.ageRange.max || "N/A"} years
                      </Typography>
                    </Box>
                  )}

                  {/* Height Range */}
                  {interest.preferences.heightRange && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                        Height Preference
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {interest.preferences.heightRange.min || "N/A"} -{" "}
                        {interest.preferences.heightRange.max || "N/A"}
                      </Typography>
                    </Box>
                  )}

                  {/* Education Preference */}
                  {interest.preferences.educationPref && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                        Education Preference
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {interest.preferences.educationPref
                          .charAt(0)
                          .toUpperCase() +
                          interest.preferences.educationPref
                            .slice(1)
                            .replace(/_/g, " ")}
                      </Typography>
                    </Box>
                  )}

                  {/* Occupation Preference */}
                  {interest.preferences.occupationPref &&
                    Array.isArray(interest.preferences.occupationPref) &&
                    interest.preferences.occupationPref.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#666", mb: 1 }}
                        >
                          Occupation Preference
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {interest.preferences.occupationPref
                            .map(
                              (occ) =>
                                occ.charAt(0).toUpperCase() +
                                occ.slice(1).replace(/_/g, " ")
                            )
                            .join(", ")}
                        </Typography>
                      </Box>
                    )}

                  {/* Annual Income Preference */}
                  {interest.preferences.annualIncomePref && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                        Annual Income Preference
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {interest.preferences.annualIncomePref
                          .charAt(0)
                          .toUpperCase() +
                          interest.preferences.annualIncomePref
                            .slice(1)
                            .replace(/_/g, " ")}
                      </Typography>
                    </Box>
                  )}

                  {/* Location Preference */}
                  {interest.preferences.locationPref && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                        Location Preference
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {interest.preferences.locationPref}
                      </Typography>
                    </Box>
                  )}

                  {/* Marital Status Preference */}
                  {interest.preferences.maritalStatusPref && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                        Marital Status Preference
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {interest.preferences.maritalStatusPref
                          .charAt(0)
                          .toUpperCase() +
                          interest.preferences.maritalStatusPref
                            .slice(1)
                            .replace(/_/g, " ")}
                      </Typography>
                    </Box>
                  )}

                  {/* Religion/Caste Preference */}
                  {interest.preferences.religionCastePref && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                        Religion/Caste Preference
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {interest.preferences.religionCastePref
                          .charAt(0)
                          .toUpperCase() +
                          interest.preferences.religionCastePref
                            .slice(1)
                            .replace(/_/g, " ")}
                      </Typography>
                    </Box>
                  )}

                  {/* Relocation */}
                  {interest.preferences.relocation && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                        Open to Relocation
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {interest.preferences.relocation
                          .charAt(0)
                          .toUpperCase() +
                          interest.preferences.relocation.slice(1)}
                      </Typography>
                    </Box>
                  )}

                  {/* Family Orientation */}
                  {interest.preferences.familyOrientation && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                        Family Orientation
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {interest.preferences.familyOrientation
                          .charAt(0)
                          .toUpperCase() +
                          interest.preferences.familyOrientation
                            .slice(1)
                            .replace(/_/g, " ")}
                      </Typography>
                    </Box>
                  )}

                  {/* Lifestyle Expectations */}
                  {interest.preferences.lifestyleExpectations && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                        Lifestyle Expectations
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        {interest.preferences.lifestyleExpectations.diet && (
                          <Typography variant="body2">
                            <strong>Diet:</strong>{" "}
                            {interest.preferences.lifestyleExpectations.diet
                              .charAt(0)
                              .toUpperCase() +
                              interest.preferences.lifestyleExpectations.diet
                                .slice(1)
                                .replace(/_/g, " ")}
                          </Typography>
                        )}
                        {interest.preferences.lifestyleExpectations
                          .drinking && (
                          <Typography variant="body2">
                            <strong>Drinking:</strong>{" "}
                            {interest.preferences.lifestyleExpectations.drinking
                              .charAt(0)
                              .toUpperCase() +
                              interest.preferences.lifestyleExpectations.drinking
                                .slice(1)
                                .replace(/_/g, " ")}
                          </Typography>
                        )}
                        {interest.preferences.lifestyleExpectations.smoking && (
                          <Typography variant="body2">
                            <strong>Smoking:</strong>{" "}
                            {interest.preferences.lifestyleExpectations.smoking
                              .charAt(0)
                              .toUpperCase() +
                              interest.preferences.lifestyleExpectations.smoking
                                .slice(1)
                                .replace(/_/g, " ")}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Qualities */}
                  {interest.preferences.qualities &&
                    Array.isArray(interest.preferences.qualities) &&
                    interest.preferences.qualities.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#666", mb: 1 }}
                        >
                          Desired Qualities
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {interest.preferences.qualities.map(
                            (quality, index) => (
                              <Chip
                                key={index}
                                label={quality}
                                size="small"
                                sx={{
                                  backgroundColor: "#e3f2fd",
                                  color: "#1976d2",
                                }}
                              />
                            )
                          )}
                        </Box>
                      </Box>
                    )}

                  {/* Deal Breakers */}
                  {interest.preferences.dealBreakers &&
                    Array.isArray(interest.preferences.dealBreakers) &&
                    interest.preferences.dealBreakers.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#666", mb: 1 }}
                        >
                          Deal Breakers
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {interest.preferences.dealBreakers.map(
                            (breaker, index) => (
                              <Chip
                                key={index}
                                label={breaker}
                                size="small"
                                color="error"
                              />
                            )
                          )}
                        </Box>
                      </Box>
                    )}
                </>
              ) : (
                <Typography
                  variant="body1"
                  sx={{ color: "#666", textAlign: "center", py: 4 }}
                >
                  No preferences set yet
                </Typography>
              )}
            </Box>
          )}

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
              label={`Received (${receivedInterests.length})`}
              value="received"
              sx={{ textTransform: "none", fontWeight: 600 }}
            />
            <Tab
              label={`Sent (${sentInterests.length})`}
              value="sent"
              sx={{ textTransform: "none", fontWeight: 600 }}
            />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {activeTab === "received" && (
            <Box className="d-flex flex-column gap-3">
              {receivedInterests.length > 0 ? (
                receivedInterests.map((interest) =>
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
              {sentInterests.length > 0 ? (
                sentInterests.map((interest) =>
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

      {/* Unshortlist Confirmation Dialog */}
      <Dialog
        open={unshortlistDialogOpen}
        onClose={handleCancelUnshortlist}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Remove from Shortlist
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove {profileToUnshortlist?.name} from
            your shortlist?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCancelUnshortlist}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmUnshortlist}
            variant="contained"
            color="error"
            sx={{ textTransform: "none" }}
          >
            Remove from Shortlist
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActivityPage;
