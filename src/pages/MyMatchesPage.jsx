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
import { generateSampleProfiles, generateMatchingCriteria } from '../utils/mockData';

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
  const [sampleProfiles, setSampleProfiles] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    loadMatches();
    loadInterestLimits();
  }, []);

  useEffect(() => {
    dispatch(applyFilters());
  }, [matches, filters, searchTerm, sortBy, dispatch]);

  const loadMatches = async () => {
    try {
      // Generate sample profiles if not already loaded
      if (!isDataLoaded) {
        const profiles = generateSampleProfiles(20);
        setSampleProfiles(profiles);
        setIsDataLoaded(true);
        
        // Update Redux state with sample data
        dispatch({
          type: 'matches/fetchMatches/fulfilled',
          payload: { data: profiles }
        });
      } else {
        // Use existing sample profiles
        dispatch({
          type: 'matches/fetchMatches/fulfilled',
          payload: { data: sampleProfiles }
        });
      }
    } catch (error) {
      console.error('Error loading matches:', error);
      showError('Failed to load matches');
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

  const handleViewProfile = (match) => {
    setSelectedMatch(match);
    setShowProfileDialog(true);
  };

  const handleFilterChange = (filterName, value) => {
    dispatch(setFilters({ [filterName]: value }));
  };

  const handleSearchChange = (value) => {
    dispatch(setSearchTerm(value));
  };

  const handleSortChange = (value) => {
    dispatch(setSortBy(value));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  // Generate unique user ID like Jeevansathi (e.g., TYXX0117)
  const generateUserId = (user) => {
    if (user?.customId) return user.customId;
    
    // Generate a Jeevansathi-style ID
    const prefix = 'TYXX';
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    return `${prefix}${randomNum}`;
  };

  // Mock matching criteria - in real app, this would come from backend
  const getMatchingCriteria = (match) => {
    return generateMatchingCriteria(match);
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
            image={match.profileImage || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
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
          {match.isVerified && (
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

          {/* Online Status */}
          {match.isOnline && (
            <Box sx={{ 
              position: 'absolute', 
              bottom: 12, 
              right: 12,
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
                      image={selectedMatch.profileImage || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
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
                    src={selectedMatch.profileImage} 
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    You match {matchCount}/{totalCriteria} of her preference
                  </Typography>
                </Box>
                <Avatar 
                  src={user?.profileImage} 
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
          <Avatar
            src={user?.profileImage}
            sx={{ 
              width: 80, 
              height: 80, 
              mx: 'auto', 
              mb: 2,
              backgroundColor: '#e0e0e0'
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', mb: 0.5 }}>
            Hi {user?.name || 'User'}!
          </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
              {user?.customId || generateUserId(user)}
            </Typography>
          <Button
            size="small"
            startIcon={<EditIcon />}
            sx={{ 
              color: '#e91e63', 
              textTransform: 'none',
              fontWeight: 600
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
              variant="outlined"
              sx={{
                borderColor: '#e0e0e0',
                color: '#666',
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Verified
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#e0e0e0',
                color: '#666',
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Just Joined
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#e0e0e0',
                color: '#666',
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Nearby
            </Button>
          </Box>
        </Box>

        {/* Matches Grid */}
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card sx={{ height: '100%' }}>
                  <Skeleton variant="rectangular" height={300} />
                  <CardContent>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" height={24} />
                    <Skeleton variant="text" height={24} />
                    <Skeleton variant="text" height={24} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <AnimatePresence>
              {filteredMatches.map((match) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={match._id}>
                  {renderMatchCard(match)}
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        )}

        {/* No Results */}
        {!loading && filteredMatches.length === 0 && (
          <Paper elevation={2} sx={{ p: 8, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h5" sx={{ color: '#333', mb: 2, fontWeight: 600 }}>
              No matches found
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
              Try adjusting your filters or search terms to see more profiles.
            </Typography>
            <Button
              variant="contained"
              onClick={handleClearFilters}
              sx={{
                backgroundColor: '#e91e63',
                '&:hover': {
                  backgroundColor: '#c2185b'
                }
              }}
            >
              Clear All Filters
            </Button>
          </Paper>
        )}
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
          <ListItem sx={{ px: 0, mb: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                backgroundColor: '#9c27b0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <PersonIcon sx={{ color: 'white', fontSize: 20 }} />
              </Box>
            </ListItemIcon>
            <ListItemText 
              primary="Get upto 3x more profile views"
              primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}
            />
          </ListItem>

          <ListItem sx={{ px: 0, mb: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                backgroundColor: '#ff9800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <PhoneIcon sx={{ color: 'white', fontSize: 20 }} />
              </Box>
            </ListItemIcon>
            <ListItemText 
              primary="Unlimited voice & video calls"
              primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}
            />
          </ListItem>

          <ListItem sx={{ px: 0, mb: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                backgroundColor: '#4caf50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ContactPhoneIcon sx={{ color: 'white', fontSize: 20 }} />
              </Box>
            </ListItemIcon>
            <ListItemText 
              primary="Get access to contact details"
              primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}
            />
          </ListItem>

          <ListItem sx={{ px: 0, mb: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                backgroundColor: '#2196f3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <SearchIconAlt sx={{ color: 'white', fontSize: 20 }} />
              </Box>
            </ListItemIcon>
            <ListItemText 
              primary="Perform unlimited searches"
              primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}
            />
          </ListItem>
        </List>

        <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
          Flat 54% OFF till 17 Oct
        </Typography>

        <Button
          variant="contained"
          fullWidth
          endIcon={<ArrowForwardIcon />}
          sx={{
            backgroundColor: '#e91e63',
            '&:hover': {
              backgroundColor: '#c2185b'
            },
            fontWeight: 700,
            py: 1.5,
            borderRadius: 2
          }}
        >
          Upgrade now
        </Button>
      </Box>

      {/* Dialogs */}
      {renderProfileDialog()}
      {renderFilters()}
    </Box>
  );
};

export default MyMatchesPage;