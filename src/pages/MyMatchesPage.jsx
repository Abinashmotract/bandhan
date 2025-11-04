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
import { setUser, fetchUserDetails } from "../store/slices/authSlice";
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
  addToShortlist,
  removeFromShortlist,
  updateMatchInterest,
  updateInterestLimits,
  updateShortlistStatus,
} from "../store/slices/matchesSlice";
import {
  activityAPI,
  conversationAPI,
  searchAPI,
} from "../services/apiService";
import  MessengerView from "./MessengerView";
// Import components
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import MatchesList from "../components/MatchesList";
import SearchForm from "../components/SearchForm";
import SearchResults from "../components/SearchResults";
import ProfileDetails from "../components/ProfileDetails";
import ProfileEdit from "../components/ProfileEdit";
import ActivityPage from "../components/ActivityPage";
import MessengerChatRoom from "../components/MessengerChatRoom";
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
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editingProfile, setEditingProfile] = useState({});
  const [selectedChatProfile, setSelectedChatProfile] = useState(null);

  // Dynamic middle section view states
  const [middleSectionView, setMiddleSectionView] = useState("matches");
  const [activeMessengerTab, setActiveMessengerTab] = useState("acceptances");
  const [showSearchPreferences, setShowSearchPreferences] = useState(false);

  // Dynamic data states
  const [conversations, setConversations] = useState([]);
  const [onlineMatches, setOnlineMatches] = useState([]);
  const [upMatchHour, setUpMatchHour] = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Infinite scroll states
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMatches, setHasMoreMatches] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [displayedMatches, setDisplayedMatches] = useState([]);

  // Get user ID from backend customId ONLY - no frontend generation
  // The backend middleware generates customId automatically
  const getUserDisplayId = (user) => {
    // Only use backend-provided customId - never generate on frontend
    return user?.customId || "Loading...";
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
    return height;
  };

  useEffect(() => {
    loadMatches();
    loadInterestLimits();
    loadSearchCriteria();
    
    // Always ensure user data is loaded
    loadUserProfile();
    
    // Also fetch via Redux if user not available
    if (!user) {
      dispatch(fetchUserDetails());
    }
  }, []);

  // Update local state when Redux user changes
  useEffect(() => {
    if (user) {
      setProfileData(user);
      setEditingProfile(user);
    }
  }, [user]);

  // Load data when switching views
  useEffect(() => {
    if (middleSectionView === "messenger") {
      loadConversations(activeMessengerTab);
      loadUpMatchHour();
      loadOnlineMatches();
    } else if (middleSectionView === "profile-edit") {
      // Load fresh user data when entering edit mode
      loadUserProfileForEdit();
    }
  }, [middleSectionView, activeMessengerTab]);

  const loadUserProfile = async () => {
    try {
      // If user exists in Redux, use it
      if (user) {
        setProfileData(user);
        setEditingProfile(user);
      } else {
        // If user not in Redux, fetch from API
        try {
          const response = await authAPI.getCurrentUser();
          if (response.data.success) {
            const userData = response.data.data;
            // Update Redux store
            dispatch(setUser(userData));
            // Update local state
            setProfileData(userData);
            setEditingProfile(userData);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          // Try fetching via Redux thunk as fallback
          try {
            await dispatch(fetchUserDetails()).unwrap();
          } catch (fetchError) {
            console.error("Error fetching user via Redux:", fetchError);
          }
        }
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const loadUserProfileForEdit = async () => {
    try {
      // Fetch fresh user data from API
      const response = await authAPI.getCurrentUser();
      if (response.data.success) {
        const userData = response.data.data;
        setProfileData(userData);
        setEditingProfile(userData);
      } else if (user) {
        // Fallback to Redux user data
        setProfileData(user);
        setEditingProfile(user);
      }
    } catch (error) {
      console.error("Error loading user profile for edit:", error);
      // Fallback to Redux user data
      if (user) {
        setProfileData(user);
        setEditingProfile(user);
      }
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

  // Load online matches
  const loadOnlineMatches = async () => {
    try {
      const response = await conversationAPI.getOnlineMatches();
      if (response.data.success) {
        setOnlineMatches(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to load online matches:", error);
      setOnlineMatches([]); // Set empty array on error
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

  const handleToggleShortlist = async (profileId, isShortlisted = null) => {
    const matchToUpdate = matches.find(m => m._id === profileId);
    if (matchToUpdate) {
      // If isShortlisted is provided, just update the local state without making API call
      // This is used when MatchCard has already handled the API call
      if (isShortlisted !== null) {
        // Update displayedMatches if it exists
        if (displayedMatches.length > 0) {
          setDisplayedMatches(prevMatches =>
            prevMatches.map(m =>
              m._id === profileId ? { ...m, isShortlisted } : m
            )
          );
        }
        // Also update Redux state
        dispatch(updateShortlistStatus({ profileId, isShortlisted }));
        return;
      }

      // Otherwise, make the API call (legacy behavior)
      try {
        if (matchToUpdate.isShortlisted) {
          const result = await dispatch(removeFromShortlist(profileId));
          if (removeFromShortlist.fulfilled.match(result)) {
            showSuccess("Profile removed from shortlist");
          } else {
            showError(result.payload || "Failed to remove from shortlist");
          }
        } else {
          const result = await dispatch(addToShortlist(profileId));
          if (addToShortlist.fulfilled.match(result)) {
            showSuccess("Profile added to shortlist");
          } else {
            showError(result.payload || "Failed to add to shortlist");
          }
        }
      } catch (error) {
        showError("Failed to update shortlist");
      }
    }
  };

  const handleFilterChange = (filterName, value) => {
    // Create new filters object
    const newFilters = { ...filters };

    // Handle batch filter update from FilterDialog
    if (filterName === 'applyAllFilters' && typeof value === 'object') {
      // Replace all filters with the provided filter object
      // Keep verified, justJoined, nearby values if they're already set
      Object.keys(value).forEach((key) => {
        newFilters[key] = value[key];
      });
    } else {
      // Handle single filter change
      // If enabling a filter, disable other mutually exclusive filters (for verified, justJoined, nearby)
      if (value && ["verified", "justJoined", "nearby"].includes(filterName)) {
        // These filters are mutually exclusive - enable only the clicked one
        newFilters.verified = filterName === "verified" ? value : false;
        newFilters.justJoined = filterName === "justJoined" ? value : false;
        newFilters.nearby = filterName === "nearby" ? value : false;
      } else {
        // Update the specific filter
        newFilters[filterName] = value;
      }
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
      // Helper to handle motherTongue - convert string to array if needed
      const formatMotherTongue = (mt) => {
        if (!mt) return [];
        if (Array.isArray(mt)) return mt;
        if (typeof mt === 'string') {
          // Split by comma and trim
          return mt.split(',').map(item => item.trim()).filter(item => item);
        }
        return [];
      };

      // Map editingProfile fields to API format
      // Backend accepts: name, email, phoneNumber, dob, occupation, location, education, motherTongue, religion, caste, about, interests, preferences
      const profileUpdateData = {};
      
      // Always include these fields if they exist in editingProfile (even if empty)
      if (editingProfile.name !== undefined) profileUpdateData.name = editingProfile.name || "";
      if (editingProfile.email !== undefined) profileUpdateData.email = editingProfile.email || "";
      if (editingProfile.phoneNumber !== undefined) profileUpdateData.phoneNumber = editingProfile.phoneNumber || "";
      if (editingProfile.dob !== undefined) profileUpdateData.dob = editingProfile.dob || "";
      if (editingProfile.occupation !== undefined) profileUpdateData.occupation = editingProfile.occupation || "";
      if (editingProfile.location !== undefined || editingProfile.city !== undefined) {
        profileUpdateData.location = editingProfile.location || editingProfile.city || "";
      }
      if (editingProfile.education !== undefined || editingProfile.highestQualification !== undefined) {
        profileUpdateData.education = editingProfile.education || editingProfile.highestQualification || "";
      }
      // Always include motherTongue if it exists in editingProfile
      // It can be a string (from UI) or array (from API), we'll format it
      // Backend expects an array, so we always send it as an array (even if empty)
      if (editingProfile.motherTongue !== undefined && editingProfile.motherTongue !== null) {
        const formattedMotherTongue = formatMotherTongue(editingProfile.motherTongue);
        // Always send motherTongue as array - empty array is valid (means clearing the field)
        // Backend uses: motherTongue || user.motherTongue, so we must send even empty arrays
        profileUpdateData.motherTongue = formattedMotherTongue;
      }
      if (editingProfile.religion !== undefined) profileUpdateData.religion = editingProfile.religion || "";
      if (editingProfile.caste !== undefined) profileUpdateData.caste = editingProfile.caste || "";
      // About can be empty string, so check for !== undefined
      if (editingProfile.about !== undefined) profileUpdateData.about = editingProfile.about || "";
      // Interests should be an array
      if (editingProfile.interests !== undefined) {
        profileUpdateData.interests = Array.isArray(editingProfile.interests) 
          ? editingProfile.interests 
          : (editingProfile.interests ? [editingProfile.interests] : []);
      }
      
      // Include preferences if they were updated
      if (editingProfile.preferences && Object.keys(editingProfile.preferences).length > 0) {
        // Backend expects preferences as JSON string or object
        profileUpdateData.preferences = JSON.stringify(editingProfile.preferences);
      }

      console.log("Saving profile with data:", profileUpdateData);
      console.log("Editing profile state:", editingProfile);

      // Call the API to update the profile
      const response = await authAPI.updateProfile(profileUpdateData);

      if (response.data.success) {
        // Fetch updated user data from API
        const updatedUserResponse = await authAPI.getCurrentUser();
        if (updatedUserResponse.data.success) {
          const updatedUserData = updatedUserResponse.data.data;
          setProfileData(updatedUserData);
          setEditingProfile(updatedUserData);
          
          // Update user data in Redux store
          dispatch(setUser(updatedUserData));
        } else {
          // Fallback: use editingProfile
          setProfileData(editingProfile);
          dispatch(
            setUser({
              ...user,
              ...editingProfile,
            })
          );
        }

        setIsEditingProfile(false);
        setMiddleSectionView("matches");

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
    if (field === "preferences") {
      // Handle preferences update
      setEditingProfile((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          ...value,
        },
      }));
    } else {
      // Handle regular field update
      setEditingProfile((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
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

  // Handle multiple photos upload
  const handlePhotosUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const maxSize = 5 * 1024 * 1024; // 5MB
    for (const file of files) {
      if (file.size > maxSize) {
        showError(`File ${file.name} is too large. Maximum size is 5MB`);
        return;
      }
      if (!file.type.startsWith("image/")) {
        showError(`File ${file.name} is not a valid image`);
        return;
      }
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("photos", file);
      });

      // Upload photos using the update profile endpoint
      // The API expects FormData with 'photos' field
      const response = await authAPI.updateProfile(formData);

      if (response.data.success) {
        showSuccess(`Successfully uploaded ${files.length} photo(s)!`);
        // Refresh user profile to get updated photos
        const updatedUserResponse = await authAPI.getCurrentUser();
        if (updatedUserResponse.data.success) {
          const updatedUserData = updatedUserResponse.data.data;
          setEditingProfile(updatedUserData);
          setProfileData(updatedUserData);
        }
      } else {
        showError(response.data.message || "Failed to upload photos");
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
      showError(error.response?.data?.message || "Failed to upload photos");
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

  // Handle chat click from match card
  const handleChatClick = (match) => {
    const chatProfile = {
      id: match._id,
      _id: match._id,
      name: match.name,
      profileImage: match.profileImage,
      avatar: match.profileImage,
      age: getAge(match.dob),
      height: getHeight(match.height),
      caste: match.caste,
      location: match.location || match.city,
      occupation: match.occupation || "N/A",
      annualIncome: match.annualIncome || "N/A",
      maritalStatus: match.maritalStatus || "N/A",
      dob: match.dob,
      isOnline: match.isOnline || false,
      customId: match.customId,
    };
    setSelectedChatProfile(chatProfile);
    setMiddleSectionView("chat");
  };

  // Handle back from chat
  const handleBackFromChat = () => {
    setSelectedChatProfile(null);
    setMiddleSectionView("matches");
  };

  // Handle interest sent from card (now handled inline in MatchCard)
  const handleInterestSentFromCard = async (profileId) => {
    // Reload interest limits
    await loadInterestLimits();
    // Optionally refresh matches to update interest status
    // loadMatches(1, true);
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


    const matchHourData = {
    title: 'UP Match Hour',
    date: '12 Oct, Sun',
    time: '08:00 PM - 09:00 PM',
    registered: '13127',
    avatars: [
      { letter: 'A', color: '#51365F' },
      { letter: 'B', color: '#2196f3' },
      { letter: 'C', color: '#4caf50' }
    ]
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
                    {getUserDisplayId(user)}
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
                ,
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
                onShowInterest={(profileId) => {
                  handleShowInterest(profileId);
                  handleInterestSentFromCard(profileId);
                }}
                onShowSuperInterest={handleShowSuperInterest}
                onViewProfile={handleViewProfile}
                onToggleShortlist={handleToggleShortlist}
                onChatClick={handleChatClick}
                getAge={getAge}
                getHeight={getHeight}
                isLoadingMore={isLoadingMore}
                hasMoreMatches={hasMoreMatches}
              />
            )}
            {middleSectionView === "chat" && selectedChatProfile && (
              <Box sx={{ height: "calc(100vh - 200px)" }}>
                <MessengerChatRoom
                  profile={selectedChatProfile}
                  onBack={handleBackFromChat}
                  onInterestSent={handleInterestSentFromCard}
                />
              </Box>
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
                onPhotosUpload={handlePhotosUpload}
              />
            )}
            {middleSectionView === "profile-details" && (
              <ProfileDetails
                selectedMatch={selectedMatch}
                onBackToMatches={handleBackToMatches}
                onShowInterest={handleShowInterest}
                onShowSuperInterest={handleShowSuperInterest}
                onToggleShortlist={handleToggleShortlist}
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
            {middleSectionView === "messenger" && (
              <MessengerView
                matchHourData={matchHourData}
                onlineMatches={onlineMatches}
                conversations={conversations}
                loading={loadingConversations}
                initialTab={activeMessengerTab}
                onRegisterClick={() => console.log('Register clicked')}
                onViewAllOnline={() => console.log('View all online clicked')}
                onConversationClick={(conv) => {
                  console.log('Conversation clicked:', conv);
                }}
                onTabChange={(tab) => {
                  setActiveMessengerTab(tab);
                  loadConversations(tab);
                }}
                onInterestSent={async () => {
                  // Switch to interests tab first
                  setActiveMessengerTab("interests");
                  // Wait a moment for backend to save, then reload conversations
                  setTimeout(() => {
                    loadConversations("interests");
                  }, 300);
                }}
              />
            )}
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
