import React, { useState } from 'react';
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
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Height as HeightIcon,
  AccountBalance as AccountBalanceIcon,
  Language as LanguageIcon,
  RecordVoiceOver as VoiceIcon,
  Public as PublicIcon
} from '@mui/icons-material';

const SearchPage = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    searchFor: 'Bride',
    ageRange: [21, 35],
    heightRange: [122, 213], // in cm
    religion: 'Doesn\'t Matter',
    motherTongue: 'Doesn\'t Matter',
    country: 'Doesn\'t Matter',
    residentialStatus: 'Doesn\'t Matter',
    incomeRange: [0, 25000]
  });

  const handleChange = (field, value) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setSearchCriteria({
      searchFor: 'Bride',
      ageRange: [21, 35],
      heightRange: [122, 213],
      religion: 'Doesn\'t Matter',
      motherTongue: 'Doesn\'t Matter',
      country: 'Doesn\'t Matter',
      residentialStatus: 'Doesn\'t Matter',
      incomeRange: [0, 25000]
    });
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
        color: '#C8A2C8', 
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
            <SearchIcon sx={{ mr: 1, color: '#d81b60' }} />
            Search by Profile ID
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              placeholder="Enter Profile ID"
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#d81b60',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                borderRadius: 2,
                px: 3,
                background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                fontWeight: 'bold',
                '&:hover': {
                  background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)'
                }
              }}
            >
              Search
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
          <SearchIcon sx={{ mr: 1, color: '#d81b60' }} />
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
                value={searchCriteria.searchFor}
                onChange={(e) => handleChange('searchFor', e.target.value)}
              >
                <FormControlLabel 
                  value="Bride" 
                  control={<Radio sx={{ color: '#d81b60', '&.Mui-checked': { color: '#d81b60' } }} />} 
                  label="Bride" 
                />
                <FormControlLabel 
                  value="Groom" 
                  control={<Radio sx={{ color: '#d81b60', '&.Mui-checked': { color: '#d81b60' } }} />} 
                  label="Groom" 
                />
              </RadioGroup>
            </Box>

            {/* Age Range */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 2, fontWeight: 600 }}>
                Age
              </Typography>
              <Slider
                value={searchCriteria.ageRange}
                onChange={(e, newValue) => handleChange('ageRange', newValue)}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value} years`}
                min={18}
                max={60}
                sx={{
                  color: '#d81b60',
                  '& .MuiSlider-valueLabel': {
                    backgroundColor: '#d81b60'
                  }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Chip 
                  label={`${searchCriteria.ageRange[0]} years`} 
                  variant="outlined" 
                  sx={{ borderColor: '#d81b60', color: '#d81b60' }}
                />
                <Chip 
                  label={`${searchCriteria.ageRange[1]} years`} 
                  variant="outlined" 
                  sx={{ borderColor: '#d81b60', color: '#d81b60' }}
                />
              </Box>
            </Box>

            {/* Height Range */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <HeightIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#d81b60' }} />
                Height
              </Typography>
              <Slider
                value={searchCriteria.heightRange}
                onChange={(e, newValue) => handleChange('heightRange', newValue)}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => cmToFeet(value)}
                min={122}
                max={213}
                sx={{
                  color: '#d81b60',
                  '& .MuiSlider-valueLabel': {
                    backgroundColor: '#d81b60'
                  }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Chip 
                  label={cmToFeet(searchCriteria.heightRange[0])} 
                  variant="outlined" 
                  sx={{ borderColor: '#d81b60', color: '#d81b60', fontSize: '0.75rem' }}
                />
                <Chip 
                  label={cmToFeet(searchCriteria.heightRange[1])} 
                  variant="outlined" 
                  sx={{ borderColor: '#d81b60', color: '#d81b60', fontSize: '0.75rem' }}
                />
              </Box>
            </Box>

            {/* Reset Button */}
            <Button
              startIcon={<ClearIcon />}
              onClick={handleReset}
              sx={{
                color: '#d81b60',
                borderColor: '#d81b60',
                '&:hover': {
                  borderColor: '#d81b60',
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
                <AccountBalanceIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#d81b60' }} />
                Religion
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={searchCriteria.religion}
                  onChange={(e) => handleChange('religion', e.target.value)}
                  sx={{
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d81b60',
                    },
                  }}
                >
                  {religions.map((religion) => (
                    <MenuItem key={religion} value={religion}>{religion}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Mother Tongue */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <VoiceIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#d81b60' }} />
                Mother Tongue
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={searchCriteria.motherTongue}
                  onChange={(e) => handleChange('motherTongue', e.target.value)}
                  sx={{
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d81b60',
                    },
                  }}
                >
                  {languages.map((language) => (
                    <MenuItem key={language} value={language}>{language}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Country */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <PublicIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#d81b60' }} />
                Country
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={searchCriteria.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  sx={{
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d81b60',
                    },
                  }}
                >
                  {countries.map((country) => (
                    <MenuItem key={country} value={country}>{country}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Residential Status */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <LanguageIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#d81b60' }} />
                Residential Status
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={searchCriteria.residentialStatus}
                  onChange={(e) => handleChange('residentialStatus', e.target.value)}
                  sx={{
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d81b60',
                    },
                  }}
                >
                  {residentialStatuses.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Income Range */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 2, fontWeight: 600 }}>
                Annual Income (₹)
              </Typography>
              <Slider
                value={searchCriteria.incomeRange}
                onChange={(e, newValue) => handleChange('incomeRange', newValue)}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
                min={0}
                max={1000000}
                step={50000}
                sx={{
                  color: '#d81b60',
                  '& .MuiSlider-valueLabel': {
                    backgroundColor: '#d81b60'
                  }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Chip 
                  label={`₹${searchCriteria.incomeRange[0].toLocaleString()}`} 
                  variant="outlined" 
                  sx={{ borderColor: '#d81b60', color: '#d81b60' }}
                />
                <Chip 
                  label={`₹${searchCriteria.incomeRange[1].toLocaleString()}+`} 
                  variant="outlined" 
                  sx={{ borderColor: '#d81b60', color: '#d81b60' }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Search Button */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<SearchIcon />}
            sx={{
              py: 1.5,
              px: 6,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              '&:hover': {
                background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)',
              }
            }}
          >
            Search Matches
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SearchPage;