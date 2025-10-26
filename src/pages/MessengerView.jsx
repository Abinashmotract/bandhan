import React, { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Avatar,
  CircularProgress,
  Chip,
  Badge,
} from "@mui/material";
import {
  KeyboardArrowRight,
  Person,
  CalendarToday,
  AccessTime,
  Phone,
  Favorite,
  CheckCircle,
  Message,
} from "@mui/icons-material";

// Main Messenger Component
export const MessengerView = ({
  matchHourData,
  onlineMatches = [],
  conversations = [],
  loading = false,
  onRegisterClick = () => {},
  onViewAllOnline = () => {},
  onConversationClick = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("interests");
  const [showMessagesOnly, setShowMessagesOnly] = useState(false);

  // Fake data for different tabs
  const fakeAcceptances = [
    {
      id: 1,
      name: "Priya Sharma",
      age: 28,
      height: "5'4\"",
      caste: "Brahmin",
      location: "Mumbai",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&w=150",
      date: "2 days ago",
      hasMessages: true,
      lastMessage: "Hi! I accepted your interest. Would you like to chat?",
      isOnline: true,
      mutualInterests: 3,
    },
    {
      id: 2,
      name: "Anjali Patel",
      age: 26,
      height: "5'3\"",
      caste: "Patel",
      location: "Ahmedabad",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=150",
      date: "1 week ago",
      hasMessages: false,
      isOnline: false,
      mutualInterests: 1,
    },
    {
      id: 3,
      name: "Neha Gupta",
      age: 29,
      height: "5'5\"",
      caste: "Agarwal",
      location: "Delhi",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&w=150",
      date: "3 days ago",
      hasMessages: true,
      lastMessage:
        "Thank you for your interest! I'd love to know more about you.",
      isOnline: true,
      mutualInterests: 2,
    },
  ];

  const fakeInterests = [
    {
      id: 1,
      name: "Riya Verma",
      age: 27,
      height: "5'2\"",
      caste: "Rajput",
      location: "Jaipur",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&w=150",
      date: "Today",
      hasMessages: true,
      lastMessage: "I saw your profile and would love to connect!",
      interestType: "super",
      isOnline: true,
    },
    {
      id: 2,
      name: "Sneha Reddy",
      age: 25,
      height: "5'6\"",
      caste: "Reddy",
      location: "Hyderabad",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&w=150",
      date: "Yesterday",
      hasMessages: false,
      interestType: "regular",
      isOnline: false,
    },
    {
      id: 3,
      name: "Pooja Singh",
      age: 30,
      height: "5'4\"",
      caste: "Sikh",
      location: "Chandigarh",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&w=150",
      date: "2 days ago",
      hasMessages: true,
      lastMessage: "Your profile looks interesting. Let's talk!",
      interestType: "regular",
      isOnline: true,
    },
    {
      id: 4,
      name: "Divya Nair",
      age: 26,
      height: "5'3\"",
      caste: "Nair",
      location: "Kochi",
      avatar:
        "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-4.0.3&w=150",
      date: "1 week ago",
      hasMessages: false,
      interestType: "super",
      isOnline: false,
    },
  ];

  const fakeCalls = [
    {
      id: 1,
      name: "Kavya Iyer",
      age: 28,
      height: "5'4\"",
      caste: "Iyer",
      location: "Chennai",
      avatar:
        "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&w=150",
      callType: "video",
      callDate: "Today, 3:45 PM",
      duration: "15:32",
      status: "completed",
      isOnline: true,
    },
    {
      id: 2,
      name: "Meera Joshi",
      age: 29,
      height: "5'5\"",
      caste: "Brahmin",
      location: "Pune",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&w=150",
      callType: "voice",
      callDate: "Yesterday, 7:20 PM",
      duration: "08:15",
      status: "completed",
      isOnline: false,
    },
    {
      id: 3,
      name: "Ananya Das",
      age: 27,
      height: "5'3\"",
      caste: "Bengali",
      location: "Kolkata",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&w=150",
      callType: "video",
      callDate: "Missed",
      duration: "--:--",
      status: "missed",
      isOnline: true,
    },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleToggleMessagesOnly = () => {
    setShowMessagesOnly(!showMessagesOnly);
  };

  const getFilteredInterests = () => {
    let interests = [...fakeInterests];
    if (showMessagesOnly) {
      interests = interests.filter((interest) => interest.hasMessages);
    }
    return interests;
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case "acceptances":
        return fakeAcceptances;
      case "interests":
        return getFilteredInterests();
      case "calls":
        return fakeCalls;
      default:
        return [];
    }
  };

  const renderInterestBadge = (interestType) => {
    if (interestType === "super") {
      return (
        <Chip
          icon={<Favorite sx={{ fontSize: 16 }} />}
          label="Super Interest"
          size="small"
          sx={{
            bgcolor: "#ff4081",
            color: "white",
            fontWeight: 600,
            fontSize: "0.7rem",
            height: 20,
            "& .MuiChip-icon": { color: "white", fontSize: 14 },
          }}
        />
      );
    }
    return null;
  };

  const renderCallStatus = (call) => {
    const getStatusColor = () => {
      switch (call.status) {
        case "completed":
          return "#4caf50";
        case "missed":
          return "#f44336";
        case "scheduled":
          return "#ff9800";
        default:
          return "#757575";
      }
    };

    const getCallIcon = () => {
      return call.callType === "video" ? "📹" : "📞";
    };

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography sx={{ fontSize: "1rem" }}>{getCallIcon()}</Typography>
        <Typography
          variant="caption"
          sx={{
            color: getStatusColor(),
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        >
          {call.status === "completed" ? `${call.duration}` : call.callDate}
        </Typography>
      </Box>
    );
  };

  const renderConversationItem = (item, index) => {
    if (activeTab === "calls") {
      return (
        <Box
          key={item.id}
          onClick={() => onConversationClick && onConversationClick(item)}
          sx={{
            display: "flex",
            alignItems: "center",
            borderRadius: 2,
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: "grey.100",
            },
          }}
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              item.isOnline ? (
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    bgcolor: "#4caf50",
                    borderRadius: "50%",
                    border: "2px solid white",
                  }}
                />
              ) : null
            }
          >
            <Avatar
              src={item.avatar}
              sx={{
                width: 56,
                height: 56,
                mr: 2,
                border: "2px solid",
                borderColor: "grey.200",
              }}
            >
              {item.name?.charAt(0) || "?"}
            </Avatar>
          </Badge>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "grey.900", mb: 0.5 }}
            >
              {item.name}, {item.age}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
              {item.height} • {item.caste} • {item.location}
            </Typography>
            {renderCallStatus(item)}
          </Box>
        </Box>
      );
    }

    return (
      <Box
        key={item.id}
        onClick={() => onConversationClick && onConversationClick(item)}
        sx={{
          display: "flex",
          alignItems: "center",
          borderRadius: 2,
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": {
            bgcolor: "grey.100",
          },
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            item.isOnline ? (
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  bgcolor: "#4caf50",
                  borderRadius: "50%",
                  border: "2px solid white",
                }}
              />
            ) : null
          }
        >
          <Avatar
            src={item.avatar}
            sx={{
              width: 56,
              height: 56,
              mr: 2,
              border: "2px solid",
              borderColor: "grey.200",
            }}
          >
            {item.name?.charAt(0) || "?"}
          </Avatar>
        </Badge>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "grey.900" }}
            >
              {item.name}, {item.age}
            </Typography>
            {activeTab === "interests" &&
              renderInterestBadge(item.interestType)}
            {activeTab === "acceptances" && item.mutualInterests > 0 && (
              <Chip
                label={`${item.mutualInterests} mutual interests`}
                size="small"
                sx={{
                  bgcolor: "#e3f2fd",
                  color: "#1976d2",
                  fontWeight: 500,
                  fontSize: "0.7rem",
                  height: 20,
                }}
              />
            )}
          </Box>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
            {item.height} • {item.caste} • {item.location}
          </Typography>
          {item.hasMessages && item.lastMessage && (
            <Typography
              variant="body2"
              sx={{
                color: "text.primary",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Message sx={{ fontSize: 16, color: "#51365F" }} />
              {item.lastMessage}
            </Typography>
          )}
        </Box>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", alignSelf: "flex-start" }}
        >
          {item.date}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      {/* Match Hour Card */}
      {matchHourData && (
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "grey.200",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                {matchHourData.avatars?.slice(0, 3).map((avatar, idx) => (
                  <Avatar
                    key={idx}
                    sx={{
                      width: 36,
                      height: 36,
                      border: "2px solid white",
                      ml: idx > 0 ? -1.5 : 0,
                      bgcolor: avatar.color || "#51365F",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    {avatar.letter}
                  </Avatar>
                ))}
              </Box>
              <Chip
                label={`${matchHourData.registered}+ registered`}
                size="small"
                sx={{
                  bgcolor: "grey.100",
                  color: "text.secondary",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                }}
              />
            </Box>

            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2, color: "grey.900" }}
            >
              {matchHourData.title}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#51365F",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CalendarToday sx={{ fontSize: 16, color: "white" }} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", fontWeight: 500 }}
                >
                  {matchHourData.date}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#51365F",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AccessTime sx={{ fontSize: 16, color: "white" }} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", fontWeight: 500 }}
                >
                  {matchHourData.time}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              onClick={onRegisterClick}
              sx={{
                bgcolor: "#51365F",
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                "&:hover": {
                  bgcolor: "#3d2849",
                },
              }}
            >
              Register Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Online Matches */}
      {onlineMatches && onlineMatches.length > 0 && (
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "grey.200",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
                cursor: "pointer",
              }}
              onClick={onViewAllOnline}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "grey.900" }}
              >
                Online Matches ({onlineMatches.length})
              </Typography>
              <KeyboardArrowRight sx={{ color: "text.secondary" }} />
            </Box>

            <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
              Chat with users who are currently online to get faster responses
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                overflowX: "auto",
                pb: 1,
                "&::-webkit-scrollbar": {
                  height: 6,
                },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: "grey.300",
                  borderRadius: 3,
                },
              }}
            >
              {onlineMatches.slice(0, 6).map((match, index) => (
                <Box
                  key={index}
                  sx={{
                    textAlign: "center",
                    minWidth: 70,
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          bgcolor: "#4caf50",
                          borderRadius: "50%",
                          border: "2px solid white",
                        }}
                      />
                    }
                  >
                    <Avatar
                      src={match.avatar || match.profileImage}
                      sx={{
                        width: 56,
                        height: 56,
                        mb: 1,
                        border: "2px solid",
                        borderColor: "grey.200",
                      }}
                    >
                      {match.name?.charAt(0) || "?"}
                    </Avatar>
                  </Badge>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      fontSize: "0.75rem",
                      color: "grey.900",
                      fontWeight: 500,
                    }}
                  >
                    {match.name?.split(" ")[0] || "User"}
                  </Typography>
                </Box>
              ))}

              {onlineMatches.length > 6 && (
                <Box
                  sx={{
                    textAlign: "center",
                    minWidth: 70,
                    cursor: "pointer",
                  }}
                  onClick={onViewAllOnline}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: "#51365F",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1,
                      mx: "auto",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <Typography
                      sx={{ color: "white", fontSize: "1rem", fontWeight: 600 }}
                    >
                      +{onlineMatches.length - 6}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      fontSize: "0.75rem",
                      color: "grey.900",
                      fontWeight: 500,
                    }}
                  >
                    View All
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* My Conversations */}
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "grey.200",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "grey.900", mb: 3 }}
          >
            My Conversations
          </Typography>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "grey.200", mb: 3 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              {["Acceptances", "Interests", "Calls"].map((tab) => (
                <Button
                  key={tab}
                  onClick={() => handleTabChange(tab.toLowerCase())}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    color:
                      activeTab === tab.toLowerCase()
                        ? "#51365F"
                        : "text.secondary",
                    borderBottom:
                      activeTab === tab.toLowerCase()
                        ? "3px solid #51365F"
                        : "none",
                    borderRadius: 0,
                    px: 3,
                    py: 1.5,
                    minWidth: "auto",
                    "&:hover": {
                      bgcolor: "rgba(81, 54, 95, 0.05)",
                    },
                  }}
                >
                  {tab}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Filter Toggle for Interests Tab */}
          {activeTab === "interests" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
                py: 2,
                px: 2,
                bgcolor: "grey.50",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontWeight: 500 }}
              >
                Only interests with messages
              </Typography>
              <Box
                onClick={handleToggleMessagesOnly}
                sx={{
                  width: 48,
                  height: 26,
                  bgcolor: showMessagesOnly ? "#51365F" : "grey.300",
                  borderRadius: 13,
                  position: "relative",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    bgcolor: "white",
                    borderRadius: "50%",
                    position: "absolute",
                    top: 2,
                    left: showMessagesOnly ? 24 : 2,
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                />
              </Box>
            </Box>
          )}

          {/* Tab Content */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress sx={{ color: "#51365F" }} />
              </Box>
            ) : getCurrentData().length > 0 ? (
              getCurrentData().map((item, index) =>
                renderConversationItem(item, index)
              )
            ) : (
              <EmptyStateView
                icon={<Person sx={{ fontSize: 48, color: "#51365F" }} />}
                message={
                  activeTab === "acceptances"
                    ? "You can initiate a conversation with your acceptances here through our chatting & calling services!"
                    : activeTab === "calls"
                    ? "Get to know your interests in the quickest way by calling them on Jeevansathi!"
                    : "No interests found with messages. Try adjusting your filters."
                }
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

// Empty State Component
const EmptyStateView = ({ icon, message }) => (
  <Box sx={{ textAlign: "center", py: 6 }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Box
        sx={{
          width: 100,
          height: 100,
          bgcolor: "grey.100",
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
    </Box>
    <Typography
      variant="body1"
      sx={{
        color: "text.secondary",
        maxWidth: 400,
        mx: "auto",
        lineHeight: 1.8,
      }}
    >
      {message}
    </Typography>
  </Box>
);

export default MessengerView;
