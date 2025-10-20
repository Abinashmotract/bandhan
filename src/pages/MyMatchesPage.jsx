import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { showSuccess, showError } from "../utils/toast";
import { authAPI } from "../services/apiService";
import { setUser } from "../store/slices/authSlice";
import {
  fetchMatches,
  showInterest,
  showSuperInterest,
  getInterestLimits,
  setFilters,
  setSearchTerm,
  setSortBy,
  setSearchCriteria,
  clearFilters,
  clearSearchResults,
  clearSearchCriteria,
  applyFilters,
  searchProfilesByCriteria,
  saveSearchPreferences,
  getSearchPreferences,
} from "../store/slices/matchesSlice";
import {
  activityAPI,
  conversationAPI,
  searchAPI,
} from "../services/apiService";

// Import components
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import MatchesList from "../components/MatchesList";
import SearchForm from "../components/SearchForm";
import SearchResults from "../components/SearchResults";
import ProfileDetails from "../components/ProfileDetails";
import ProfileEdit from "../components/ProfileEdit";
import ActivityPage from "../components/ActivityPage";
import {
  CheckCircle,
  Close,
  FavoriteBorder,
  Person,
  Star,
  TrendingUp,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Message,
  HeightOutlined,
} from "@mui/icons-material";

const MyMatchesPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    matches,
    filteredMatches,
    searchResults,
    searchPreferences,
    loading,
    error,
    interestLimits,
    filters,
    searchCriteria,
    searchTerm,
    sortBy,
  } = useSelector((state) => state.matches);

  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editingProfile, setEditingProfile] = useState({});

  // Dynamic middle section view states
  const [middleSectionView, setMiddleSectionView] = useState("matches"); // 'matches', 'profile-edit', 'profile-details', 'activity', 'search', 'messenger'
  const [searchActiveTab, setSearchActiveTab] = useState("criteria");
  const [profileId, setProfileId] = useState("");
  const [activeMessengerTab, setActiveMessengerTab] = useState("acceptances");
  const [showMessagesOnly, setShowMessagesOnly] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [showSearchPreferences, setShowSearchPreferences] = useState(false);

  // Dynamic data states
  const [activityData, setActivityData] = useState(null);
  const [onlineMatches, setOnlineMatches] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [upMatchHour, setUpMatchHour] = useState(null);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Infinite scroll states
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMatches, setHasMoreMatches] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [displayedMatches, setDisplayedMatches] = useState([]);

  // Generate unique user ID like Jeevansathi (e.g., TYXX0117)
  const generateUserId = (user) => {
    if (user?.customId) return user.customId;

    // Generate a Jeevansathi-style ID
    const prefix = "TYXX";
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    return `${prefix}${randomNum}`;
  };

  // Utility functions
  const getAge = (dob) => {
    if (!dob) return null;
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

  const getHeight = (height) => {
    if (!height) return null;
    console.log(height);
    return height;
  };

  useEffect(() => {
    loadMatches();
    loadInterestLimits();
    loadUserProfile();
    loadSearchCriteria();
  }, []);

  // Load data when switching views
  useEffect(() => {
    if (middleSectionView === "activity") {
      loadActivityData();
      loadOnlineMatches();
    } else if (middleSectionView === "messenger") {
      loadConversations(activeMessengerTab);
      loadUpMatchHour();
      loadOnlineMatches();
    }
  }, [middleSectionView, activeMessengerTab]);

  const loadUserProfile = async () => {
    try {
      if (user) {
        setProfileData(user);
        setEditingProfile(user);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  useEffect(() => {
    dispatch(applyFilters());
  }, [matches, filters, searchTerm, sortBy, dispatch]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (middleSectionView !== "matches") return;

      const scrollContainer = document.querySelector("[data-scroll-container]");
      if (!scrollContainer) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // Load more when user scrolls to 80% of the content
      if (scrollPercentage >= 0.8 && hasMoreMatches && !isLoadingMore) {
        loadMoreMatches();
      }
    };

    const scrollContainer = document.querySelector("[data-scroll-container]");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [middleSectionView, hasMoreMatches, isLoadingMore, currentPage]);

  const loadMatches = async (page = 1, reset = true) => {
    try {
      if (reset) {
        setCurrentPage(1);
        setDisplayedMatches([]);
        setHasMoreMatches(true);
      }

      console.log("Loading matches with filters:", {
        ...filters,
        page,
        limit: 10,
      });

      // Use real API call to fetch matches with pagination
      const result = await dispatch(
        fetchMatches({ ...filters, page, limit: 10 })
      );
      console.log("API result:", result);

      if (fetchMatches.fulfilled.match(result)) {
        console.log("Matches loaded successfully:", result.payload);
        const newMatches = result.payload?.data || result.payload || [];

        // Ensure newMatches is an array
        const matchesArray = Array.isArray(newMatches) ? newMatches : [];
        console.log("Processed matches array:", matchesArray);

        if (reset) {
          setDisplayedMatches(matchesArray);
        } else {
          setDisplayedMatches((prev) => {
            const prevArray = Array.isArray(prev) ? prev : [];
            return [...prevArray, ...matchesArray];
          });
        }

        // Check if there are more matches to load
        setHasMoreMatches(matchesArray.length === 10);
        setCurrentPage(page);
      } else {
        console.error("Failed to load matches:", result.payload);
        // Check if it's a 404 error (backend not running)
        if (
          result.payload?.includes("Cannot GET") ||
          result.payload?.includes("404")
        ) {
          console.log("Backend not running, using sample data for testing");
          // Use sample data for testing when backend is not available
          const sampleMatches = [
            {
              _id: "1",
              name: "Kavya Iyer",
              dob: "1995-01-15",
              height: "5.2",
              city: "New Delhi",
              caste: "Iyer",
              occupation: "Psychologist",
              annualIncome: "6-12",
              education: "MSc",
              maritalStatus: "Never Married",
              profileImage:
                "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
              isEmailVerified: true,
              isPhoneVerified: true,
              isIdVerified: true,
              isPhotoVerified: true,
            },
            {
              _id: "2",
              name: "Priya Sharma",
              dob: "1992-03-20",
              height: "5.4",
              city: "Mumbai",
              caste: "Sharma",
              occupation: "Software Engineer",
              annualIncome: "12-18",
              education: "B.Tech",
              maritalStatus: "Never Married",
              profileImage:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
              isEmailVerified: true,
              isPhoneVerified: false,
              isIdVerified: true,
              isPhotoVerified: true,
            },
          ];

          if (reset) {
            setDisplayedMatches(sampleMatches);
          } else {
            setDisplayedMatches((prev) => [...prev, ...sampleMatches]);
          }
          setHasMoreMatches(false);
        } else {
          showError(result.payload || "Failed to load matches");
        }
      }
    } catch (error) {
      console.error("Error loading matches:", error);
      showError("Failed to load matches");
    }
  };

  const loadMoreMatches = async () => {
    if (isLoadingMore || !hasMoreMatches) return;

    setIsLoadingMore(true);
    try {
      await loadMatches(currentPage + 1, false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const loadInterestLimits = async () => {
    try {
      await dispatch(getInterestLimits());
    } catch (error) {
      console.error("Failed to load interest limits:", error);
    }
  };

  // Load activity data
  const loadActivityData = async () => {
    try {
      setLoadingActivity(true);
      const response = await activityAPI.getDashboard();
      if (response.data.success) {
        setActivityData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load activity data:", error);
    } finally {
      setLoadingActivity(false);
    }
  };

  // Load online matches
  const loadOnlineMatches = async () => {
    try {
      const response = await activityAPI.getOnlineMatches();
      if (response.data.success) {
        setOnlineMatches(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load online matches:", error);
    }
  };

  // Load conversations
  const loadConversations = async (tab = "acceptances") => {
    try {
      setLoadingConversations(true);
      const response = await conversationAPI.getConversations(tab);
      if (response.data.success) {
        setConversations(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoadingConversations(false);
    }
  };

  // Load UP Match Hour data
  const loadUpMatchHour = async () => {
    try {
      const response = await conversationAPI.getUpMatchHour();
      if (response.data.success) {
        setUpMatchHour(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load UP Match Hour:", error);
    }
  };

  // Load search criteria
  const loadSearchCriteria = async () => {
    try {
      const response = await searchAPI.getCriteria();
      if (response.data.success) {
        setSearchCriteria(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load search criteria:", error);
    }
  };

  // Search by criteria
  const searchByCriteria = async (criteria) => {
    try {
      setLoadingSearch(true);
      const response = await searchAPI.searchByCriteria(criteria);
      if (response.data.success) {
        setSearchResults(response.data.data);
      }
    } catch (error) {
      console.error("Failed to search by criteria:", error);
    } finally {
      setLoadingSearch(false);
    }
  };

  // Search by profile ID
  const searchByProfileId = async (profileId) => {
    try {
      setLoadingSearch(true);
      const response = await searchAPI.searchByProfileId(profileId);
      if (response.data.success) {
        setSearchResults([response.data.data]);
      }
    } catch (error) {
      console.error("Failed to search by profile ID:", error);
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleShowInterest = async (profileId) => {
    try {
      const result = await dispatch(showInterest(profileId));
      if (showInterest.fulfilled.match(result)) {
        showSuccess("Interest sent successfully!");
        loadInterestLimits();
      } else {
        showError(result.payload || "Failed to send interest");
      }
    } catch (error) {
      showError("Failed to send interest");
    }
  };

  const handleShowSuperInterest = async (profileId) => {
    try {
      const result = await dispatch(showSuperInterest(profileId));
      if (showSuperInterest.fulfilled.match(result)) {
        showSuccess("Super interest sent successfully!");
        loadInterestLimits();
      } else {
        showError(result.payload || "Failed to send super interest");
      }
    } catch (error) {
      showError("Failed to send super interest");
    }
  };

  const handleFilterChange = (filterName, value) => {
    // Create new filters object
    const newFilters = { ...filters };

    // If enabling a filter, disable other mutually exclusive filters
    if (value && ["verified", "justJoined", "nearby"].includes(filterName)) {
      // Disable other mutually exclusive filters
      newFilters.verified = filterName === "verified" ? value : false;
      newFilters.justJoined = filterName === "justJoined" ? value : false;
      newFilters.nearby = filterName === "nearby" ? value : false;
    } else {
      // Just update the specific filter
      newFilters[filterName] = value;
    }

    dispatch(setFilters(newFilters));
    // Reset pagination and load matches with new filters
    loadMatches(1, true);
  };

  const handleSearchChange = (value) => {
    dispatch(setSearchTerm(value));
    const newFilters = { ...filters, search: value };
    dispatch(setFilters(newFilters));
    // Reset pagination and load matches with search term
    loadMatches(1, true);
  };

  const handleSortChange = (value) => {
    dispatch(setSortBy(value));
    const newFilters = { ...filters, sortBy: value };
    dispatch(setFilters(newFilters));
    // Reset pagination and load matches with sort order
    loadMatches(1, true);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    // Reset pagination and load matches with cleared filters
    loadMatches(1, true);
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setEditingProfile({ ...profileData });
    setMiddleSectionView("profile-edit");
  };

  const handleSaveProfile = async () => {
    try {
      // Call the API to update the profile
      const response = await authAPI.updateProfile(editingProfile);

      if (response.data.success) {
        setProfileData(editingProfile);
        setIsEditingProfile(false);
        setMiddleSectionView("matches");

        // Update user data in Redux store with new profile image
        dispatch(
          setUser({
            ...user,
            ...editingProfile,
            profileImage: editingProfile.profileImage,
          })
        );

        showSuccess("Profile updated successfully!");

        // Refresh matches to reflect any changes
        loadMatches();
      } else {
        showError(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      showError(error.response?.data?.message || "Failed to save profile");
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditingProfile({ ...profileData });
    setMiddleSectionView("matches");
  };

  const handleProfileFieldChange = (field, value) => {
    setEditingProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle profile image upload
  const handleProfileImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showError("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showError("Please select a valid image file");
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("profileImage", file);

      // Upload image to backend
      const response = await authAPI.uploadProfileImage(formData);

      if (response.data.success) {
        // Update the editing profile with new image URL
        setEditingProfile((prev) => ({
          ...prev,
          profileImage: response.data.data.profileImageUrl,
        }));
        showSuccess("Profile image updated successfully!");
      } else {
        showError(response.data.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      showError(error.response?.data?.message || "Failed to upload image");
    }
  };

  // Handle profile image removal
  const handleRemoveProfileImage = async () => {
    try {
      // Call API to remove profile image
      const response = await authAPI.removeProfileImage();

      if (response.data.success) {
        // Update the editing profile to remove image
        setEditingProfile((prev) => ({
          ...prev,
          profileImage: null,
        }));
        showSuccess("Profile image removed successfully!");
      } else {
        showError(response.data.message || "Failed to remove image");
      }
    } catch (error) {
      console.error("Error removing profile image:", error);
      showError(error.response?.data?.message || "Failed to remove image");
    }
  };

  // Handle viewing individual profile details
  const handleViewProfile = (match) => {
    setSelectedMatch(match);
    setMiddleSectionView("profile-details");
  };

  // Handle going back to matches list
  const handleBackToMatches = () => {
    setSelectedMatch(null);
    setMiddleSectionView("matches");
  };

  // Navigation handlers for different sections
  const handleActivityClick = () => {
    setMiddleSectionView("activity");
  };

  const handleSearchClick = () => {
    setMiddleSectionView("search");
  };

  const handleMessengerClick = () => {
    setMiddleSectionView("messenger");
  };

  // Search functionality handlers
  const handleSearchByCriteria = async () => {
    try {
      await dispatch(searchProfilesByCriteria(searchCriteria)).unwrap();
      setMiddleSectionView("search-results");
      showSuccess("Search completed successfully!");
    } catch (error) {
      showError(error || "Search failed. Please try again.");
    }
  };

  const handleSearchCriteriaChange = (field, value) => {
    dispatch(setSearchCriteria({ [field]: value }));
  };

  const handleSaveSearchPreferences = async () => {
    try {
      await dispatch(saveSearchPreferences(searchCriteria)).unwrap();
      showSuccess("Search preferences saved successfully!");
      setShowSearchPreferences(false);
    } catch (error) {
      showError(error || "Failed to save search preferences");
    }
  };

  const handleLoadSearchPreferences = async () => {
    try {
      await dispatch(getSearchPreferences()).unwrap();
      showSuccess("Search preferences loaded successfully!");
    } catch (error) {
      showError(error || "Failed to load search preferences");
    }
  };

  const handleResetSearchCriteria = () => {
    dispatch(clearSearchCriteria());
  };

  // Render activity view - REMOVED (using ActivityPage component instead)
  // The old renderActivityView function has been replaced with the ActivityPage component

  // Generate matching criteria based on user preferences
  const getMatchingCriteria = (match) => {
    if (!user || !match) return {};

    const criteria = {
      height: {
        label: "Height",
        match: true, // Simplified - in real app, compare with user preferences
        userValue: user.height || "Not specified",
        matchValue: match.height || "Not specified",
      },
      age: {
        label: "Age",
        match: true, // Simplified - in real app, compare with user preferences
        userValue: `${getAge(user.dob) || "N/A"} years`,
        matchValue: `${getAge(match.dob) || "N/A"} years`,
      },
      maritalStatus: {
        label: "Marital Status",
        match: match.maritalStatus === "never_married",
        userValue: user.maritalStatus || "Not specified",
        matchValue: match.maritalStatus || "Not specified",
      },
      religion: {
        label: "Religion",
        match: match.religion === user.religion,
        userValue: user.religion || "Not specified",
        matchValue: match.religion || "Not specified",
      },
      motherTongue: {
        label: "Mother Tongue",
        match: true, // Simplified - in real app, compare with user preferences
        userValue: Array.isArray(user.motherTongue)
          ? user.motherTongue.join(", ")
          : user.motherTongue || "Not specified",
        matchValue: Array.isArray(match.motherTongue)
          ? match.motherTongue.join(", ")
          : match.motherTongue || "Not specified",
      },
      caste: {
        label: "Caste",
        match: match.caste === user.caste,
        userValue: user.caste || "Not specified",
        matchValue: match.caste || "Not specified",
      },
      occupation: {
        label: "Occupation",
        match: true, // Simplified - in real app, compare with user preferences
        userValue: user.occupation || "Not specified",
        matchValue: match.occupation || "Not specified",
      },
      earning: {
        label: "Annual Income",
        match: true, // Simplified - in real app, compare with user preferences
        userValue: user.annualIncome || "Not specified",
        matchValue: match.annualIncome || "Not specified",
      },
    };

    return criteria;
  };

  // Render messenger view (keeping this for now as it's complex)
  const renderMessengerView = () => {
    return (
      <>
        {/* UP Match Hour Card */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: -1 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      border: "2px solid white",
                      ml: -1,
                    }}
                  >
                    A
                  </Avatar>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      border: "2px solid white",
                      ml: -1,
                    }}
                  >
                    B
                  </Avatar>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      border: "2px solid white",
                      ml: -1,
                    }}
                  >
                    C
                  </Avatar>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    backgroundColor: "#f5f5f5",
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: "0.75rem",
                    color: "#666",
                  }}
                >
                  13127+ registered
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#333", mb: 1 }}
            >
              UP Match Hour
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: "#51365F",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ color: "white", fontSize: "0.6rem" }}>
                  📅
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#666" }}>
                12 Oct, Sun
              </Typography>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: "#51365F",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ml: 2,
                }}
              >
                <Typography sx={{ color: "white", fontSize: "0.6rem" }}>
                  🕐
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#666" }}>
                08:00 PM - 09:00 PM
              </Typography>
            </Box>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#51365F",
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#c2185b",
                },
              }}
            >
              Register Now
            </Button>
          </CardContent>
        </Card>

        {/* Online Matches Section */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#333" }}>
                Online Matches (22)
              </Typography>
              <KeyboardArrowRight sx={{ color: "#666" }} />
            </Box>

            <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
              Chat with users who are currently online to get faster responses
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                overflowX: "auto",
                pb: 1,
              }}
            >
              {onlineMatches.map((match, index) => (
                <Box key={index} sx={{ textAlign: "center", minWidth: 60 }}>
                  <Box sx={{ position: "relative", display: "inline-block" }}>
                    <Avatar sx={{ width: 48, height: 48, mb: 1 }}>
                      {match.name.charAt(0)}
                    </Avatar>
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 2,
                        right: 2,
                        width: 12,
                        height: 12,
                        backgroundColor: "#4caf50",
                        borderRadius: "50%",
                        border: "2px solid white",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      fontSize: "0.7rem",
                      color: "#333",
                      textAlign: "center",
                    }}
                  >
                    {match.name}
                  </Typography>
                </Box>
              ))}

              <Box sx={{ textAlign: "center", minWidth: 60 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: "#51365F",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1,
                    mx: "auto",
                  }}
                >
                  <Typography
                    sx={{ color: "white", fontSize: "0.8rem", fontWeight: 600 }}
                  >
                    +10
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    fontSize: "0.7rem",
                    color: "#333",
                    textAlign: "center",
                  }}
                >
                  View All
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* My Conversations Section */}
        <Card
          sx={{
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#333", mb: 3 }}
            >
              My Conversations
            </Typography>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Box sx={{ display: "flex" }}>
                {["acceptances", "interests", "calls"].map((tab) => (
                  <Button
                    key={tab}
                    onClick={() => handleMessengerTabChange(tab)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      color: activeMessengerTab === tab ? "#51365F" : "#666",
                      borderBottom:
                        activeMessengerTab === tab
                          ? "2px solid #51365F"
                          : "2px solid transparent",
                      borderRadius: 0,
                      px: 3,
                      py: 1,
                      "&:hover": {
                        backgroundColor: "rgba(233, 30, 99, 0.1)",
                      },
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Tab Content */}
            {activeMessengerTab === "acceptances" && (
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
                      width: 120,
                      height: 80,
                      backgroundColor: "#ffebee",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      zIndex: 3,
                    }}
                  >
                    <Person sx={{ fontSize: 40, color: "#51365F" }} />
                  </Box>
                  <Box
                    sx={{
                      width: 120,
                      height: 80,
                      backgroundColor: "#fff3e0",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      zIndex: 2,
                      ml: -2,
                      mt: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Message sx={{ fontSize: 20, color: "#51365F" }} />
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: "#51365F",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography sx={{ color: "white", fontSize: "0.6rem" }}>
                          📹
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: "#51365F",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography sx={{ color: "white", fontSize: "0.6rem" }}>
                          📞
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: 120,
                      height: 80,
                      backgroundColor: "#e3f2fd",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      zIndex: 1,
                      ml: -2,
                      mt: 2,
                    }}
                  >
                    <Person sx={{ fontSize: 40, color: "#2196f3" }} />
                  </Box>
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    color: "#666",
                    maxWidth: 400,
                    mx: "auto",
                    lineHeight: 1.6,
                  }}
                >
                  You can initiate a conversation with your acceptances here
                  through our chatting & calling services!
                </Typography>
              </Box>
            )}

            {activeMessengerTab === "interests" && (
              <Box>
                {/* Filter Toggle */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                    py: 2,
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Only interests with messages
                  </Typography>
                  <Box
                    onClick={handleToggleMessagesOnly}
                    sx={{
                      width: 44,
                      height: 24,
                      backgroundColor: showMessagesOnly ? "#51365F" : "#ccc",
                      borderRadius: 12,
                      position: "relative",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: "white",
                        borderRadius: "50%",
                        position: "absolute",
                        top: 2,
                        left: showMessagesOnly ? 22 : 2,
                        transition: "all 0.3s ease",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                    />
                  </Box>
                </Box>

                {/* Conversation List */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {loadingConversations ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 4 }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : conversations.length > 0 ? (
                    conversations.map((conversation, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 2,
                          borderRadius: 2,
                          "&:hover": {
                            backgroundColor: "#f5f5f5",
                          },
                        }}
                      >
                        <Avatar sx={{ width: 48, height: 48, mr: 2 }}>
                          {conversation.user.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600, color: "#333" }}
                          >
                            {conversation.user.name}, {conversation.user.age}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#666" }}>
                            {conversation.user.height} •{" "}
                            {conversation.user.caste} •{" "}
                            {conversation.user.location}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: "#999" }}>
                          {new Date(
                            conversation.createdAt
                          ).toLocaleDateString()}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography variant="body1" sx={{ color: "#666" }}>
                        No conversations found
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            {activeMessengerTab === "calls" && (
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
                      height: 120,
                      border: "3px solid #e3f2fd",
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <Person sx={{ fontSize: 40, color: "#2196f3" }} />
                    <Box
                      sx={{
                        position: "absolute",
                        right: -20,
                        top: 20,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: "#e3f2fd",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          sx={{ color: "#2196f3", fontSize: "0.8rem" }}
                        >
                          📹
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: "#e3f2fd",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          sx={{ color: "#2196f3", fontSize: "0.8rem" }}
                        >
                          📞
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    color: "#666",
                    maxWidth: 400,
                    mx: "auto",
                    lineHeight: 1.6,
                  }}
                >
                  Get to know your interests in the quickest way by calling them
                  on Jeevansathi!
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </>
    );
  };

  // Main component return
  return (
    <Container
      maxWidth="false"
      className="h-100"
      sx={{ backgroundColor: "#f8f9fa", minHeight: "calc(100vh - 90px)" }}
    >
      <Grid container spacing={4} className="pt-4">
        <Grid size={3} sx={{ display: { xs: "none", md: "block" } }}>
          <Card
            sx={{
              borderRadius: 4,
              backgroundColor: "white",
              borderRight: "1px solid #e0e0e0",
              p: 3,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* User Profile Section */}
            <Box
              className="d-flex flex-row gap-2 align-items-center"
              sx={{ textAlign: "center", mb: 4 }}
            >
              <Avatar
                src={user?.profileImage || "https://via.placeholder.com/80"}
                sx={{
                  width: 80,
                  height: 80,
                  border: "3px solid #51365F",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
              <div className="d-flex flex-column gap-1 align-items-start">
                <div className="">
                  <Typography
                    variant="h6"
                    className="text-truncate"
                    sx={{
                      fontWeight: 700,
                      color: "#333",
                      mb: 0.5,
                      fontSize: "1rem",
                    }}
                  >
                    Hi {user?.name || "User"}!
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#666", textAlign: "start" }}
                  >
                    {user?.profileId || "TXXR4877"}
                  </Typography>
                </div>
                <Button
                  variant="text"
                  sx={{
                    color: "#51365F",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "rgba(233, 30, 99, 0.1)" },
                    p: 0,
                  }}
                  onClick={() => setMiddleSectionView("profile-edit")}
                >
                  Edit Profile
                </Button>
              </div>
            </Box>

            {/* Navigation Menu */}
            <Box sx={{ flex: 1 }}>
              {[
                { text: "Matches", view: "matches", icon: "💕" },
                { text: "Activity", view: "activity", icon: "📊" },
                { text: "Search", view: "search", icon: "🔍" },
                { text: "Messenger", view: "messenger", icon: "💬" },
                {
                  text: "Upgrade",
                  view: "upgrade",
                  icon: "⭐",
                  badge: "54% Off",
                },
              ].map((item) => {
                const isActive = middleSectionView === item.view;
                return (
                  <Box
                    key={item.view}
                    onClick={() => setMiddleSectionView(item.view)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 2,

                      borderRadius: 2,
                      cursor: "pointer",
                      backgroundColor: isActive ? "#f3e5f5" : "transparent",
                      "&:hover": {
                        backgroundColor: isActive ? "#f3e5f5" : "#f5f5f5",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography sx={{ fontSize: "1.2rem" }}>
                        {item.icon}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? "#51365F" : "#333",
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {item.badge && (
                        <Box
                          sx={{
                            backgroundColor: "#4caf50",
                            color: "white",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          {item.badge}
                        </Box>
                      )}
                      <KeyboardArrowRight
                        sx={{ color: "#666", fontSize: 20 }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        {/* Main Content Area - Grid size 6 */}
        <Grid
          size={6}
          style={{ maxHeight: "calc(100vh - 18vh", overflow: "auto" }}
          sx={{ display: { xs: "block", md: "block" } }}
        >
          <Card
            sx={{
              borderRadius: 0,
              p: 4,
              overflow: "auto",
              boxShadow: "none",
            }}
            data-scroll-container
          >
            {/* Dynamic Content Based on View State */}
            {middleSectionView === "matches" && (
              <MatchesList
                filteredMatches={(() => {
                  const data =
                    displayedMatches.length > 0
                      ? displayedMatches
                      : filteredMatches || [];
                  console.log("Passing to MatchesList:", {
                    displayedMatches: displayedMatches.length,
                    filteredMatches: filteredMatches?.length,
                    finalData: data.length,
                  });
                  return data;
                })()}
                loading={loading}
                error={error}
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearchClick={() => setMiddleSectionView("search")}
                onRetryLoad={() => loadMatches(1, true)}
                onShowInterest={handleShowInterest}
                onShowSuperInterest={handleShowSuperInterest}
                onViewProfile={handleViewProfile}
                getAge={getAge}
                getHeight={getHeight}
                isLoadingMore={isLoadingMore}
                hasMoreMatches={hasMoreMatches}
              />
            )}
            {middleSectionView === "profile-edit" && (
              <ProfileEdit
                editingProfile={editingProfile}
                onBackToMatches={() => setMiddleSectionView("matches")}
                onSaveProfile={handleSaveProfile}
                onCancelEdit={handleCancelEdit}
                onProfileFieldChange={handleProfileFieldChange}
                onProfileImageChange={handleProfileImageChange}
                onRemoveProfileImage={handleRemoveProfileImage}
              />
            )}
            {middleSectionView === "profile-details" && (
              <ProfileDetails
                selectedMatch={selectedMatch}
                onBackToMatches={handleBackToMatches}
                onShowInterest={handleShowInterest}
                onShowSuperInterest={handleShowSuperInterest}
                getAge={getAge}
                getMatchingCriteria={getMatchingCriteria}
              />
            )}
            {middleSectionView === "activity" && (
              <ActivityPage
                onBackToMatches={() => setMiddleSectionView("matches")}
                onViewProfile={handleViewProfile}
                getAge={getAge}
                getHeight={getHeight}
              />
            )}
            {middleSectionView === "search" && (
              <SearchForm
                searchCriteria={searchCriteria}
                onCriteriaChange={handleSearchCriteriaChange}
                onSearch={handleSearchByCriteria}
                onSavePreferences={handleSaveSearchPreferences}
                onLoadPreferences={handleLoadSearchPreferences}
                onResetCriteria={handleResetSearchCriteria}
                loading={loading}
              />
            )}
            {middleSectionView === "search-results" && (
              <SearchResults
                searchResults={searchResults}
                loading={loading}
                error={error}
                onModifySearch={() => setMiddleSectionView("search")}
                onRetrySearch={handleSearchByCriteria}
                onShowInterest={handleShowInterest}
                onShowSuperInterest={handleShowSuperInterest}
                onViewProfile={handleViewProfile}
                getAge={getAge}
                getHeight={getHeight}
              />
            )}
            {middleSectionView === "messenger" && renderMessengerView()}
          </Card>
        </Grid>

        {/* Right Sidebar - Grid size 3 */}
        <Grid size={3} sx={{ display: { xs: "none", lg: "block" } }}>
          <Card
            sx={{
              borderRadius: 4,
              backgroundColor: "white",
              borderLeft: "1px solid #e0e0e0",
              p: 2,
              overflow: "auto",
            }}
          >
            {/* Premium Benefits Section */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#51365F",
                  mb: 3,
                  textAlign: "center",
                }}
              >
                You are missing out on the premium benefits!
              </Typography>

              {/* Benefits List */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  {
                    icon: "👤",
                    color: "#9c27b0",
                    title: "Get upto 3x more profile views",
                    description: "Increase your visibility",
                  },
                  {
                    icon: "📞",
                    color: "#ff9800",
                    title: "Unlimited voice & video calls",
                    description: "Connect directly with matches",
                  },
                  {
                    icon: "📋",
                    color: "#4caf50",
                    title: "Get access to contact details",
                    description: "Skip the wait, get direct contact",
                  },
                  {
                    icon: "🔍",
                    color: "#2196f3",
                    title: "Perform unlimited searches",
                    description: "Find your perfect match faster",
                  },
                ].map((benefit, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: `${benefit.color}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Typography sx={{ fontSize: "1.2rem" }}>
                        {benefit.icon}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#333", mb: 0.5 }}
                      >
                        {benefit.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#666" }}>
                        {benefit.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Promotional Banner */}
              <Box
                sx={{
                  backgroundColor: "#fff3e0",
                  border: "1px solid #ff9800",
                  borderRadius: 2,
                  p: 2,
                  mb: 1,
                  mt: 2,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#ff9800" }}
                >
                  Flat 54% OFF till 17 Oct
                </Typography>
              </Box>

              {/* Upgrade Button */}
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#51365F",
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1rem",
                  "&:hover": {
                    backgroundColor: "#c2185b",
                  },
                }}
              >
                Upgrade now →
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MyMatchesPage;
