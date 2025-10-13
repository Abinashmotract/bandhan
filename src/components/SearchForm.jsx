import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Chip,
  OutlinedInput,
  Divider,
  Tabs,
  Tab
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
  Edit as EditIcon,
  Language as LanguageIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import {
  MARITAL_STATUS_OPTIONS,
  RELIGION_OPTIONS,
  MOTHER_TONGUE_OPTIONS,
  EDUCATION_OPTIONS,
  COUNTRY_OPTIONS,
  STATE_OPTIONS,
  COMPREHENSIVE_INDUSTRY_OPTIONS,
  HEIGHT_OPTIONS,
  AGE_OPTIONS,
  getCasteOptions,
  getSubCasteOptions,
  getCityOptions
} from '../utils/options/comprehensiveOptions';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`search-tabpanel-${index}`}
      aria-labelledby={`search-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SearchForm = ({ searchCriteria, onCriteriaChange, onSearch, onSavePreferences, onLoadPreferences, onResetCriteria, loading }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [availableCastes, setAvailableCastes] = useState([]);
  const [availableSubCastes, setAvailableSubCastes] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Update dependent options when religion changes
  useEffect(() => {
    if (searchCriteria.religion) {
      const castes = getCasteOptions(searchCriteria.religion);
      setAvailableCastes(castes);
      // Reset caste and subcaste when religion changes
      onCriteriaChange('caste', '');
      onCriteriaChange('subCaste', '');
    } else {
      setAvailableCastes([]);
      setAvailableSubCastes([]);
    }
  }, [searchCriteria.religion]);

  // Update subcaste options when caste changes
  useEffect(() => {
    if (searchCriteria.religion && searchCriteria.caste) {
      const subCastes = getSubCasteOptions(searchCriteria.religion, searchCriteria.caste);
      setAvailableSubCastes(subCastes);
      onCriteriaChange('subCaste', '');
    } else {
      setAvailableSubCastes([]);
    }
  }, [searchCriteria.caste, searchCriteria.religion]);

  // Update city options when state changes
  useEffect(() => {
    if (searchCriteria.state) {
      const cities = getCityOptions(searchCriteria.state);
      setAvailableCities(cities);
      onCriteriaChange('city', '');
    } else {
      setAvailableCities([]);
    }
  }, [searchCriteria.state]);

  const handleMultipleSelectChange = (field, value) => {
    onCriteriaChange(field, value);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ color: '#51365F', fontWeight: 700, mb: 2 }}>
        Search by Criteria
      </Typography>

      <Paper elevation={2} sx={{ borderRadius: 3, mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                minHeight: '60px',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              },
              '& .Mui-selected': {
                color: '#51365F !important',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#51365F',
                height: 3
              }
            }}
            variant="fullWidth"
          >
            <Tab icon={<SearchIcon />} iconPosition="start" label="Search by Criteria" />
            <Tab icon={<PersonIcon />} iconPosition="start" label="Search by Profile ID" />
          </Tabs>
        </Box>

        {/* Tab 1: Search by Criteria */}
        <TabPanel value={tabIndex} index={0}>
          <Box sx={{ px: 3 }}>
            <Grid container spacing={4}>
              <Grid size={12}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 2, fontWeight: 600 }}>
                    Age
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Min Age</InputLabel>
                      <Select value={searchCriteria.ageMin || ''} label="Min Age" onChange={(e) => onCriteriaChange('ageMin', e.target.value)}>
                        <MenuItem value="">Doesn't Matter</MenuItem>
                        {AGE_OPTIONS.map(age => (
                          <MenuItem key={age.value} value={age.value}>
                            {age.label} Years
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth size="small">
                      <InputLabel>Max Age</InputLabel>
                      <Select
                        value={searchCriteria.ageMax || ''}
                        label="Max Age"
                        onChange={(e) => onCriteriaChange('ageMax', e.target.value)}
                      >
                        <MenuItem value="">Doesn't Matter</MenuItem>
                        {AGE_OPTIONS.map(age => (
                          <MenuItem key={age.value} value={age.value}>
                            {age.label} Years
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Grid>
              <Grid size={12}>
                {/* Height Range */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <HeightIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#51365F' }} />
                    Height
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Min Height</InputLabel>
                      <Select
                        value={searchCriteria.heightMin || ''}
                        label="Min Height"
                        onChange={(e) => onCriteriaChange('heightMin', e.target.value)}
                      >
                        <MenuItem value="">Doesn't Matter</MenuItem>
                        {HEIGHT_OPTIONS.map(height => (
                          <MenuItem key={height.value} value={height.value}>
                            {height.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth size="small">
                      <InputLabel>Max Height</InputLabel>
                      <Select
                        value={searchCriteria.heightMax || ''}
                        label="Max Height"
                        onChange={(e) => onCriteriaChange('heightMax', e.target.value)}
                      >
                        <MenuItem value="">Doesn't Matter</MenuItem>
                        {HEIGHT_OPTIONS.map(height => (
                          <MenuItem key={height.value} value={height.value}>
                            {height.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Grid>
              <Grid size={12}>
                {/* Marital Status - Multiple Select */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 1, fontWeight: 600 }}>
                    Marital Status
                  </Typography>
                  <FormControl fullWidth size="small">
                    <InputLabel>Marital Status</InputLabel>
                    <Select
                      multiple
                      value={searchCriteria.maritalStatus || []}
                      onChange={(e) => handleMultipleSelectChange('maritalStatus', e.target.value)}
                      input={<OutlinedInput label="Marital Status" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {MARITAL_STATUS_OPTIONS.map((status) => (
                        <MenuItem key={status} value={status}>
                          <Checkbox checked={searchCriteria.maritalStatus?.indexOf(status) > -1} />
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid size={12}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <AccountBalanceIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#51365F' }} />
                    Religion
                  </Typography>
                  <FormControl fullWidth size="small">
                    <InputLabel>Religion</InputLabel>
                    <Select
                      value={searchCriteria.religion || ''}
                      label="Religion"
                      onChange={(e) => onCriteriaChange('religion', e.target.value)}
                    >
                      <MenuItem value="">Doesn't Matter</MenuItem>
                      {RELIGION_OPTIONS.map(religion => (
                        <MenuItem key={religion} value={religion.toLowerCase()}>
                          {religion}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid size={12}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 1, fontWeight: 600 }}>
                    Caste
                  </Typography>
                  <FormControl fullWidth size="small">
                    <InputLabel>Caste</InputLabel>
                    <Select
                      value={searchCriteria.caste || ''}
                      label="Caste"
                      onChange={(e) => onCriteriaChange('caste', e.target.value)}
                      disabled={!searchCriteria.religion}
                    >
                      <MenuItem value="">Doesn't Matter</MenuItem>
                      {availableCastes.map(caste => (
                        <MenuItem key={caste.value} value={caste.value}>
                          {caste.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              {/* Right Column */}
              <Grid size={12}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 1, fontWeight: 600 }}>
                    Country
                  </Typography>
                  <FormControl fullWidth size="small">
                    <InputLabel>Country</InputLabel>
                    <Select
                      value={searchCriteria.country || ''}
                      label="Country"
                      onChange={(e) => onCriteriaChange('country', e.target.value)}
                    >
                      <MenuItem value="">Doesn't Matter</MenuItem>
                      {COUNTRY_OPTIONS.map(country => (
                        <MenuItem key={country} value={country}>
                          {country}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* State */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 1, fontWeight: 600 }}>
                    State
                  </Typography>
                  <FormControl fullWidth size="small">
                    <InputLabel>State</InputLabel>
                    <Select
                      value={searchCriteria.state || ''}
                      label="State"
                      onChange={(e) => onCriteriaChange('state', e.target.value)}
                    >
                      <MenuItem value="">Doesn't Matter</MenuItem>
                      {STATE_OPTIONS.map(state => (
                        <MenuItem key={state.value} value={state.value}>
                          {state.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* City */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <LocationIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#51365F' }} />
                    City
                  </Typography>
                  <FormControl fullWidth size="small">
                    <InputLabel>City</InputLabel>
                    <Select
                      value={searchCriteria.city || ''}
                      label="City"
                      onChange={(e) => onCriteriaChange('city', e.target.value)}
                      disabled={!searchCriteria.state}
                    >
                      <MenuItem value="">Doesn't Matter</MenuItem>
                      {availableCities.map(city => (
                        <MenuItem key={city.value} value={city.value}>
                          {city.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Mother Tongue - Multiple Select */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <LanguageIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#51365F' }} />
                    Mother Tongue
                  </Typography>
                  <FormControl fullWidth size="small">
                    <InputLabel>Mother Tongue</InputLabel>
                    <Select
                      multiple
                      value={searchCriteria.motherTongue || []}
                      onChange={(e) => handleMultipleSelectChange('motherTongue', e.target.value)}
                      input={<OutlinedInput label="Mother Tongue" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {MOTHER_TONGUE_OPTIONS.map((language) => (
                        <MenuItem key={language} value={language}>
                          <Checkbox checked={searchCriteria.motherTongue?.indexOf(language) > -1} />
                          {language}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Education */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <SchoolIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#51365F' }} />
                    Education
                  </Typography>
                  <FormControl fullWidth size="small">
                    <InputLabel>Education</InputLabel>
                    <Select
                      value={searchCriteria.education || ''}
                      label="Education"
                      onChange={(e) => onCriteriaChange('education', e.target.value)}
                    >
                      <MenuItem value="">Doesn't Matter</MenuItem>
                      {EDUCATION_OPTIONS.map(education => (
                        <MenuItem key={education} value={education.toLowerCase().replace(' ', '_')}>
                          {education}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Occupation - Multiple Select */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ color: '#37474f', mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <WorkIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#51365F' }} />
                    Occupation
                  </Typography>
                  <FormControl fullWidth size="small">
                    <InputLabel>Occupation</InputLabel>
                    <Select
                      multiple
                      value={searchCriteria.occupation || []}
                      onChange={(e) => handleMultipleSelectChange('occupation', e.target.value)}
                      input={<OutlinedInput label="Occupation" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {COMPREHENSIVE_INDUSTRY_OPTIONS.map((industry) => (
                        <MenuItem key={industry.value} value={industry.value}>
                          <Checkbox checked={searchCriteria.occupation?.indexOf(industry.value) > -1} />
                          {industry.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Tab 2: Search by Profile ID */}
        <TabPanel value={tabIndex} index={1}>
          <Box sx={{ px: 3, py: 2 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Enter Profile ID"
                  placeholder="e.g., PROFILE12345"
                  value={searchCriteria.profileId || ''}
                  onChange={(e) => onCriteriaChange('profileId', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#51365F',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
              Enter the specific profile ID to search for a particular user
            </Typography>
          </Box>
        </TabPanel>

        <Divider />

        {/* Action Buttons - Common for both tabs */}
        <Box sx={{ p: 3, textAlign: 'center', display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<SearchIcon />}
            onClick={onSearch}
            disabled={loading}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              background: '#51365F',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              '&:hover': {
                background: '#3d2847',
              }
            }}
          >
            Show Profile Me
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SearchForm;