import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  IconButton,
  Tabs,
  Tab,
  Avatar,
  TextField,
  InputAdornment,
  Divider,
  Badge,
} from "@mui/material";
import {
  Search,
  Filter,
  ChevronRight,
  Phone,
  BookOpen,
  Users,
  MessageCircle,
  Crown,
  Send,
  MoreVertical,
  ArrowLeft,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
} from "lucide-react";

const ChatPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [viewMode, setViewMode] = useState("service");
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");

  const [selectedMessage] = useState({
    id: 1,
    service: "Assisted service",
    subtitle: "Guaranteed weekly matches",
    date: "20 Oct 2025",
    title: "Find your match 3x faster! With Assisted Service:",
    benefits: [
      {
        icon: <BookOpen size={20} />,
        title: "Get guaranteed relevant matches on weekly basis",
        description: "",
      },
      {
        icon: <Users size={20} />,
        title: "Save time & effort",
        description:
          "- Relationship Manager will search, shortlist and share matches with you and arrange meetings.",
      },
      {
        icon: <MessageCircle size={20} />,
        title: "Get more responses",
        description:
          "- Your profile will be made available in Matrimony.com group of sites and even free members can message you.",
      },
      {
        icon: <Phone size={20} />,
        title: "Get faster responses",
        description:
          "- Relationship Manager reaches out to prospects via Call/Message/ Whatsapp to get faster response.",
      },
      {
        icon: <Crown size={20} />,
        title: "Get complimentary Prime Gold membership",
        description:
          "- in TamilMatrimony and AhomMatrimony or any other community matrimony site of your choice.",
      },
    ],
  });

  const chatList = [
    {
      id: 1,
      name: "Priya Sharma",
      lastMessage: "Hi! Thanks for showing interest in my profile.",
      time: "2:30 PM",
      unread: 2,
      avatar: "PS",
      online: true,
      color: "#9c27b0",
    },
    {
      id: 2,
      name: "Rahul Mehta",
      lastMessage: "Would love to know more about you.",
      time: "Yesterday",
      unread: 0,
      avatar: "RM",
      online: false,
      color: "#2196f3",
    },
    {
      id: 3,
      name: "Anjali Verma",
      lastMessage: "Let's connect over a call sometime.",
      time: "2 days ago",
      unread: 1,
      avatar: "AV",
      online: true,
      color: "#4caf50",
    },
    {
      id: 4,
      name: "Vikram Singh",
      lastMessage: "Thank you for your response!",
      time: "3 days ago",
      unread: 0,
      avatar: "VS",
      online: false,
      color: "#ff9800",
    },
  ];

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "other",
      text: "Hi! Thanks for showing interest in my profile.",
      time: "2:28 PM",
    },
    {
      id: 2,
      sender: "other",
      text: "I'd love to know more about you and your family.",
      time: "2:28 PM",
    },
    {
      id: 3,
      sender: "me",
      text: "Hello! Thank you for reaching out. I'm glad we connected.",
      time: "2:30 PM",
    },
    {
      id: 4,
      sender: "me",
      text: "I'd be happy to share more details. When would be a good time to talk?",
      time: "2:30 PM",
    },
  ]);

  const userProfile = {
    name: "Priya Sharma",
    age: 28,
    height: "5'4\"",
    location: "Mumbai, Maharashtra",
    education: "MBA in Finance",
    occupation: "Senior Financial Analyst at HDFC Bank",
    salary: "₹12-15 Lakhs",
    religion: "Hindu",
    caste: "Brahmin",
    maritalStatus: "Never Married",
    about:
      "I'm a career-oriented individual who values family and traditions. Looking for a life partner who shares similar values and aspirations. I enjoy reading, traveling, and spending quality time with loved ones.",
    images: ["PS"],
  };

  const messages = [
    {
      id: 1,
      service: "Assisted service",
      subtitle: "Find your match 3x faster! Talk to our Matrimony Expert.",
      avatar: "🚀",
      color: "#FF6B35",
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          id: chatMessages.length + 1,
          sender: "me",
          text: message,
          time: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
        },
      ]);
      setMessage("");
    }
  };

  const renderChatView = () => (
    <>
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
          <IconButton onClick={() => setViewMode("service")} size="small">
            <ArrowLeft size={20} />
          </IconButton>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: selectedChat?.online ? "#44b700" : "#gray",
                width: 12,
                height: 12,
                borderRadius: "50%",
                border: "2px solid white",
              },
            }}
          >
            <Avatar
              sx={{ bgcolor: selectedChat?.color, cursor: "pointer" }}
              onClick={() => setViewMode("profile")}
            >
              {selectedChat?.avatar}
            </Avatar>
          </Badge>
          <Box
            sx={{ cursor: "pointer" }}
            onClick={() => setViewMode("profile")}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              {selectedChat?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {selectedChat?.online ? "Online" : "Offline"}
            </Typography>
          </Box>
        </Box>
        <Box>
          <IconButton>
            <Phone size={20} />
          </IconButton>
          <IconButton>
            <MoreVertical size={20} />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflow: "auto", p: 3, bgcolor: "#f5f7fa" }}>
        {chatMessages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              justifyContent: msg.sender === "me" ? "flex-end" : "flex-start",
              mb: 2,
            }}
          >
            <Box
              sx={{
                maxWidth: "60%",
                bgcolor: msg.sender === "me" ? "#FF6B35" : "white",
                color: msg.sender === "me" ? "white" : "black",
                p: 2,
                borderRadius: 2,
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              <Typography variant="body2">{msg.text}</Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 0.5,
                  opacity: 0.7,
                  textAlign: "right",
                }}
              >
                {msg.time}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          p: 2,
          bgcolor: "white",
          borderTop: "1px solid #e0e0e0",
          display: "flex",
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          size="small"
          sx={{ bgcolor: "#f5f7fa" }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          sx={{
            bgcolor: "#FF6B35",
            "&:hover": { bgcolor: "#e55a2b" },
            minWidth: "auto",
            px: 3,
          }}
        >
          <Send size={20} />
        </Button>
      </Box>
    </>
  );

  const renderProfileView = () => (
    <>
      <Box
        sx={{
          p: 2,
          bgcolor: "white",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <IconButton onClick={() => setViewMode("chat")} size="small">
          <ArrowLeft size={20} />
        </IconButton>
        <Typography variant="h6" fontWeight={600}>
          Profile Details
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: "auto", bgcolor: "#f5f7fa" }}>
        <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
          <Card sx={{ mb: 3, overflow: "hidden" }}>
            <Box
              sx={{
                height: 120,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                position: "relative",
              }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  position: "absolute",
                  bottom: -60,
                  left: "50%",
                  transform: "translateX(-50%)",
                  border: "4px solid white",
                  bgcolor: selectedChat?.color,
                  fontSize: "48px",
                }}
              >
                {userProfile.images[0]}
              </Avatar>
            </Box>

            <Box sx={{ pt: 8, pb: 3, px: 3, textAlign: "center" }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {userProfile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {userProfile.age} years, {userProfile.height}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<MessageCircle size={18} />}
                  onClick={() => setViewMode("chat")}
                  sx={{
                    bgcolor: "#FF6B35",
                    "&:hover": { bgcolor: "#e55a2b" },
                    textTransform: "none",
                  }}
                >
                  Send Message
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Heart size={18} />}
                  sx={{
                    borderColor: "#FF6B35",
                    color: "#FF6B35",
                    textTransform: "none",
                    "&:hover": { borderColor: "#e55a2b", bgcolor: "#fff5f2" },
                  }}
                >
                  Shortlist
                </Button>
              </Box>
            </Box>
          </Card>

          <Card sx={{ mb: 3, p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Basic Details
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "grid", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <MapPin size={20} color="#666" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {userProfile.location}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Briefcase size={20} color="#666" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Occupation
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {userProfile.occupation}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <GraduationCap size={20} color="#666" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Education
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {userProfile.education}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Card>

          <Card sx={{ mb: 3, p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Additional Information
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Annual Income
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {userProfile.salary}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Marital Status
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {userProfile.maritalStatus}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Religion
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {userProfile.religion}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Caste
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {userProfile.caste}
                </Typography>
              </Box>
            </Box>
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              About Me
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
              {userProfile.about}
            </Typography>
          </Card>
        </Box>
      </Box>
    </>
  );

  return (
    <Box sx={{ height: "calc(100vh - 64px)" }}>
      {/* <Chat /> */}

      <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f5f7fa" }}>
        <Box
          sx={{
            width: 380,
            bgcolor: "white",
            borderRight: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
            {searchOpen && (
              <TextField
                fullWidth
                placeholder="Search in Mailbox"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} color="#666" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2, bgcolor: "#f8f9fa" },
                }}
              />
            )}
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                "& .MuiTab-root": { textTransform: "none", fontWeight: 500 },
              }}
            >
              <Tab label="Received" />
              <Tab label="Awaiting Response" />
              <Tab label="Calls" />
            </Tabs>
          </Box>

          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "#fafafa",
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              {activeTab === 0 ? "Incoming messages" : "Your conversations"}
            </Typography>
            <Button
              size="small"
              startIcon={<Filter size={16} />}
              sx={{ textTransform: "none", color: "#666" }}
              onClick={() => setSearchOpen(!searchOpen)}
            >
              Filter
            </Button>
          </Box>

          <Box sx={{ flex: 1, overflow: "auto" }}>
            {activeTab === 0 &&
              messages.map((msg) => (
                <Card
                  key={msg.id}
                  onClick={() => setViewMode("service")}
                  sx={{
                    m: 2,
                    p: 2,
                    cursor: "pointer",
                    bgcolor: viewMode === "service" ? "#f0f4ff" : "white",
                    border:
                      viewMode === "service"
                        ? "1px solid #d0e0ff"
                        : "1px solid #e0e0e0",
                    "&:hover": { bgcolor: "#e8f0ff" },
                    transition: "all 0.2s",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: msg.color, width: 48, height: 48 }}>
                      <span style={{ fontSize: "24px" }}>{msg.avatar}</span>
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {msg.service}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {msg.subtitle}
                      </Typography>
                    </Box>
                    <ChevronRight size={20} color="#999" />
                  </Box>
                </Card>
              ))}

            {chatList.map((chat) => (
              <Card
                key={chat.id}
                onClick={() => {
                  setSelectedChat(chat);
                  setViewMode("chat");
                }}
                sx={{
                  m: 2,
                  p: 2,
                  cursor: "pointer",
                  bgcolor: selectedChat?.id === chat.id ? "#f0f4ff" : "white",
                  border:
                    selectedChat?.id === chat.id
                      ? "1px solid #d0e0ff"
                      : "1px solid #e0e0e0",
                  "&:hover": { bgcolor: "#f8f9fa" },
                  transition: "all 0.2s",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: chat.online ? "#44b700" : "#gray",
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        border: "2px solid white",
                      },
                    }}
                  >
                    <Avatar sx={{ bgcolor: chat.color, width: 48, height: 48 }}>
                      {chat.avatar}
                    </Avatar>
                  </Badge>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        noWrap
                        sx={{ flex: 1 }}
                      >
                        {chat.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {chat.time}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 0.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{ flex: 1 }}
                      >
                        {chat.lastMessage}
                      </Typography>
                      {chat.unread > 0 && (
                        <Box
                          sx={{
                            bgcolor: "#FF6B35",
                            color: "white",
                            borderRadius: "50%",
                            width: 20,
                            height: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: 600,
                            ml: 1,
                          }}
                        >
                          {chat.unread}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          {viewMode === "chat" && renderChatView()}
          {viewMode === "profile" && renderProfileView()}
          {viewMode === "service" && (
            <>
              <Box
                sx={{
                  p: 3,
                  bgcolor: "white",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "#FF6B35", width: 40, height: 40 }}>
                    <span style={{ fontSize: "20px" }}>🚀</span>
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {selectedMessage.service}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedMessage.subtitle}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ flex: 1, p: 4, bgcolor: "#fafbfc" }}>
                <Box sx={{ maxWidth: 800, mx: "auto" }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", textAlign: "center", mb: 3 }}
                  >
                    {selectedMessage.date}
                  </Typography>

                  <Card
                    sx={{ p: 4, borderRadius: 2, border: "2px dashed #d0d0d0" }}
                  >
                    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                      <Avatar
                        sx={{ bgcolor: "#FF6B35", width: 48, height: 48 }}
                      >
                        <span style={{ fontSize: "24px" }}>🚀</span>
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {selectedMessage.title}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 3,
                        mt: 3,
                      }}
                    >
                      <Box>
                        {selectedMessage.benefits
                          .slice(0, 3)
                          .map((benefit, index) => (
                            <Box
                              key={index}
                              sx={{ display: "flex", gap: 2, mb: 3 }}
                            >
                              <Box sx={{ color: "#FF6B35", mt: 0.5 }}>
                                {benefit.icon}
                              </Box>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {benefit.title.split(" - ")[0]}
                                </Typography>
                                {benefit.description && (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 0.5 }}
                                  >
                                    {benefit.description}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          ))}
                      </Box>

                      <Box>
                        {selectedMessage.benefits
                          .slice(3)
                          .map((benefit, index) => (
                            <Box
                              key={index}
                              sx={{ display: "flex", gap: 2, mb: 3 }}
                            >
                              <Box sx={{ color: "#FF6B35", mt: 0.5 }}>
                                {benefit.icon}
                              </Box>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {benefit.title}
                                </Typography>
                                {benefit.description && (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 0.5 }}
                                  >
                                    {benefit.description}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          ))}
                      </Box>
                    </Box>

                    <Box sx={{ mt: 3, textAlign: "right" }}>
                      <Button
                        variant="text"
                        endIcon={<ChevronRight size={16} />}
                        sx={{
                          color: "#FF6B35",
                          textTransform: "none",
                          fontWeight: 600,
                          "&:hover": { bgcolor: "#fff5f2" },
                        }}
                      >
                        Know more
                      </Button>
                    </Box>
                  </Card>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage;
