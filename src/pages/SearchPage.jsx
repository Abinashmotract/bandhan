import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  InputAdornment,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton as MuiIconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Height as HeightIcon,
  AccountBalance as AccountBalanceIcon,
  Language as LanguageIcon,
  RecordVoiceOver as VoiceIcon,
  Public as PublicIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Save as SaveIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Close as CloseIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { 
  searchProfiles, 
  getRecommendations, 
  saveSearchFilter, 
  getSavedFilters, 
  deleteSavedFilter,
  clearSearchResults 
} from '../store/slices/searchSlice';
import { showSuccess, showError } from '../utils/toast';

const SearchPage = () => {
  const dispatch = useDispatch();
  const { searchResults, recommendations, savedFilters, loading, error } = useSelector(state => state.search);
  
  const [searchCriteria, setSearchCriteria] = useState({
    gender: 'female',
    ageMin: 21,
    ageMax: 35,
    heightMin: 122,
    heightMax: 213,
    religion: '',
    caste: '',
    education: '',
    location: '',
    occupation: '',
    annualIncome: ''
  });
  
  const [profileId, setProfileId] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showSavedFilters, setShowSavedFilters] = useState(false);
  const [saveFilterDialog, setSaveFilterDialog] = useState(false);
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    // Load saved filters on component mount
    dispatch(getSavedFilters());
    // Load recommendations
    dispatch(getRecommendations({ limit: 10 }));
  }, [dispatch]);

  const handleChange = (field, value) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setSearchCriteria({
      gender: 'female',
      ageMin: 21,
      ageMax: 35,
      heightMin: 122,
      heightMax: 213,
      religion: '',
      caste: '',
      education: '',
      location: '',
      occupation: '',
      annualIncome: ''
    });
    setProfileId('');
    setShowResults(false);
    dispatch(clearSearchResults());
  };

  const handleSearch = async () => {
    try {
      const filters = { ...searchCriteria };
      // Remove empty values
      Object.keys(filters).forEach(key => {
        if (filters[key] === '' || filters[key] === null || filters[key] === undefined) {
          delete filters[key];
        }
      });
      
      await dispatch(searchProfiles(filters)).unwrap();
      setShowResults(true);
      showSuccess('Search completed successfully!');
    } catch (error) {
      showError(error || 'Search failed. Please try again.');
    }
  };

  const handleSearchByProfileId = async () => {
    if (!profileId.trim()) {
      showError('Please enter a profile ID');
      return;
    }
    
    try {
      await dispatch(searchProfiles({ profileId: profileId.trim() })).unwrap();
      setShowResults(true);
      showSuccess('Profile search completed!');
    } catch (error) {
      showError(error || 'Profile not found. Please check the ID.');
    }
  };

  const handleSaveFilter = async () => {
    if (!filterName.trim()) {
      showError('Please enter a filter name');
      return;
    }
    
    try {
      await dispatch(saveSearchFilter({
        name: filterName,
        filters: searchCriteria
      })).unwrap();
      setSaveFilterDialog(false);
      setFilterName('');
      showSuccess('Search filter saved successfully!');
    } catch (error) {
      showError(error || 'Failed to save filter');
    }
  };

  const handleDeleteFilter = async (filterId) => {
    try {
      await dispatch(deleteSavedFilter(filterId)).unwrap();
      showSuccess('Filter deleted successfully!');
    } catch (error) {
      showError(error || 'Failed to delete filter');
    }
  };

  const handleLoadFilter = (filter) => {
    setSearchCriteria(filter.filters);
    setSaveFilterDialog(false);
    showSuccess('Filter loaded successfully!');
  };

  const religions = [
    'Doesn\'t Matter', 'Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Other'
  ];

  const languages = [
    'Doesn\'t Matter', 'Hindi', 'English', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 
    'Gujarati', 'Punjabi', 'Malayalam', 'Kannada', 'Other'
  ];

  const countries = [
    'Doesn\'t Matter', 'India', 'USA', 'UK', 'Canada', 'Australia', 'UAE', 'Other'
  ];

  const residentialStatuses = [
    'Doesn\'t Matter', 'Citizen', 'Permanent Resident', 'Work Visa', 'Student Visa', 'Other'
  ];

  // Convert cm to feet and inches
  const cmToFeet = (cm) => {
    const feet = Math.floor(cm / 30.48);
    const inches = Math.round((cm % 30.48) / 2.54);
    return `${feet}' ${inches}" (${cm} cm)`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ 
        color: '#51365F', 
        fontWeight: 700, 
        mb: 3,
        textAlign: 'center'
      }}>
        Find Your Perfect Match
      </Typography>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        {/* Search by Profile ID */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ 
            color: '#37474f', 
            fontWeight: 600, 
            mb: 2,
            display: 'flex',
            alignItems: 'center'
          }}>
            <SearchIcon sx={{ mr: 1, color: '#51365F' }} />
            Search by Profile ID
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              placeholder="Enter Profile ID"
              variant="outlined"
              size="small"
              value={profileId}
              onChange={(e) => setProfileId(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#51365F',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearchByProfileId}
              disabled={loading}
              sx={{
                borderRadius: 2,
                px: 3,
                background: '#51365F',
                fontWeight: 'bold',
                '&:hover': {
                  background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)'
                }
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Search'}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Search Criteria */}
        <Typography variant="h6" sx={{ 
          color: '#37474f', 
          fontWeight: 600, 
          mb: 3,
          display: 'flex',
          alignItems: 'center'
        }}>
          <SearchIcon sx={{ mr: 1, color: '#51365F' }} />
          Search Criteria
        </Typography>

        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            {/* Search For */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 1, fontWeight: 600 }}>
                Search for
              </Typography>
              <RadioGroup
                row
                value={searchCriteria.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
              >
                <FormControlLabel 
                  value="female" 
                  control={<Radio sx={{ color: '#51365F', '&.Mui-checked': { color: '#51365F' } }} />} 
                  label="Bride" 
                />
                <FormControlLabel 
                  value="male" 
                  control={<Radio sx={{ color: '#51365F', '&.Mui-checked': { color: '#51365F' } }} />} 
                  label="Groom" 
                />
              </RadioGroup>
            </Box>

            {/* Age Range */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 2, fontWeight: 600 }}>
                Age Range
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Min Age"
                  type="number"
                  size="small"
                  value={searchCriteria.ageMin}
                  onChange={(e) => handleChange('ageMin', parseInt(e.target.value) || 18)}
                  inputProps={{ min: 18, max: 60 }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Max Age"
                  type="number"
                  size="small"
                  value={searchCriteria.ageMax}
                  onChange={(e) => handleChange('ageMax', parseInt(e.target.value) || 60)}
                  inputProps={{ min: 18, max: 60 }}
                  sx={{ flex: 1 }}
                />
              </Box>
            </Box>

            {/* Height Range */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <HeightIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#51365F' }} />
                Height Range (cm)
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Min Height"
                  type="number"
                  size="small"
                  value={searchCriteria.heightMin}
                  onChange={(e) => handleChange('heightMin', parseInt(e.target.value) || 122)}
                  inputProps={{ min: 122, max: 213 }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Max Height"
                  type="number"
                  size="small"
                  value={searchCriteria.heightMax}
                  onChange={(e) => handleChange('heightMax', parseInt(e.target.value) || 213)}
                  inputProps={{ min: 122, max: 213 }}
                  sx={{ flex: 1 }}
                />
              </Box>
            </Box>

            {/* Reset Button */}
            <Button
              startIcon={<ClearIcon />}
              onClick={handleReset}
              sx={{
                color: '#51365F',
                borderColor: '#51365F',
                '&:hover': {
                  borderColor: '#51365F',
                  backgroundColor: 'rgba(216, 27, 96, 0.04)'
                }
              }}
              variant="outlined"
            >
              Remove all filters
            </Button>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            {/* Religion */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <AccountBalanceIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#51365F' }} />
                Religion
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={searchCriteria.religion}
                  onChange={(e) => handleChange('religion', e.target.value)}
                  displayEmpty
                  sx={{
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#51365F',
                    },
                  }}
                >
                  <MenuItem value="">All Religions</MenuItem>
                  {religions.filter(r => r !== 'Doesn\'t Matter').map((religion) => (
                    <MenuItem key={religion} value={religion.toLowerCase()}>{religion}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Location */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <PublicIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#51365F' }} />
                Location
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter city or state"
                value={searchCriteria.location}
                onChange={(e) => handleChange('location', e.target.value)}
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#51365F',
                    },
                  },
                }}
              />
            </Box>

            {/* Education */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <VoiceIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#51365F' }} />
                Education
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter education level"
                value={searchCriteria.education}
                onChange={(e) => handleChange('education', e.target.value)}
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#51365F',
                    },
                  },
                }}
              />
            </Box>

            {/* Occupation */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <LanguageIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#51365F' }} />
                Occupation
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter occupation"
                value={searchCriteria.occupation}
                onChange={(e) => handleChange('occupation', e.target.value)}
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#51365F',
                    },
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Search Buttons */}
        <Box sx={{ textAlign: 'center', mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={loading}
            sx={{
              py: 1.5,
              px: 6,
              borderRadius: 2,
              background: '#51365F',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              '&:hover': {
                background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)',
              }
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Search Matches'}
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            startIcon={<SaveIcon />}
            onClick={() => setSaveFilterDialog(true)}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 2,
              borderColor: '#51365F',
              color: '#51365F',
              fontWeight: 'bold',
              '&:hover': {
                borderColor: '#51365F',
                backgroundColor: 'rgba(216, 27, 96, 0.04)'
              }
            }}
          >
            Save Filter
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            startIcon={<BookmarkBorderIcon />}
            onClick={() => setShowSavedFilters(true)}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 2,
              borderColor: '#51365F',
              color: '#51365F',
              fontWeight: 'bold',
              '&:hover': {
                borderColor: '#51365F',
                backgroundColor: 'rgba(216, 27, 96, 0.04)'
              }
            }}
          >
            Saved Filters
          </Button>
        </Box>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mt: 4 }}>
          <Typography variant="h5" sx={{ color: '#37474f', mb: 3, fontWeight: 600 }}>
            Search Results ({searchResults.length} profiles found)
          </Typography>
          <Grid container spacing={3}>
            {searchResults.map((profile) => (
              <Grid item xs={12} sm={6} md={4} key={profile._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={profile.profileImage || '/api/placeholder/300/200'}
                    alt={profile.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {profile.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {profile.age} years • {profile.height} • {profile.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {profile.religion} • {profile.education}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {profile.about?.substring(0, 100)}...
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<FavoriteBorderIcon />}
                      sx={{ flex: 1, borderColor: '#51365F', color: '#51365F' }}
                      variant="outlined"
                    >
                      Like
                    </Button>
                    <Button
                      size="small"
                      startIcon={<StarBorderIcon />}
                      sx={{ flex: 1, borderColor: '#51365F', color: '#51365F' }}
                      variant="outlined"
                    >
                      Super Like
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && !showResults && (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mt: 4 }}>
          <Typography variant="h5" sx={{ color: '#37474f', mb: 3, fontWeight: 600 }}>
            Recommended Matches
          </Typography>
          <Grid container spacing={3}>
            {recommendations.slice(0, 6).map((profile) => (
              <Grid item xs={12} sm={6} md={4} key={profile._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={profile.profileImage || '/api/placeholder/300/200'}
                    alt={profile.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {profile.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {profile.age} years • {profile.height} • {profile.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {profile.religion} • {profile.education}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<FavoriteBorderIcon />}
                      sx={{ flex: 1, borderColor: '#51365F', color: '#51365F' }}
                      variant="outlined"
                    >
                      Like
                    </Button>
                    <Button
                      size="small"
                      startIcon={<StarBorderIcon />}
                      sx={{ flex: 1, borderColor: '#51365F', color: '#51365F' }}
                      variant="outlined"
                    >
                      Super Like
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Save Filter Dialog */}
      <Dialog open={saveFilterDialog} onClose={() => setSaveFilterDialog(false)}>
        <DialogTitle>Save Search Filter</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Filter Name"
            fullWidth
            variant="outlined"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveFilterDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveFilter} variant="contained" sx={{ background: '#51365F' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Saved Filters Dialog */}
      <Dialog 
        open={showSavedFilters} 
        onClose={() => setShowSavedFilters(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Saved Search Filters</DialogTitle>
        <DialogContent>
          {savedFilters.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No saved filters found.
            </Typography>
          ) : (
            <List>
              {savedFilters.map((filter) => (
                <ListItem key={filter._id}>
                  <ListItemText
                    primary={filter.name}
                    secondary={`Created: ${new Date(filter.createdAt).toLocaleDateString()}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleLoadFilter(filter)}
                      sx={{ color: '#51365F', mr: 1 }}
                    >
                      <SearchIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteFilter(filter._id)}
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSavedFilters(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SearchPage;