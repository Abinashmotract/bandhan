import React from 'react';
import { Box, Typography, Card, CardContent, Avatar, Chip, Button } from '@mui/material';
import { testUser, testUserFemale } from '../utils/testUser';

const TestUserDetails = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 700 }}>
        Test User Details
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Male Test User */}
        <Card sx={{ maxWidth: 400, flex: 1, minWidth: 300 }}>
          <CardContent>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Avatar
                src={testUser.profileImage}
                sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
              />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {testUser.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                ID: {testUser.customId}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2 }}>
                <Chip label="Verified" color="success" size="small" />
                <Chip label="Online" color="primary" size="small" />
                <Chip label={`${testUser.profileCompletion}% Complete`} color="info" size="small" />
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Email:</strong> {testUser.email}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Password:</strong> {testUser.password}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Location:</strong> {testUser.city}, {testUser.state}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Occupation:</strong> {testUser.occupation}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Education:</strong> {testUser.education}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Religion:</strong> {testUser.religion} - {testUser.caste}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Height:</strong> {testUser.height}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Income:</strong> {testUser.annualIncome}
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
              "{testUser.about}"
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Hobbies:</strong> {testUser.hobbies.join(', ')}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Languages:</strong> {testUser.languagesKnown.join(', ')}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Female Test User */}
        <Card sx={{ maxWidth: 400, flex: 1, minWidth: 300 }}>
          <CardContent>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Avatar
                src={testUserFemale.profileImage}
                sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
              />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {testUserFemale.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                ID: {testUserFemale.customId}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2 }}>
                <Chip label="Verified" color="success" size="small" />
                <Chip label="Offline" color="default" size="small" />
                <Chip label={`${testUserFemale.profileCompletion}% Complete`} color="info" size="small" />
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Email:</strong> {testUserFemale.email}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Password:</strong> {testUserFemale.password}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Location:</strong> {testUserFemale.city}, {testUserFemale.state}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Occupation:</strong> {testUserFemale.occupation}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Education:</strong> {testUserFemale.education}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Religion:</strong> {testUserFemale.religion} - {testUserFemale.caste}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Height:</strong> {testUserFemale.height}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Income:</strong> {testUserFemale.annualIncome}
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
              "{testUserFemale.about}"
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Hobbies:</strong> {testUserFemale.hobbies.join(', ')}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Languages:</strong> {testUserFemale.languagesKnown.join(', ')}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          How to Test:
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          1. Use either email/password combination above to login
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          2. Navigate to "My Matches" page
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          3. Check if profile details are displayed correctly
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          4. Test Interest, Super Interest, and Shortlist functionality
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          5. Open profile dialogs to see detailed information
        </Typography>
      </Box>
    </Box>
  );
};

export default TestUserDetails;
