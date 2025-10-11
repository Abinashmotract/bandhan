import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider
} from '@mui/material';
import {
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { showSuccess, showError } from '../utils/toast';

const HoroscopePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const [activeStep, setActiveStep] = useState(0);
  const [horoscopeData, setHoroscopeData] = useState({
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    gender: '',
    rashi: '',
    nakshatra: '',
    gothra: '',
    manglik: false,
    horoscopeFile: null
  });
  
  const [compatibilityData, setCompatibilityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCompatibilityDialog, setShowCompatibilityDialog] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  const rashis = [
    'Aries (Mesha)', 'Taurus (Vrishabha)', 'Gemini (Mithuna)', 'Cancer (Karka)',
    'Leo (Simha)', 'Virgo (Kanya)', 'Libra (Tula)', 'Scorpio (Vrishchika)',
    'Sagittarius (Dhanu)', 'Capricorn (Makara)', 'Aquarius (Kumbha)', 'Pisces (Meena)'
  ];

  const nakshatras = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
    'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
    'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
    'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada',
    'Uttara Bhadrapada', 'Revati'
  ];

  const gothras = [
    'Bharadwaja', 'Vasishtha', 'Kashyapa', 'Atri', 'Gautama', 'Jamadagni',
    'Vishwamitra', 'Agastya', 'Bhrigu', 'Angiras', 'Pulastya', 'Pulaha',
    'Kratu', 'Marichi', 'Narada', 'Other'
  ];

  const steps = [
    'Basic Details',
    'Astrological Details',
    'Upload Horoscope',
    'Compatibility Check'
  ];

  const handleInputChange = (field, value) => {
    setHoroscopeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!horoscopeData.dateOfBirth || !horoscopeData.timeOfBirth || !horoscopeData.placeOfBirth || !horoscopeData.gender) {
        showError('Please fill all required fields');
        return;
      }
    }
    if (activeStep === 1) {
      if (!horoscopeData.rashi || !horoscopeData.nakshatra) {
        showError('Please select Rashi and Nakshatra');
        return;
      }
    }
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setHoroscopeData(prev => ({
        ...prev,
        horoscopeFile: file
      }));
    }
  };

  const handleSaveHoroscope = async () => {
    setLoading(true);
    try {
      // API call to save horoscope data
      const formData = new FormData();
      Object.keys(horoscopeData).forEach(key => {
        if (key === 'horoscopeFile' && horoscopeData[key]) {
          formData.append('horoscopeFile', horoscopeData[key]);
        } else {
          formData.append(key, horoscopeData[key]);
        }
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showSuccess('Horoscope details saved successfully!');
      setActiveStep(3);
    } catch (error) {
      showError('Failed to save horoscope details');
    } finally {
      setLoading(false);
    }
  };

  const handleCompatibilityCheck = async (partnerId) => {
    setLoading(true);
    try {
      // API call to check compatibility
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCompatibilityData({
        overallScore: 85,
        rashiCompatibility: 90,
        nakshatraCompatibility: 80,
        manglikCompatibility: 95,
        gunaMilan: 24,
        totalGuna: 36,
        recommendations: [
          'Excellent compatibility in Rashi',
          'Good Nakshatra match',
          'Both are Manglik - Perfect match',
          'High Guna Milan score'
        ],
        warnings: [
          'Consider consulting an astrologer for detailed analysis'
        ]
      });
      
      setShowCompatibilityDialog(true);
    } catch (error) {
      showError('Failed to check compatibility');
    } finally {
      setLoading(false);
    }
  };

  const renderBasicDetails = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#51365F', fontWeight: 600, mb: 3 }}>
        Basic Birth Details
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date of Birth"
            type="date"
            value={horoscopeData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Time of Birth"
            type="time"
            value={horoscopeData.timeOfBirth}
            onChange={(e) => handleInputChange('timeOfBirth', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Place of Birth"
            value={horoscopeData.placeOfBirth}
            onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
            placeholder="Enter city, state, country"
            sx={{ mb: 2 }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Gender</InputLabel>
            <Select
              value={horoscopeData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              label="Gender"
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );

  const renderAstrologicalDetails = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#51365F', fontWeight: 600, mb: 3 }}>
        Astrological Details
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Rashi (Moon Sign)</InputLabel>
            <Select
              value={horoscopeData.rashi}
              onChange={(e) => handleInputChange('rashi', e.target.value)}
              label="Rashi (Moon Sign)"
            >
              {rashis.map((rashi) => (
                <MenuItem key={rashi} value={rashi}>{rashi}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Nakshatra (Birth Star)</InputLabel>
            <Select
              value={horoscopeData.nakshatra}
              onChange={(e) => handleInputChange('nakshatra', e.target.value)}
              label="Nakshatra (Birth Star)"
            >
              {nakshatras.map((nakshatra) => (
                <MenuItem key={nakshatra} value={nakshatra}>{nakshatra}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Gothra</InputLabel>
            <Select
              value={horoscopeData.gothra}
              onChange={(e) => handleInputChange('gothra', e.target.value)}
              label="Gothra"
            >
              {gothras.map((gothra) => (
                <MenuItem key={gothra} value={gothra}>{gothra}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#37474f' }}>
              Are you Manglik?
            </Typography>
            <RadioGroup
              row
              value={horoscopeData.manglik}
              onChange={(e) => handleInputChange('manglik', e.target.value === 'true')}
            >
              <FormControlLabel value={true} control={<Radio />} label="Yes" />
              <FormControlLabel value={false} control={<Radio />} label="No" />
            </RadioGroup>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  const renderFileUpload = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#51365F', fontWeight: 600, mb: 3 }}>
        Upload Horoscope
      </Typography>
      
      <Box sx={{ 
        border: '2px dashed #e0e0e0', 
        borderRadius: 2, 
        p: 4, 
        textAlign: 'center',
        backgroundColor: '#fafafa'
      }}>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          id="horoscope-upload"
        />
        <label htmlFor="horoscope-upload">
          <Button
            variant="outlined"
            component="span"
            startIcon={<CalendarIcon />}
            sx={{ mb: 2 }}
          >
            Choose Horoscope File
          </Button>
        </label>
        
        {horoscopeData.horoscopeFile && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Selected: {horoscopeData.horoscopeFile.name}
            </Typography>
          </Box>
        )}
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Supported formats: PDF, JPG, JPEG, PNG (Max 5MB)
        </Typography>
      </Box>
    </Box>
  );

  const renderCompatibilityCheck = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#51365F', fontWeight: 600, mb: 3 }}>
        Horoscope Compatibility
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Your horoscope details have been saved. You can now check compatibility with potential matches.
      </Alert>
      
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<StarIcon />}
          onClick={() => handleCompatibilityCheck('sample-partner-id')}
          disabled={loading}
          sx={{
            background: '#51365F',
            '&:hover': {
              background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)',
            }
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Check Compatibility'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ 
        color: '#51365F', 
        fontWeight: 700, 
        mb: 3,
        textAlign: 'center'
      }}>
        Horoscope Matching
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                {index === 0 && renderBasicDetails()}
                {index === 1 && renderAstrologicalDetails()}
                {index === 2 && renderFileUpload()}
                {index === 3 && renderCompatibilityCheck()}
                
                <Box sx={{ mb: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={index === 2 ? handleSaveHoroscope : handleNext}
                    disabled={loading}
                    sx={{
                      mr: 1,
                      background: '#51365F',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)',
                      }
                    }}
                  >
                    {index === 2 ? 'Save Horoscope' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ color: '#51365F' }}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Compatibility Results Dialog */}
      <Dialog 
        open={showCompatibilityDialog} 
        onClose={() => setShowCompatibilityDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: '#51365F', fontWeight: 600 }}>
          Horoscope Compatibility Results
        </DialogTitle>
        <DialogContent>
          {compatibilityData && (
            <Box>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>
                  {compatibilityData.overallScore}% Match
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Overall Compatibility Score
                </Typography>
              </Box>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={6} md={3}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" sx={{ color: '#51365F' }}>
                      {compatibilityData.rashiCompatibility}%
                    </Typography>
                    <Typography variant="body2">Rashi Match</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" sx={{ color: '#51365F' }}>
                      {compatibilityData.nakshatraCompatibility}%
                    </Typography>
                    <Typography variant="body2">Nakshatra Match</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" sx={{ color: '#51365F' }}>
                      {compatibilityData.manglikCompatibility}%
                    </Typography>
                    <Typography variant="body2">Manglik Match</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" sx={{ color: '#51365F' }}>
                      {compatibilityData.gunaMilan}/{compatibilityData.totalGuna}
                    </Typography>
                    <Typography variant="body2">Guna Milan</Typography>
                  </Card>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ color: '#37474f', mb: 2 }}>
                Recommendations
              </Typography>
              {compatibilityData.recommendations.map((rec, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckIcon sx={{ color: '#4caf50', mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">{rec}</Typography>
                </Box>
              ))}

              {compatibilityData.warnings.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ color: '#37474f', mb: 2, mt: 3 }}>
                    Important Notes
                  </Typography>
                  {compatibilityData.warnings.map((warning, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <WarningIcon sx={{ color: '#ff9800', mr: 1, fontSize: 20 }} />
                      <Typography variant="body2">{warning}</Typography>
                    </Box>
                  ))}
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCompatibilityDialog(false)}>
            Close
          </Button>
          <Button 
            variant="contained" 
            sx={{ background: '#51365F' }}
            onClick={() => setShowCompatibilityDialog(false)}
          >
            View Full Report
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HoroscopePage;
