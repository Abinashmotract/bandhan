import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Slider,
  Checkbox,
  FormControlLabel,
  Skeleton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton
} from '@mui/material';
import {
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Verified as VerifiedIcon,
  Message as MessageIcon,
  Close as CloseIcon,
  Clear as ClearIcon,
  Check as CheckIcon,
  Person as PersonIcon,
  Height as HeightIcon,
  Language as LanguageIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Edit as EditIcon,
  ArrowForward as ArrowForwardIcon,
  AttachMoney as AttachMoneyIcon,
  Group as GroupIcon,
  Phone as PhoneIcon,
  ContactPhone as ContactPhoneIcon,
  Search as SearchIconAlt,
  CameraAlt as CameraAltIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Chat as ChatIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { showSuccess, showError } from '../utils/toast';
import { authAPI } from '../services/apiService';
import { setUser } from '../store/slices/authSlice';
import { 
  fetchMatches, 
  showInterest, 
  showSuperInterest, 
  getInterestLimits,
  setFilters,
  setSearchTerm,
  setSortBy,
  clearFilters,
  applyFilters
} from '../store/slices/matchesSlice';

const MyMatchesPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { 
    matches, 
    filteredMatches, 
    loading, 
    error, 
    interestLimits, 
    filters, 
    searchTerm, 
    sortBy 
  } = useSelector(state => state.matches);
  
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editingProfile, setEditingProfile] = useState({});
  
  // Dynamic middle section view states
  const [middleSectionView, setMiddleSectionView] = useState('matches'); // 'matches', 'profile-edit', 'profile-details'

  useEffect(() => {
    loadMatches();
    loadInterestLimits();
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      if (user) {
        setProfileData(user);
        setEditingProfile(user);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  useEffect(() => {
    dispatch(applyFilters());
  }, [matches, filters, searchTerm, sortBy, dispatch]);

  const loadMatches = async () => {
    try {
      // Use real API call to fetch matches
      const result = await dispatch(fetchMatches(filters));
      if (fetchMatches.fulfilled.match(result)) {
        console.log('Matches loaded successfully:', result.payload);
      } else {
        console.error('Failed to load matches:', result.payload);
        // Check if it's a 404 error (backend not running)
        if (result.payload?.includes('Cannot GET') || result.payload?.includes('404')) {
          showError('Backend server is not running. Please start the backend server.');
        } else {
          showError(result.payload || 'Failed to load matches');
        }
      }
    } catch (error) {
      console.error('Error loading matches:', error);
      if (error.message?.includes('Network Error') || error.code === 'ECONNREFUSED') {
        showError('Cannot connect to backend server. Please ensure the backend is running on port 3000.');
      } else {
        showError('Failed to load matches');
      }
    }
  };

  const loadInterestLimits = async () => {
    try {
      await dispatch(getInterestLimits());
    } catch (error) {
      console.error('Failed to load interest limits:', error);
    }
  };

  const handleShowInterest = async (profileId) => {
    try {
      const result = await dispatch(showInterest(profileId));
      if (showInterest.fulfilled.match(result)) {
        showSuccess('Interest sent successfully!');
        loadInterestLimits();
      } else {
        showError(result.payload || 'Failed to send interest');
      }
    } catch (error) {
      showError('Failed to send interest');
    }
  };

  const handleShowSuperInterest = async (profileId) => {
    try {
      const result = await dispatch(showSuperInterest(profileId));
      if (showSuperInterest.fulfilled.match(result)) {
        showSuccess('Super interest sent successfully!');
        loadInterestLimits();
      } else {
        showError(result.payload || 'Failed to send super interest');
      }
    } catch (error) {
      showError('Failed to send super interest');
    }
  };


  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    dispatch(setFilters(newFilters));
    // Trigger new API call with updated filters
    dispatch(fetchMatches(newFilters));
  };

  const handleSearchChange = (value) => {
    dispatch(setSearchTerm(value));
    const newFilters = { ...filters, search: value };
    dispatch(setFilters(newFilters));
    // Trigger new API call with search term
    dispatch(fetchMatches(newFilters));
  };

  const handleSortChange = (value) => {
    dispatch(setSortBy(value));
    const newFilters = { ...filters, sortBy: value };
    dispatch(setFilters(newFilters));
    // Trigger new API call with sort order
    dispatch(fetchMatches(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    // Trigger new API call with cleared filters
    dispatch(fetchMatches({}));
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setEditingProfile({ ...profileData });
    setMiddleSectionView('profile-edit');
  };

  const handleSaveProfile = async () => {
    try {
      // Call the API to update the profile
      const response = await authAPI.updateProfile(editingProfile);
      
      if (response.data.success) {
        setProfileData(editingProfile);
        setIsEditingProfile(false);
        setMiddleSectionView('matches');
        
        // Update user data in Redux store with new profile image
        dispatch(setUser({
          ...user,
          ...editingProfile,
          profileImage: editingProfile.profileImage
        }));
        
        showSuccess('Profile updated successfully!');
        
        // Refresh matches to reflect any changes
        loadMatches();
      } else {
        showError(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showError(error.response?.data?.message || 'Failed to save profile');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditingProfile({ ...profileData });
    setMiddleSectionView('matches');
  };

  const handleProfileFieldChange = (field, value) => {
    setEditingProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle profile image upload
  const handleProfileImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showError('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select a valid image file');
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('profileImage', file);

      // Upload image to backend
      const response = await authAPI.uploadProfileImage(formData);
      
      if (response.data.success) {
        // Update the editing profile with new image URL
        setEditingProfile(prev => ({
          ...prev,
          profileImage: response.data.data.profileImageUrl
        }));
        showSuccess('Profile image updated successfully!');
      } else {
        showError(response.data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      showError(error.response?.data?.message || 'Failed to upload image');
    }
  };

  // Handle profile image removal
  const handleRemoveProfileImage = async () => {
    try {
      // Call API to remove profile image
      const response = await authAPI.removeProfileImage();
      
      if (response.data.success) {
        // Update the editing profile to remove image
        setEditingProfile(prev => ({
          ...prev,
          profileImage: null
        }));
        showSuccess('Profile image removed successfully!');
      } else {
        showError(response.data.message || 'Failed to remove image');
      }
    } catch (error) {
      console.error('Error removing profile image:', error);
      showError(error.response?.data?.message || 'Failed to remove image');
    }
  };

  // Handle viewing individual profile details
  const handleViewProfile = (match) => {
    setSelectedMatch(match);
    setMiddleSectionView('profile-details');
  };

  // Handle going back to matches list
  const handleBackToMatches = () => {
    setSelectedMatch(null);
    setMiddleSectionView('matches');
  };

  // Render matches list view
  const renderMatchesListView = () => (
    <>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          color: '#333', 
          fontWeight: 800, 
          mb: 2
        }}>
          My Matches
        </Typography>
        
        {/* Filter Bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(true)}
            sx={{
              backgroundColor: '#e91e63',
              '&:hover': {
                backgroundColor: '#c2185b'
              },
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Filters
          </Button>
          <Button
            variant={filters.verified ? "contained" : "outlined"}
            onClick={() => handleFilterChange('verified', !filters.verified)}
            sx={{
              borderColor: filters.verified ? '#e91e63' : '#e0e0e0',
              backgroundColor: filters.verified ? '#e91e63' : 'transparent',
              color: filters.verified ? 'white' : '#666',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: filters.verified ? '#c2185b' : 'rgba(233, 30, 99, 0.1)',
                borderColor: '#e91e63'
              }
            }}
          >
            Verified
          </Button>
          <Button
            variant={filters.justJoined ? "contained" : "outlined"}
            onClick={() => handleFilterChange('justJoined', !filters.justJoined)}
            sx={{
              borderColor: filters.justJoined ? '#e91e63' : '#e0e0e0',
              backgroundColor: filters.justJoined ? '#e91e63' : 'transparent',
              color: filters.justJoined ? 'white' : '#666',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: filters.justJoined ? '#c2185b' : 'rgba(233, 30, 99, 0.1)',
                borderColor: '#e91e63'
              }
            }}
          >
            Just Joined
          </Button>
          <Button
            variant={filters.nearby ? "contained" : "outlined"}
            onClick={() => handleFilterChange('nearby', !filters.nearby)}
            sx={{
              borderColor: filters.nearby ? '#e91e63' : '#e0e0e0',
              backgroundColor: filters.nearby ? '#e91e63' : 'transparent',
              color: filters.nearby ? 'white' : '#666',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: filters.nearby ? '#c2185b' : 'rgba(233, 30, 99, 0.1)',
                borderColor: '#e91e63'
              }
            }}
          >
            Nearby
          </Button>
        </Box>
      </Box>

      {/* Matches Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {[...Array(6)].map((_, index) => (
            <Card key={index} sx={{ width: 300, height: 400 }}>
              <Skeleton variant="rectangular" width="100%" height={200} />
              <CardContent>
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={20} />
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={loadMatches}
            sx={{ backgroundColor: '#e91e63' }}
          >
            Try Again
          </Button>
        </Box>
      ) : filteredMatches.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No matches found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or search criteria
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {filteredMatches.map((match) => renderMatchCard(match))}
        </Box>
      )}
    </>
  );

  // Render profile details view
  const renderProfileDetailsView = () => {
    if (!selectedMatch) return null;

    const matchingCriteria = getMatchingCriteria(selectedMatch);
    const matchCount = Object.values(matchingCriteria).filter(c => c.match).length;
    const totalCriteria = Object.keys(matchingCriteria).length;

    return (
      <>
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<KeyboardArrowRightIcon sx={{ transform: 'rotate(180deg)' }} />}
            onClick={handleBackToMatches}
            sx={{
              color: '#e91e63',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(233, 30, 99, 0.1)'
              }
            }}
          >
            Back to Matches
          </Button>
        </Box>

        {/* Profile Header */}
        <Box sx={{ 
          position: 'relative', 
          height: 400, 
          borderRadius: 2, 
          overflow: 'hidden',
          mb: 3,
          backgroundColor: '#f5f5f5'
        }}>
          <CardMedia
            component="img"
            height="400"
            image={selectedMatch.profileImage?.startsWith('http') ? selectedMatch.profileImage : selectedMatch.profileImage ? `http://localhost:3000/uploads/${selectedMatch.profileImage}` : 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
            alt={selectedMatch.name}
            sx={{ 
              objectFit: 'cover',
              width: '100%'
            }}
          />
          
          {/* Profile Info Overlay */}
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            p: 3,
            color: 'white'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {selectedMatch.name}, {getAge(selectedMatch.dob)}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, opacity: 0.9 }}>
              {selectedMatch.height} • {selectedMatch.city}, {selectedMatch.state}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              ID: {selectedMatch.customId || generateUserId(selectedMatch)}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Profile managed by {selectedMatch.managedBy || 'Self'}
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<FavoriteBorderIcon />}
            onClick={() => handleInterest(selectedMatch._id)}
            disabled={selectedMatch.hasShownInterest}
            sx={{
              backgroundColor: '#e91e63',
              '&:hover': { backgroundColor: '#c2185b' },
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5
            }}
          >
            {selectedMatch.hasShownInterest ? 'Interest Sent' : 'Interest'}
          </Button>
          <Button
            variant="contained"
            startIcon={<StarIcon />}
            onClick={() => handleSuperInterest(selectedMatch._id)}
            disabled={selectedMatch.hasShownSuperInterest}
            sx={{
              backgroundColor: '#ff9800',
              '&:hover': { backgroundColor: '#f57c00' },
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5
            }}
          >
            {selectedMatch.hasShownSuperInterest ? 'Super Interest Sent' : 'Super Interest'}
          </Button>
        </Box>

        {/* Profile Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              color: '#e91e63', 
              borderBottom: '2px solid #e91e63',
              pb: 1
            }}>
              About Me
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#666', pb: 1 }}>
              Family
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#666', pb: 1 }}>
              Looking For
            </Typography>
          </Box>
        </Box>

        {/* About Me Content */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
            {selectedMatch.about || 'No description available.'}
          </Typography>
          
          {/* Basic Details */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                Basic Details
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HeightIcon sx={{ color: '#666', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Height: {selectedMatch.height || 'Not specified'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkIcon sx={{ color: '#666', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Occupation: {selectedMatch.occupation || 'Not specified'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SchoolIcon sx={{ color: '#666', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Education: {selectedMatch.education || 'Not specified'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LanguageIcon sx={{ color: '#666', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Mother Tongue: {Array.isArray(selectedMatch.motherTongue) ? selectedMatch.motherTongue.join(', ') : selectedMatch.motherTongue || 'Not specified'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                Religious & Cultural
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Religion: {selectedMatch.religion || 'Not specified'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Caste: {selectedMatch.caste || 'Not specified'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Marital Status: {selectedMatch.maritalStatus || 'Not specified'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Diet: {selectedMatch.diet || 'Not specified'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Matching Criteria */}
        <Box sx={{ 
          backgroundColor: '#f8f9fa', 
          borderRadius: 2, 
          p: 3, 
          mb: 4 
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
            Who is {selectedMatch.name} looking for...
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
            You match {matchCount} out of {totalCriteria} of her preferences
          </Typography>
          
          <Grid container spacing={2}>
            {Object.entries(matchingCriteria).map(([key, criterion]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  p: 1,
                  backgroundColor: 'white',
                  borderRadius: 1,
                  border: '1px solid #e0e0e0'
                }}>
                  {criterion.match ? (
                    <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                  ) : (
                    <CloseIcon sx={{ color: '#f44336', fontSize: 20 }} />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                      {criterion.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      {criterion.userValue} → {criterion.matchValue}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Action Buttons (Bottom) */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', pt: 2 }}>
          <Button
            variant="contained"
            startIcon={<FavoriteBorderIcon />}
            onClick={() => handleInterest(selectedMatch._id)}
            disabled={selectedMatch.hasShownInterest}
            sx={{
              backgroundColor: '#e91e63',
              '&:hover': { backgroundColor: '#c2185b' },
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5
            }}
          >
            {selectedMatch.hasShownInterest ? 'Interest Sent' : 'Interest'}
          </Button>
          <Button
            variant="contained"
            startIcon={<StarIcon />}
            onClick={() => handleSuperInterest(selectedMatch._id)}
            disabled={selectedMatch.hasShownSuperInterest}
            sx={{
              backgroundColor: '#ff9800',
              '&:hover': { backgroundColor: '#f57c00' },
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5
            }}
          >
            {selectedMatch.hasShownSuperInterest ? 'Super Interest Sent' : 'Super Interest'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<MessageIcon />}
            sx={{
              borderColor: '#e91e63',
              color: '#e91e63',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(233, 30, 99, 0.1)',
                borderColor: '#e91e63'
              }
            }}
          >
            Chat
          </Button>
        </Box>
      </>
    );
  };

  // Render profile edit view
  const renderProfileEditView = () => (
    <>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<KeyboardArrowRightIcon sx={{ transform: 'rotate(180deg)' }} />}
          onClick={handleCancelEdit}
          sx={{
            color: '#e91e63',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: 'rgba(233, 30, 99, 0.1)'
            }
          }}
        >
          Back to Matches
        </Button>
      </Box>

      {/* Profile Edit Form */}
      <Card sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>
            Edit Your Profile
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={handleCancelEdit}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveProfile}
              sx={{
                backgroundColor: '#e91e63',
                '&:hover': { backgroundColor: '#c2185b' },
                textTransform: 'none'
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>

        {/* Profile Image Upload Section */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
            Profile Picture
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 2
          }}>
            <Avatar
              src={editingProfile.profileImage?.startsWith('http') ? editingProfile.profileImage : editingProfile.profileImage ? `http://localhost:3000/uploads/${editingProfile.profileImage}` : null}
              sx={{ 
                width: 120, 
                height: 120, 
                border: '3px solid #e91e63',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CameraAltIcon />}
                sx={{
                  borderColor: '#e91e63',
                  color: '#e91e63',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(233, 30, 99, 0.1)',
                    borderColor: '#e91e63'
                  }
                }}
              >
                Change Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleProfileImageChange(e)}
                />
              </Button>
              {editingProfile.profileImage && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CloseIcon />}
                  onClick={handleRemoveProfileImage}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Remove
                </Button>
              )}
            </Box>
            <Typography variant="caption" sx={{ color: '#666', textAlign: 'center' }}>
              Upload a clear photo of yourself. JPG, PNG or GIF format. Max 5MB.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
              Basic Information
            </Typography>
            <TextField 
              fullWidth 
              label="Full Name" 
              value={editingProfile.name || ''} 
              onChange={(e) => handleProfileFieldChange('name', e.target.value)} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Email" 
              value={editingProfile.email || ''} 
              disabled 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Phone Number" 
              value={editingProfile.phoneNumber || ''} 
              onChange={(e) => handleProfileFieldChange('phoneNumber', e.target.value)} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Date of Birth" 
              type="date" 
              value={editingProfile.dob ? editingProfile.dob.split('T')[0] : ''} 
              onChange={(e) => handleProfileFieldChange('dob', e.target.value)} 
              InputLabelProps={{ shrink: true }} 
              sx={{ mb: 2 }} 
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Gender</InputLabel>
              <Select 
                value={editingProfile.gender || ''} 
                onChange={(e) => handleProfileFieldChange('gender', e.target.value)} 
                label="Gender"
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Location & Professional */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
              Location & Professional
            </Typography>
            <TextField 
              fullWidth 
              label="City" 
              value={editingProfile.city || ''} 
              onChange={(e) => handleProfileFieldChange('city', e.target.value)} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="State" 
              value={editingProfile.state || ''} 
              onChange={(e) => handleProfileFieldChange('state', e.target.value)} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Occupation" 
              value={editingProfile.occupation || ''} 
              onChange={(e) => handleProfileFieldChange('occupation', e.target.value)} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Education" 
              value={editingProfile.education || ''} 
              onChange={(e) => handleProfileFieldChange('education', e.target.value)} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Height" 
              value={editingProfile.height || ''} 
              onChange={(e) => handleProfileFieldChange('height', e.target.value)} 
              placeholder="e.g., 5'8 inches" 
              sx={{ mb: 2 }} 
            />
          </Grid>

          {/* Religious & Cultural */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
              Religious & Cultural
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Religion</InputLabel>
              <Select 
                value={editingProfile.religion || ''} 
                onChange={(e) => handleProfileFieldChange('religion', e.target.value)} 
                label="Religion"
              >
                <MenuItem value="Hindu">Hindu</MenuItem>
                <MenuItem value="Muslim">Muslim</MenuItem>
                <MenuItem value="Christian">Christian</MenuItem>
                <MenuItem value="Sikh">Sikh</MenuItem>
                <MenuItem value="Buddhist">Buddhist</MenuItem>
                <MenuItem value="Jain">Jain</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField 
              fullWidth 
              label="Caste" 
              value={editingProfile.caste || ''} 
              onChange={(e) => handleProfileFieldChange('caste', e.target.value)} 
              sx={{ mb: 2 }} 
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Marital Status</InputLabel>
              <Select 
                value={editingProfile.maritalStatus || ''} 
                onChange={(e) => handleProfileFieldChange('maritalStatus', e.target.value)} 
                label="Marital Status"
              >
                <MenuItem value="never_married">Never Married</MenuItem>
                <MenuItem value="divorced">Divorced</MenuItem>
                <MenuItem value="widow">Widow</MenuItem>
                <MenuItem value="widower">Widower</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Personal Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
              Personal Details
            </Typography>
            <TextField 
              fullWidth 
              label="About Me" 
              multiline 
              rows={4} 
              value={editingProfile.about || ''} 
              onChange={(e) => handleProfileFieldChange('about', e.target.value)} 
              placeholder="Tell us about yourself..." 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Hobbies" 
              value={Array.isArray(editingProfile.hobbies) ? editingProfile.hobbies.join(', ') : editingProfile.hobbies || ''} 
              onChange={(e) => handleProfileFieldChange('hobbies', e.target.value.split(',').map(h => h.trim()))} 
              placeholder="e.g., Reading, Traveling, Cooking" 
              sx={{ mb: 2 }} 
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Diet</InputLabel>
              <Select 
                value={editingProfile.diet || ''} 
                onChange={(e) => handleProfileFieldChange('diet', e.target.value)} 
                label="Diet"
              >
                <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                <MenuItem value="Non-Vegetarian">Non-Vegetarian</MenuItem>
                <MenuItem value="Vegan">Vegan</MenuItem>
                <MenuItem value="Jain">Jain</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>
    </>
  );

  // Generate unique user ID like Jeevansathi (e.g., TYXX0117)
  const generateUserId = (user) => {
    if (user?.customId) return user.customId;
    
    // Generate a Jeevansathi-style ID
    const prefix = 'TYXX';
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    return `${prefix}${randomNum}`;
  };

  // Generate matching criteria based on user preferences
  const getMatchingCriteria = (match) => {
    if (!user || !match) return {};
    
    const criteria = {
      height: {
        label: 'Height',
        match: true, // Simplified - in real app, compare with user preferences
        userValue: user.height || 'Not specified',
        matchValue: match.height || 'Not specified'
      },
      age: {
        label: 'Age',
        match: true, // Simplified - in real app, compare with user preferences
        userValue: `${getAge(user.dob) || 'N/A'} years`,
        matchValue: `${getAge(match.dob) || 'N/A'} years`
      },
      maritalStatus: {
        label: 'Marital Status',
        match: match.maritalStatus === 'never_married',
        userValue: user.maritalStatus || 'Not specified',
        matchValue: match.maritalStatus || 'Not specified'
      },
      religion: {
        label: 'Religion',
        match: match.religion === user.religion,
        userValue: user.religion || 'Not specified',
        matchValue: match.religion || 'Not specified'
      },
      motherTongue: {
        label: 'Mother Tongue',
        match: true, // Simplified - in real app, compare with user preferences
        userValue: Array.isArray(user.motherTongue) ? user.motherTongue.join(', ') : user.motherTongue || 'Not specified',
        matchValue: Array.isArray(match.motherTongue) ? match.motherTongue.join(', ') : match.motherTongue || 'Not specified'
      },
      caste: {
        label: 'Caste',
        match: match.caste === user.caste,
        userValue: user.caste || 'Not specified',
        matchValue: match.caste || 'Not specified'
      },
      occupation: {
        label: 'Occupation',
        match: true, // Simplified - in real app, compare with user preferences
        userValue: user.occupation || 'Not specified',
        matchValue: match.occupation || 'Not specified'
      },
      earning: {
        label: 'Annual Income',
        match: true, // Simplified - in real app, compare with user preferences
        userValue: user.annualIncome || 'Not specified',
        matchValue: match.annualIncome || 'Not specified'
      }
    };
    
    return criteria;
  };

  const getAge = (dob) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getHeight = (height) => {
    if (!height) return null;
    return height;
  };

  const renderMatchCard = (match) => (
    <motion.div
      key={match._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        border: '1px solid #e0e0e0',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          transform: 'translateY(-2px)'
        }
      }}>
        {/* Profile Image with Photo Count */}
        <Box sx={{ position: 'relative', height: 300 }}>
          <CardMedia
            component="img"
            height="300"
            image={match.profileImage?.startsWith('http') ? match.profileImage : match.profileImage ? `http://localhost:3000/uploads/${match.profileImage}` : 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
            alt={match.name}
            sx={{ 
              cursor: 'pointer',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            onClick={() => handleViewProfile(match)}
          />
          
          {/* Photo Count Badge */}
          <Box sx={{ 
            position: 'absolute', 
            top: 12, 
            left: 12,
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: 1,
            px: 1,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}>
            <CameraAltIcon sx={{ color: 'white', fontSize: 16 }} />
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
              {match.photos?.length || Math.floor(Math.random() * 8) + 1}
            </Typography>
          </Box>

          {/* Verification Badge */}
          {(match.isEmailVerified || match.isPhoneVerified || match.isIdVerified || match.isPhotoVerified) && (
            <Box sx={{ 
              position: 'absolute', 
              top: 12, 
              right: 12,
              backgroundColor: '#4caf50',
              borderRadius: 1,
              px: 1,
              py: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}>
              <VerifiedIcon sx={{ color: 'white', fontSize: 16 }} />
              <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                Verified
              </Typography>
            </Box>
          )}

          {/* Status Badges */}
          <Box sx={{ 
            position: 'absolute', 
            bottom: 12, 
            right: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5
          }}>
            {/* Online Status */}
            {match.isOnline && (
              <Box sx={{ 
                backgroundColor: '#4caf50',
                borderRadius: 1,
                px: 1,
                py: 0.5
              }}>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                  Online
                </Typography>
              </Box>
            )}
            
            {/* Just Joined Badge */}
            {match.isJustJoined && (
              <Box sx={{ 
                backgroundColor: '#ff9800',
                borderRadius: 1,
                px: 1,
                py: 0.5
              }}>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                  Just Joined
                </Typography>
              </Box>
            )}
            
            {/* Nearby Badge */}
            {match.isNearby && (
              <Box sx={{ 
                backgroundColor: '#2196f3',
                borderRadius: 1,
                px: 1,
                py: 0.5
              }}>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                  Nearby
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
          {/* Name and Age */}
          <Typography variant="h6" sx={{ 
            fontWeight: 700, 
            color: '#333', 
            mb: 1.5,
            fontSize: '1.1rem'
          }}>
            {match.name}, {getAge(match.dob) || 'N/A'}
          </Typography>

          {/* Profile Details */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5, display: 'flex', alignItems: 'center' }}>
              <HeightIcon sx={{ fontSize: 16, mr: 1, color: '#999' }} />
              {getHeight(match.height) || 'Not specified'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5, display: 'flex', alignItems: 'center' }}>
              <LocationIcon sx={{ fontSize: 16, mr: 1, color: '#999' }} />
              {match.city || 'Location not specified'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5, display: 'flex', alignItems: 'center' }}>
              <GroupIcon sx={{ fontSize: 16, mr: 1, color: '#999' }} />
              {match.caste || 'Not specified'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5, display: 'flex', alignItems: 'center' }}>
              <WorkIcon sx={{ fontSize: 16, mr: 1, color: '#999' }} />
              {match.occupation || 'Not specified'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5, display: 'flex', alignItems: 'center' }}>
              <AttachMoneyIcon sx={{ fontSize: 16, mr: 1, color: '#999' }} />
              {match.annualIncome || 'Not specified'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5, display: 'flex', alignItems: 'center' }}>
              <SchoolIcon sx={{ fontSize: 16, mr: 1, color: '#999' }} />
              {match.education || 'Not specified'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', display: 'flex', alignItems: 'center' }}>
              <GroupIcon sx={{ fontSize: 16, mr: 1, color: '#999' }} />
              {match.maritalStatus || 'Not specified'}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              size="small"
              variant={match.hasShownInterest ? "contained" : "outlined"}
              startIcon={match.hasShownInterest ? <CheckCircleOutlineIcon /> : <FavoriteBorderIcon />}
              onClick={() => handleShowInterest(match._id)}
              disabled={match.hasShownInterest}
              sx={{
                flex: 1,
                backgroundColor: match.hasShownInterest ? '#e91e63' : 'transparent',
                borderColor: '#e91e63',
                color: match.hasShownInterest ? 'white' : '#e91e63',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: 1,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: match.hasShownInterest ? '#c2185b' : 'rgba(233, 30, 99, 0.1)'
                }
              }}
            >
              {match.hasShownInterest ? 'Interest Sent' : 'Interest'}
            </Button>
            
            <Button
              size="small"
              variant={match.hasShownSuperInterest ? "contained" : "outlined"}
              startIcon={match.hasShownSuperInterest ? <StarIcon /> : <StarBorderIcon />}
              onClick={() => handleShowSuperInterest(match._id)}
              disabled={match.hasShownSuperInterest}
              sx={{
                flex: 1,
                backgroundColor: match.hasShownSuperInterest ? '#ff9800' : 'transparent',
                borderColor: match.hasShownSuperInterest ? '#ff9800' : '#666',
                color: match.hasShownSuperInterest ? 'white' : '#666',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: 1,
                textTransform: 'none',
                '&:hover': {
                  borderColor: match.hasShownSuperInterest ? '#f57c00' : '#333',
                  backgroundColor: match.hasShownSuperInterest ? '#f57c00' : 'rgba(0,0,0,0.05)'
                }
              }}
            >
              {match.hasShownSuperInterest ? 'Super Interest Sent' : 'Super Interest'}
            </Button>
            
            <Button
              size="small"
              variant={match.isShortlisted ? "contained" : "outlined"}
              startIcon={<StarIcon />}
              sx={{
                flex: 1,
                backgroundColor: match.isShortlisted ? '#9c27b0' : 'transparent',
                borderColor: match.isShortlisted ? '#9c27b0' : '#666',
                color: match.isShortlisted ? 'white' : '#666',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: 1,
                textTransform: 'none',
                '&:hover': {
                  borderColor: match.isShortlisted ? '#7b1fa2' : '#333',
                  backgroundColor: match.isShortlisted ? '#7b1fa2' : 'rgba(0,0,0,0.05)'
                }
              }}
            >
              {match.isShortlisted ? 'Shortlisted' : 'Shortlist'}
            </Button>
            
            <Button
              size="small"
              variant="outlined"
              startIcon={<ChatIcon />}
              sx={{
                flex: 1,
                borderColor: '#666',
                color: '#666',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: 1,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#333',
                  backgroundColor: 'rgba(0,0,0,0.05)'
                }
              }}
            >
              Chat
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderProfileDialog = () => {
    if (!selectedMatch) return null;
    
    const matchingCriteria = getMatchingCriteria(selectedMatch);
    const matchCount = Object.values(matchingCriteria).filter(c => c.match).length;
    const totalCriteria = Object.keys(matchingCriteria).length;

    return (
      <Dialog 
        open={showProfileDialog} 
        onClose={() => setShowProfileDialog(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, maxHeight: '90vh' }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1
        }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>
            {selectedMatch.name}'s Profile
          </Typography>
          <IconButton onClick={() => setShowProfileDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ 
            backgroundColor: 'white', 
            borderRadius: 2, 
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            mb: 3
          }}>
            {/* Profile Header */}
            <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
              <Grid container spacing={3}>
                {/* Profile Image */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="400"
                      image={selectedMatch.profileImage?.startsWith('http') ? selectedMatch.profileImage : selectedMatch.profileImage ? `http://localhost:3000/uploads/${selectedMatch.profileImage}` : 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
                      alt={selectedMatch.name}
                      sx={{ 
                        borderRadius: 2,
                        objectFit: 'cover'
                      }}
                    />
                    
                    {/* Online Status */}
                    {selectedMatch.isOnline && (
                      <Box sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        borderRadius: 1,
                        px: 1,
                        py: 0.5
                      }}>
                        <VerifiedIcon sx={{ color: '#4caf50', fontSize: 16, mr: 0.5 }} />
                        <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                          Online
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>

                {/* Profile Info */}
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
                        {selectedMatch.name}, {getAge(selectedMatch.dob) || 'N/A'}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#666', mb: 1 }}>
                        ID - {selectedMatch.customId || generateUserId(selectedMatch)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#999' }}>
                        Profile managed by Self
                      </Typography>
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <Button
                      variant={selectedMatch.hasShownInterest ? "contained" : "outlined"}
                      startIcon={selectedMatch.hasShownInterest ? <CheckCircleOutlineIcon /> : <FavoriteBorderIcon />}
                      onClick={() => handleShowInterest(selectedMatch._id)}
                      disabled={selectedMatch.hasShownInterest}
                      sx={{
                        backgroundColor: selectedMatch.hasShownInterest ? '#e91e63' : 'transparent',
                        borderColor: '#e91e63',
                        color: selectedMatch.hasShownInterest ? 'white' : '#e91e63',
                        borderRadius: 3,
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Interest
                    </Button>
                    
                    <Button
                      variant={selectedMatch.hasShownSuperInterest ? "contained" : "outlined"}
                      startIcon={selectedMatch.hasShownSuperInterest ? <StarIcon /> : <StarBorderIcon />}
                      onClick={() => handleShowSuperInterest(selectedMatch._id)}
                      disabled={selectedMatch.hasShownSuperInterest}
                      sx={{
                        backgroundColor: selectedMatch.hasShownSuperInterest ? '#ff9800' : 'transparent',
                        borderColor: selectedMatch.hasShownSuperInterest ? '#ff9800' : '#666',
                        color: selectedMatch.hasShownSuperInterest ? 'white' : '#666',
                        borderRadius: 3,
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Super Interest
                    </Button>
                    
                    <Button
                      variant={selectedMatch.isShortlisted ? "contained" : "outlined"}
                      startIcon={<StarIcon />}
                      sx={{
                        backgroundColor: selectedMatch.isShortlisted ? '#9c27b0' : 'transparent',
                        borderColor: selectedMatch.isShortlisted ? '#9c27b0' : '#666',
                        color: selectedMatch.isShortlisted ? 'white' : '#666',
                        borderRadius: 3,
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Shortlist
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<ChatIcon />}
                      sx={{
                        borderColor: '#666',
                        color: '#666',
                        borderRadius: 3,
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Chat
                    </Button>
                  </Box>

                  {/* About Section */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>About Me</Typography>
                    <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.6, mb: 3 }}>
                      {selectedMatch.about || `I am a ${getAge(selectedMatch.dob)}-year-old ${selectedMatch.education || 'graduate'} from ${selectedMatch.city || 'my city'}, currently ${selectedMatch.occupation || 'working'}. I believe in traditional values and am looking for a partner who respects and supports my aspirations.`}
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                          <strong>Education:</strong> {selectedMatch.education || 'Not specified'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                          <strong>Career:</strong> {selectedMatch.occupation || 'Not specified'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                          <strong>Family:</strong> {selectedMatch.familyType || 'Not specified'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                          <strong>Religion:</strong> {selectedMatch.religion || 'Not specified'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Matching Criteria Section */}
            <Box sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Who is she looking for...
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                These are her desired partner qualities.
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                  <Avatar 
                    src={selectedMatch.profileImage?.startsWith('http') ? selectedMatch.profileImage : selectedMatch.profileImage ? `http://localhost:3000/uploads/${selectedMatch.profileImage}` : null} 
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    You match {matchCount}/{totalCriteria} of her preference
                  </Typography>
                </Box>
                <Avatar 
                  src={user?.profileImage?.startsWith('http') ? user.profileImage : user?.profileImage ? `http://localhost:3000/uploads/${user.profileImage}` : null} 
                  sx={{ width: 40, height: 40, backgroundColor: '#e0e0e0' }}
                />
              </Box>

              <Grid container spacing={2}>
                {Object.entries(matchingCriteria).map(([key, criteria]) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 2,
                      backgroundColor: 'white',
                      borderRadius: 1,
                      border: '1px solid #e0e0e0'
                    }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {criteria.preferred}
                        </Typography>
                      </Box>
                      {criteria.match ? (
                        <CheckIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                      ) : (
                        <CloseIcon sx={{ color: '#f44336', fontSize: 20 }} />
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Bottom Action Buttons */}
            <Box sx={{ p: 3, borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant={selectedMatch.hasShownInterest ? "contained" : "outlined"}
                  startIcon={selectedMatch.hasShownInterest ? <CheckCircleOutlineIcon /> : <FavoriteBorderIcon />}
                  onClick={() => handleShowInterest(selectedMatch._id)}
                  disabled={selectedMatch.hasShownInterest}
                  sx={{
                    backgroundColor: selectedMatch.hasShownInterest ? '#e91e63' : 'transparent',
                    borderColor: '#e91e63',
                    color: selectedMatch.hasShownInterest ? 'white' : '#e91e63',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Interest
                </Button>
                
                <Button
                  variant={selectedMatch.hasShownSuperInterest ? "contained" : "outlined"}
                  startIcon={selectedMatch.hasShownSuperInterest ? <StarIcon /> : <StarBorderIcon />}
                  onClick={() => handleShowSuperInterest(selectedMatch._id)}
                  disabled={selectedMatch.hasShownSuperInterest}
                  sx={{
                    backgroundColor: selectedMatch.hasShownSuperInterest ? '#ff9800' : 'transparent',
                    borderColor: selectedMatch.hasShownSuperInterest ? '#ff9800' : '#666',
                    color: selectedMatch.hasShownSuperInterest ? 'white' : '#666',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Super Interest
                </Button>
                
                <Button
                  variant={selectedMatch.isShortlisted ? "contained" : "outlined"}
                  startIcon={<StarIcon />}
                  sx={{
                    backgroundColor: selectedMatch.isShortlisted ? '#9c27b0' : 'transparent',
                    borderColor: selectedMatch.isShortlisted ? '#9c27b0' : '#666',
                    color: selectedMatch.isShortlisted ? 'white' : '#666',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Shortlist
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<ChatIcon />}
                  sx={{
                    borderColor: '#666',
                    color: '#666',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Chat
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    );
  };

  const renderFilters = () => (
    <Dialog 
      open={showFilters} 
      onClose={() => setShowFilters(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Filter Matches</Typography>
          <Box>
            <Button onClick={handleClearFilters} startIcon={<ClearIcon />} sx={{ mr: 1 }}>
              Clear All
            </Button>
            <IconButton onClick={() => setShowFilters(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.verified}
                  onChange={(e) => handleFilterChange('verified', e.target.checked)}
                />
              }
              label="Verified Profiles Only"
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.nearby}
                  onChange={(e) => handleFilterChange('nearby', e.target.checked)}
                />
              }
              label="Nearby Profiles Only"
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.justJoined}
                  onChange={(e) => handleFilterChange('justJoined', e.target.checked)}
                />
              }
              label="Just Joined Profiles"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom sx={{ fontWeight: 600 }}>
              Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}
            </Typography>
            <Slider
              value={filters.ageRange}
              onChange={(e, newValue) => handleFilterChange('ageRange', newValue)}
              valueLabelDisplay="auto"
              min={18}
              max={60}
              sx={{ color: '#e91e63' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Religion</InputLabel>
              <Select
                value={filters.religion}
                onChange={(e) => handleFilterChange('religion', e.target.value)}
                label="Religion"
              >
                <MenuItem value="">All Religions</MenuItem>
                <MenuItem value="Hindu">Hindu</MenuItem>
                <MenuItem value="Muslim">Muslim</MenuItem>
                <MenuItem value="Christian">Christian</MenuItem>
                <MenuItem value="Sikh">Sikh</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Caste</InputLabel>
              <Select
                value={filters.caste}
                onChange={(e) => handleFilterChange('caste', e.target.value)}
                label="Caste"
              >
                <MenuItem value="">All Castes</MenuItem>
                <MenuItem value="Brahmin">Brahmin</MenuItem>
                <MenuItem value="Patel">Patel</MenuItem>
                <MenuItem value="Gupta">Gupta</MenuItem>
                <MenuItem value="Sharma">Sharma</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Occupation</InputLabel>
              <Select
                value={filters.occupation}
                onChange={(e) => handleFilterChange('occupation', e.target.value)}
                label="Occupation"
              >
                <MenuItem value="">All Occupations</MenuItem>
                <MenuItem value="Software Engineer">Software Engineer</MenuItem>
                <MenuItem value="Doctor">Doctor</MenuItem>
                <MenuItem value="Teacher">Teacher</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              placeholder="Enter city or state"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setShowFilters(false)} sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button 
          onClick={() => setShowFilters(false)} 
          variant="contained" 
          sx={{ 
            backgroundColor: '#e91e63',
            '&:hover': {
              backgroundColor: '#c2185b'
            }
          }}
        >
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Left Sidebar - User Profile & Navigation */}
      <Box sx={{ 
        width: 280, 
        backgroundColor: '#f8f9fa', 
        borderRight: '1px solid #e0e0e0',
        minHeight: '100vh',
        p: 3
      }}>
        {/* User Profile */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Avatar
              src={user?.profileImage?.startsWith('http') ? user.profileImage : user?.profileImage ? `http://localhost:3000/uploads/${user.profileImage}` : editingProfile?.profileImage}
              sx={{ 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 2,
                backgroundColor: '#e0e0e0',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)'
                }
              }}
              onClick={handleEditProfile}
            />
            <Box sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              backgroundColor: '#e91e63',
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#c2185b',
                transform: 'scale(1.1)'
              }
            }}>
              <CameraAltIcon sx={{ color: 'white', fontSize: 14 }} />
            </Box>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', mb: 0.5 }}>
            Hi {user?.name || editingProfile?.name || 'User'}!
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
            {user?.customId || editingProfile?.customId || generateUserId(user)}
          </Typography>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={handleEditProfile}
            sx={{ 
              color: '#e91e63', 
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(233, 30, 99, 0.1)'
              }
            }}
          >
            Edit Profile
          </Button>
        </Box>

        {/* Navigation */}
        <List sx={{ mb: 4 }}>
          <ListItemButton sx={{ borderRadius: 1, mb: 1, backgroundColor: '#e91e63', color: 'white' }}>
            <ListItemIcon sx={{ color: 'white' }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Matches" />
            <KeyboardArrowRightIcon />
          </ListItemButton>
          <ListItemButton sx={{ borderRadius: 1, mb: 1 }}>
            <ListItemIcon>
              <TrendingUpIcon />
            </ListItemIcon>
            <ListItemText primary="Activity" />
            <KeyboardArrowRightIcon />
          </ListItemButton>
          <ListItemButton sx={{ borderRadius: 1, mb: 1 }}>
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary="Search" />
            <KeyboardArrowRightIcon />
          </ListItemButton>
          <ListItemButton sx={{ borderRadius: 1, mb: 1 }}>
            <ListItemIcon>
              <MessageIcon />
            </ListItemIcon>
            <ListItemText primary="Messenger" />
            <KeyboardArrowRightIcon />
          </ListItemButton>
        </List>

        {/* Upgrade Section */}
        <Box sx={{ 
          backgroundColor: 'white', 
          borderRadius: 2, 
          p: 2, 
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
            Upgrade
          </Typography>
          <Box sx={{ 
            backgroundColor: '#4caf50', 
            color: 'white', 
            borderRadius: 1, 
            px: 1, 
            py: 0.5, 
            display: 'inline-block',
            mb: 1
          }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              54% Off
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Premium Benefits
            </Typography>
            <KeyboardArrowRightIcon sx={{ color: '#666' }} />
          </Box>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, p: 3 }}>
        {/* Dynamic Content Based on View State */}
        {middleSectionView === 'matches' && renderMatchesListView()}
        {middleSectionView === 'profile-edit' && renderProfileEditView()}
        {middleSectionView === 'profile-details' && renderProfileDetailsView()}
      </Box>

      {/* Right Sidebar - Premium Benefits */}
      <Box sx={{ 
        width: 300, 
        backgroundColor: 'white', 
        borderLeft: '1px solid #e0e0e0',
        minHeight: '100vh',
        p: 3
      }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', mb: 3 }}>
          You are <span style={{ color: '#e91e63' }}>missing</span> out on the premium benefits!
        </Typography>

        <List sx={{ mb: 4 }}>
          <ListItem sx={{ px: 0, py: 1 }}>
            <ListItemIcon>
              <AttachMoneyIcon sx={{ color: '#9c27b0' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Get upto 3x more profile views"
              primaryTypographyProps={{ fontSize: '0.9rem' }}
            />
          </ListItem>
          <ListItem sx={{ px: 0, py: 1 }}>
            <ListItemIcon>
              <PhoneIcon sx={{ color: '#ff9800' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Unlimited voice & video calls"
              primaryTypographyProps={{ fontSize: '0.9rem' }}
            />
          </ListItem>
          <ListItem sx={{ px: 0, py: 1 }}>
            <ListItemIcon>
              <ContactPhoneIcon sx={{ color: '#4caf50' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Get access to contact details"
              primaryTypographyProps={{ fontSize: '0.9rem' }}
            />
          </ListItem>
          <ListItem sx={{ px: 0, py: 1 }}>
            <ListItemIcon>
              <SearchIconAlt sx={{ color: '#2196f3' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Perform unlimited searches"
              primaryTypographyProps={{ fontSize: '0.9rem' }}
            />
          </ListItem>
        </List>

        <Box sx={{ 
          backgroundColor: '#f8f9fa', 
          borderRadius: 2, 
          p: 2, 
          textAlign: 'center',
          mb: 3
        }}>
          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
            Flat 54% OFF till 17 Oct
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>
            ₹299.00
          </Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          endIcon={<ArrowForwardIcon />}
          sx={{
            backgroundColor: '#e91e63',
            '&:hover': {
              backgroundColor: '#c2185b'
            },
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5
          }}
        >
          Upgrade now
        </Button>
      </Box>
    </Box>
  );
};

export default MyMatchesPage;
