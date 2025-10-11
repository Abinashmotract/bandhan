import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Height as HeightIcon,
  Group as GroupIcon,
  Verified as VerifiedIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import { mockAbinashProfile, testProfileData, runAllTests, calculateAge } from '../utils/profileTest';

const AbinashProfileTest = () => {
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = () => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const results = runAllTests(mockAbinashProfile);
      setTestResults(results);
      setIsLoading(false);
    }, 1000);
  };

  const getStatusColor = (passed) => {
    return passed ? 'success' : 'error';
  };

  const getStatusIcon = (passed) => {
    return passed ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Running profile tests...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 700, color: '#e91e63' }}>
        Abinash Profile Test Results
      </Typography>
      
      {/* Test Summary */}
      {testResults && (
        <Alert 
          severity={testResults.summary.successRate >= 90 ? 'success' : 'warning'} 
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Test Summary: {testResults.summary.passed}/{testResults.summary.total} tests passed 
            ({testResults.summary.successRate}% success rate)
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Overview Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  src={mockAbinashProfile.profileImage}
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {mockAbinashProfile.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                  ID: {mockAbinashProfile.customId}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2, flexWrap: 'wrap' }}>
                  <Chip label="Verified" color="success" size="small" />
                  <Chip label="Online" color="primary" size="small" />
                  <Chip label={`${mockAbinashProfile.profileCompletion}% Complete`} color="info" size="small" />
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Login Credentials
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Email:</strong> {mockAbinashProfile.email}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Password:</strong> {mockAbinashProfile.password}
                </Typography>
              </Box>
              
              <Button 
                variant="contained" 
                fullWidth 
                onClick={runTests}
                sx={{ 
                  backgroundColor: '#e91e63',
                  '&:hover': { backgroundColor: '#c2185b' }
                }}
              >
                Re-run Tests
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Test Results */}
        <Grid item xs={12} md={8}>
          {testResults && (
            <Box>
              {/* Basic Information Tests */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1 }} />
                    Basic Information Tests
                  </Typography>
                  <List dense>
                    {testResults.results.basicInfo.map((test, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {getStatusIcon(test.passed)}
                        </ListItemIcon>
                        <ListItemText
                          primary={`${test.field}: ${test.actual}`}
                          secondary={`Expected: ${test.expected}`}
                        />
                        <Chip 
                          label={test.status} 
                          color={getStatusColor(test.passed)} 
                          size="small" 
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* Professional Information Tests */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <WorkIcon sx={{ mr: 1 }} />
                    Professional Information Tests
                  </Typography>
                  <List dense>
                    {testResults.results.professionalInfo.map((test, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {getStatusIcon(test.passed)}
                        </ListItemIcon>
                        <ListItemText
                          primary={`${test.field}: ${test.actual}`}
                          secondary={`Expected: ${test.expected}`}
                        />
                        <Chip 
                          label={test.status} 
                          color={getStatusColor(test.passed)} 
                          size="small" 
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* Personal Details Tests */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <HeightIcon sx={{ mr: 1 }} />
                    Personal Details Tests
                  </Typography>
                  <List dense>
                    {testResults.results.personalDetails.map((test, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {getStatusIcon(test.passed)}
                        </ListItemIcon>
                        <ListItemText
                          primary={`${test.field}: ${test.actual}`}
                          secondary={`Expected: ${test.expected}`}
                        />
                        <Chip 
                          label={test.status} 
                          color={getStatusColor(test.passed)} 
                          size="small" 
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* Religious & Cultural Tests */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <GroupIcon sx={{ mr: 1 }} />
                    Religious & Cultural Tests
                  </Typography>
                  <List dense>
                    {testResults.results.religiousInfo.map((test, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {getStatusIcon(test.passed)}
                        </ListItemIcon>
                        <ListItemText
                          primary={`${test.field}: ${Array.isArray(test.actual) ? test.actual.join(', ') : test.actual}`}
                          secondary={`Expected: ${Array.isArray(test.expected) ? test.expected.join(', ') : test.expected}`}
                        />
                        <Chip 
                          label={test.status} 
                          color={getStatusColor(test.passed)} 
                          size="small" 
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* Verification Status Tests */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <VerifiedIcon sx={{ mr: 1 }} />
                    Verification Status Tests
                  </Typography>
                  <List dense>
                    {testResults.results.verificationStatus.map((test, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {getStatusIcon(test.passed)}
                        </ListItemIcon>
                        <ListItemText
                          primary={`${test.field}: ${test.actual ? 'Yes' : 'No'}`}
                          secondary={`Expected: ${test.expected ? 'Yes' : 'No'}`}
                        />
                        <Chip 
                          label={test.status} 
                          color={getStatusColor(test.passed)} 
                          size="small" 
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* Profile Completion Tests */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <StarIcon sx={{ mr: 1 }} />
                    Profile Completion Tests
                  </Typography>
                  <List dense>
                    {testResults.results.profileCompletion.map((test, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {getStatusIcon(test.passed)}
                        </ListItemIcon>
                        <ListItemText
                          primary={`${test.field}: ${test.condition === 'gte' ? test.actual : (Array.isArray(test.actual) ? test.actual.length + ' items' : test.actual)}`}
                          secondary={`Expected: ${test.expected}`}
                        />
                        <Chip 
                          label={test.status} 
                          color={getStatusColor(test.passed)} 
                          size="small" 
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Profile Details Summary */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Complete Profile Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Age:</strong> {calculateAge(mockAbinashProfile.dob)} years
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Location:</strong> {mockAbinashProfile.city}, {mockAbinashProfile.state}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Occupation:</strong> {mockAbinashProfile.occupation}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Education:</strong> {mockAbinashProfile.education}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Religion:</strong> {mockAbinashProfile.religion} - {mockAbinashProfile.caste}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Height:</strong> {mockAbinashProfile.height}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Income:</strong> {mockAbinashProfile.annualIncome}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Hobbies:</strong> {mockAbinashProfile.hobbies.join(', ')}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Languages:</strong> {mockAbinashProfile.languagesKnown.join(', ')}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Family Type:</strong> {mockAbinashProfile.familyType}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Father's Occupation:</strong> {mockAbinashProfile.fatherOccupation}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Mother's Occupation:</strong> {mockAbinashProfile.motherOccupation}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Brothers:</strong> {mockAbinashProfile.brothers}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Sisters:</strong> {mockAbinashProfile.sisters}
              </Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
            "{mockAbinashProfile.about}"
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AbinashProfileTest;
