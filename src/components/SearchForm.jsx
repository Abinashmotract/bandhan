import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Height as HeightIcon,
  AccountBalance as AccountBalanceIcon,
  Clear as ClearIcon,
  Check as CheckIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const SearchForm = ({ 
  searchCriteria, 
  onCriteriaChange, 
  onSearch, 
  onSavePreferences, 
  onLoadPreferences, 
  onResetCriteria,
  loading 
}) => {
  return (
    <Box>
      <Typography variant="h4" sx={{ 
        color: '#51365F', 
        fontWeight: 700, 
        mb: 2,
      }}>
        Search by Criteria
      </Typography>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            {/* Search For */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 1, fontWeight: 600 }}>
                Search for
              </Typography>
              <FormControl component="fieldset">
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControlLabel 
                    control={
                      <Checkbox 
                        checked={searchCriteria.gender === 'female'}
                        onChange={() => onCriteriaChange('gender', 'female')}
                        sx={{ color: '#51365F', '&.Mui-checked': { color: '#51365F' } }}
                      />
                    } 
                    label="Bride" 
                  />
                  <FormControlLabel 
                    control={
                      <Checkbox 
                        checked={searchCriteria.gender === 'male'}
                        onChange={() => onCriteriaChange('gender', 'male')}
                        sx={{ color: '#51365F', '&.Mui-checked': { color: '#51365F' } }}
                      />
                    } 
                    label="Groom" 
                  />
                </Box>
              </FormControl>
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
                  onChange={(e) => onCriteriaChange('ageMin', parseInt(e.target.value) || 18)}
                  inputProps={{ min: 18, max: 60 }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Max Age"
                  type="number"
                  size="small"
                  value={searchCriteria.ageMax}
                  onChange={(e) => onCriteriaChange('ageMax', parseInt(e.target.value) || 60)}
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
                  onChange={(e) => onCriteriaChange('heightMin', parseInt(e.target.value) || 122)}
                  inputProps={{ min: 122, max: 213 }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Max Height"
                  type="number"
                  size="small"
                  value={searchCriteria.heightMax}
                  onChange={(e) => onCriteriaChange('heightMax', parseInt(e.target.value) || 213)}
                  inputProps={{ min: 122, max: 213 }}
                  sx={{ flex: 1 }}
                />
              </Box>
            </Box>

            {/* Reset Button */}
            <Button
              startIcon={<ClearIcon />}
              onClick={onResetCriteria}
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
              Reset Filters
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
                  onChange={(e) => onCriteriaChange('religion', e.target.value)}
                  displayEmpty
                  sx={{
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#51365F',
                    },
                  }}
                >
                  <MenuItem value="">All Religions</MenuItem>
                  <MenuItem value="hindu">Hindu</MenuItem>
                  <MenuItem value="muslim">Muslim</MenuItem>
                  <MenuItem value="christian">Christian</MenuItem>
                  <MenuItem value="sikh">Sikh</MenuItem>
                  <MenuItem value="jain">Jain</MenuItem>
                  <MenuItem value="buddhist">Buddhist</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Location */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#51365F' }} />
                Location
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter city or state"
                value={searchCriteria.location}
                onChange={(e) => onCriteriaChange('location', e.target.value)}
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
                <SchoolIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#51365F' }} />
                Education
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter education level"
                value={searchCriteria.education}
                onChange={(e) => onCriteriaChange('education', e.target.value)}
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
                <WorkIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#51365F' }} />
                Occupation
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter occupation"
                value={searchCriteria.occupation}
                onChange={(e) => onCriteriaChange('occupation', e.target.value)}
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
            onClick={onSearch}
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
            startIcon={<CheckIcon />}
            onClick={onSavePreferences}
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
            Save Preferences
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            startIcon={<EditIcon />}
            onClick={onLoadPreferences}
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
            Load Preferences
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SearchForm;
