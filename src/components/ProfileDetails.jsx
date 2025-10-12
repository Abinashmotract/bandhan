import React from 'react';
import {
  Box,
  Typography,
  CardMedia,
  Button,
  Grid,
  Avatar
} from '@mui/material';
import {
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  Message as MessageIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Height as HeightIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Language as LanguageIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const ProfileDetails = ({ 
  selectedMatch, 
  onBackToMatches, 
  onShowInterest, 
  onShowSuperInterest,
  getAge,
  getMatchingCriteria 
}) => {
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
          onClick={onBackToMatches}
          sx={{
            color: '#51365F',
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
            ID: {selectedMatch.customId || 'N/A'}
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
          onClick={() => onShowInterest(selectedMatch._id)}
          disabled={selectedMatch.hasShownInterest}
          sx={{
            backgroundColor: '#51365F',
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
          onClick={() => onShowSuperInterest(selectedMatch._id)}
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
            color: '#51365F', 
            borderBottom: '2px solid #51365F',
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
          onClick={() => onShowInterest(selectedMatch._id)}
          disabled={selectedMatch.hasShownInterest}
          sx={{
            backgroundColor: '#51365F',
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
          onClick={() => onShowSuperInterest(selectedMatch._id)}
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
            borderColor: '#51365F',
            color: '#51365F',
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(233, 30, 99, 0.1)',
              borderColor: '#51365F'
            }
          }}
        >
          Chat
        </Button>
      </Box>
    </>
  );
};

export default ProfileDetails;
