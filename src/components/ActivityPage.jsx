import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  Avatar,
  Chip,
  IconButton,
  Grid,
  Divider,
  Badge,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ArrowBack,
  Favorite,
  FavoriteBorder,
  Send,
  Star,
  StarBorder,
  Person,
  Phone,
  Message,
  MoreVert,
  CheckCircle,
  Cancel,
  Visibility,
  ThumbUp,
  ThumbDown,
  KeyboardArrowRight,
  KeyboardArrowLeft
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ActivityPage = ({ onBackToMatches, onViewProfile, getAge, getHeight }) => {
  const [activeTab, setActiveTab] = useState('received');
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sample data for demonstration
  const activityData = {
    summary: {
      acceptedInterests: 3,
      interestsReceived: 12,
      interestsSent: 8,
      shortlistedProfiles: 5,
      declinedInterests: 2
    },
    receivedInterests: [
      {
        id: 1,
        name: 'Priyanka Singh',
        age: 26,
        profileId: 'TXYVVH7',
        lastSeen: '7:32 AM',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        height: '5.2',
        city: 'Nashik',
        caste: 'Rajput',
        occupation: 'Clerk',
        annualIncome: '2-5 Lakh',
        education: 'MBA',
        maritalStatus: 'Never Married',
        religion: 'Hindu',
        motherTongue: 'Hindi',
        isEmailVerified: true,
        isPhoneVerified: true,
        isIdVerified: true,
        isPhotoVerified: true,
        status: 'received', // received, accepted, declined
        receivedDate: '2024-01-15',
        matchPercentage: 89
      },
      {
        id: 2,
        name: 'Kavya Iyer',
        age: 28,
        profileId: 'TXYVVH8',
        lastSeen: '2 hours ago',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        height: '5.4',
        city: 'Mumbai',
        caste: 'Iyer',
        occupation: 'Software Engineer',
        annualIncome: '8-12 Lakh',
        education: 'B.Tech',
        maritalStatus: 'Never Married',
        religion: 'Hindu',
        motherTongue: 'Tamil',
        isEmailVerified: true,
        isPhoneVerified: false,
        isIdVerified: true,
        isPhotoVerified: true,
        status: 'accepted',
        receivedDate: '2024-01-14',
        matchPercentage: 92
      }
    ],
    sentInterests: [
      {
        id: 3,
        name: 'Anjali Patel',
        age: 25,
        profileId: 'TXYVVH9',
        lastSeen: '1 day ago',
        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        height: '5.6',
        city: 'Ahmedabad',
        caste: 'Patel',
        occupation: 'Doctor',
        annualIncome: '12-18 Lakh',
        education: 'MBBS',
        maritalStatus: 'Never Married',
        religion: 'Hindu',
        motherTongue: 'Gujarati',
        isEmailVerified: true,
        isPhoneVerified: true,
        isIdVerified: true,
        isPhotoVerified: true,
        status: 'sent', // sent, accepted, declined
        sentDate: '2024-01-13',
        matchPercentage: 85
      },
      {
        id: 4,
        name: 'Sneha Reddy',
        age: 27,
        profileId: 'TXYVVH10',
        lastSeen: '3 days ago',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        height: '5.3',
        city: 'Hyderabad',
        caste: 'Reddy',
        occupation: 'Teacher',
        annualIncome: '4-8 Lakh',
        education: 'M.Ed',
        maritalStatus: 'Never Married',
        religion: 'Hindu',
        motherTongue: 'Telugu',
        isEmailVerified: true,
        isPhoneVerified: false,
        isIdVerified: false,
        isPhotoVerified: true,
        status: 'accepted',
        sentDate: '2024-01-12',
        matchPercentage: 78
      }
    ]
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedInterest(null);
  };

  const handleInterestAction = (interestId, action) => {
    console.log(`Action ${action} on interest ${interestId}`);
    // Handle interest actions (accept, decline, etc.)
  };

  const handleViewProfile = (interest) => {
    setSelectedInterest(interest);
  };

  const handleBackToInterests = () => {
    setSelectedInterest(null);
  };

  const renderActivitySummary = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#333', mb: 3 }}>
        Your Activity Summary
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
        {[
          {
            title: 'Accepted Interests',
            count: activityData.summary.acceptedInterests,
            icon: <CheckCircle sx={{ color: '#4caf50' }} />,
            color: '#4caf50'
          },
          {
            title: 'Interests Received',
            count: activityData.summary.interestsReceived,
            icon: <Send sx={{ color: '#2196f3' }} />,
            color: '#2196f3'
          },
          {
            title: 'Interests Sent',
            count: activityData.summary.interestsSent,
            icon: <Send sx={{ color: '#ff9800' }} />,
            color: '#ff9800'
          },
          {
            title: 'Shortlisted Profiles',
            count: activityData.summary.shortlistedProfiles,
            icon: <Star sx={{ color: '#e91e63' }} />,
            color: '#e91e63'
          },
          {
            title: 'Declined Interests',
            count: activityData.summary.declinedInterests,
            icon: <Cancel sx={{ color: '#f44336' }} />,
            color: '#f44336'
          }
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card sx={{
              minWidth: 180,
              textAlign: 'center',
              borderRadius: 3,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {item.icon}
                </Box>
                <Typography variant="h4" sx={{
                  fontWeight: 700,
                  color: item.color,
                  mb: 1
                }}>
                  {item.count}
                </Typography>
                <Typography variant="body2" sx={{
                  color: '#666',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}>
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>
    </Box>
  );

  const renderInterestCard = (interest, isReceived = false) => (
    <motion.div
      key={interest.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{
        mb: 2,
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)'
        },
        transition: 'all 0.3s ease'
      }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ display: 'flex' }}>
            {/* Profile Image */}
            <Box sx={{ position: 'relative', width: '35%', minHeight: 200 }}>
              <Box
                component="img"
                src={interest.profileImage}
                alt={interest.name}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  cursor: 'pointer'
                }}
                onClick={() => handleViewProfile(interest)}
              />

              {/* Status Badge */}
              <Chip
                label={interest.status.toUpperCase()}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  backgroundColor: interest.status === 'accepted' ? '#4caf50' :
                    interest.status === 'declined' ? '#f44336' : '#ff9800',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />

              {/* Match Percentage */}
              <Box sx={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                {interest.matchPercentage}% Match
              </Box>
            </Box>

            {/* Profile Details */}
            <Box sx={{ flex: 1, p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{
                    fontWeight: 700,
                    color: '#1976d2',
                    mb: 0.5
                  }}>
                    {interest.name}, {getAge(interest.age)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    ID: {interest.profileId} • Last seen {interest.lastSeen}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    {isReceived ? 'Received on' : 'Sent on'} {isReceived ? interest.receivedDate : interest.sentDate}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  {(interest.isEmailVerified || interest.isPhoneVerified || interest.isIdVerified || interest.isPhotoVerified) && (
                    <Chip
                      icon={<CheckCircle sx={{ fontSize: 16 }} />}
                      label="Verified"
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>

              {/* Basic Info */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                  {getHeight(interest.height)} • {interest.city} • {interest.caste}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                  {interest.occupation} • {interest.annualIncome} • {interest.education}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {interest.religion} • {interest.motherTongue} • {interest.maritalStatus}
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {isReceived && interest.status === 'received' && (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<CheckCircle />}
                      onClick={() => handleInterestAction(interest.id, 'accept')}
                      sx={{
                        backgroundColor: '#4caf50',
                        '&:hover': { backgroundColor: '#45a049' },
                        textTransform: 'none',
                        fontSize: '0.85rem'
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={() => handleInterestAction(interest.id, 'decline')}
                      sx={{
                        borderColor: '#f44336',
                        color: '#f44336',
                        '&:hover': {
                          borderColor: '#d32f2f',
                          backgroundColor: 'rgba(244, 67, 54, 0.04)'
                        },
                        textTransform: 'none',
                        fontSize: '0.85rem'
                      }}
                    >
                      Decline
                    </Button>
                  </>
                )}

                <Button
                  variant="outlined"
                  startIcon={<Person />}
                  onClick={() => handleViewProfile(interest)}
                  sx={{
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    '&:hover': {
                      borderColor: '#1565c0',
                      backgroundColor: 'rgba(25, 118, 210, 0.04)'
                    },
                    textTransform: 'none',
                    fontSize: '0.85rem'
                  }}
                >
                  View Profile
                </Button>

                {interest.status === 'accepted' && (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<Message />}
                      sx={{
                        backgroundColor: '#e91e63',
                        '&:hover': { backgroundColor: '#c2185b' },
                        textTransform: 'none',
                        fontSize: '0.85rem'
                      }}
                    >
                      Chat
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Phone />}
                      sx={{
                        borderColor: '#4caf50',
                        color: '#4caf50',
                        '&:hover': {
                          borderColor: '#45a049',
                          backgroundColor: 'rgba(76, 175, 80, 0.04)'
                        },
                        textTransform: 'none',
                        fontSize: '0.85rem'
                      }}
                    >
                      Call
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderProfileDetail = (interest) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackToInterests}
          sx={{ mb: 2, textTransform: 'none' }}
        >
          Back to Interests
        </Button>
      </Box>

      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ position: 'relative' }}>
          <Box
            component="img"
            src={interest.profileImage}
            alt={interest.name}
            sx={{
              width: '100%',
              height: 300,
              objectFit: 'cover'
            }}
          />

          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            p: 3,
            color: 'white'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {interest.name}, {getAge(interest.age)}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              ID: {interest.profileId} • Last seen {interest.lastSeen}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Profile managed by self
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value="about" sx={{ minHeight: 'auto' }}>
              <Tab label="About Me" value="about" sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label="Family" value="family" sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label="Looking For" value="looking" sx={{ textTransform: 'none', fontWeight: 600 }} />
            </Tabs>
          </Box>

          {/* About Me Content */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Basic Information
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {interest.religion} - {interest.caste}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {getHeight(interest.height)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {interest.annualIncome} per Annum
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Mother tongue is {interest.motherTongue}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {interest.maritalStatus}
                </Typography>
              </Grid>
            </Grid>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              I am {interest.name}, a {getAge(interest.age)}-year-old {interest.education} graduate working as {interest.occupation} in the private sector in {interest.city}. I am an independent and career-oriented woman looking for a life partner who shares similar values and aspirations.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Education
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
              {interest.education} - Post Graduation
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Career
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
              {interest.occupation} - Private Sector
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Family
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
              Father is a Businessman/Entrepreneur & Mother is a Homemaker
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<Star />}
              sx={{
                backgroundColor: '#e91e63',
                '&:hover': { backgroundColor: '#c2185b' },
                textTransform: 'none'
              }}
            >
              Super Interest
            </Button>
            <Button
              variant="outlined"
              startIcon={<Message />}
              sx={{
                borderColor: '#1976d2',
                color: '#1976d2',
                '&:hover': {
                  borderColor: '#1565c0',
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                },
                textTransform: 'none'
              }}
            >
              Chat
            </Button>
            <Button
              variant="outlined"
              startIcon={<Phone />}
              sx={{
                borderColor: '#4caf50',
                color: '#4caf50',
                '&:hover': {
                  borderColor: '#45a049',
                  backgroundColor: 'rgba(76, 175, 80, 0.04)'
                },
                textTransform: 'none'
              }}
            >
              Call
            </Button>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              sx={{
                borderColor: '#f44336',
                color: '#f44336',
                '&:hover': {
                  borderColor: '#d32f2f',
                  backgroundColor: 'rgba(244, 67, 54, 0.04)'
                },
                textTransform: 'none'
              }}
            >
              Cancel
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (selectedInterest) {
    return renderProfileDetail(selectedInterest);
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={onBackToMatches} sx={{ mr: 2, textTransform: 'none' }}>
          Back to Matches
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333' }}>
          Activity
        </Typography>
      </Box>
      {renderActivitySummary()}

      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ px: 2 }}>
            <Tab
              label={`Received (${activityData.receivedInterests.length})`}
              value="received"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            />
            <Tab
              label={`Sent (${activityData.sentInterests.length})`}
              value="sent"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {activeTab === 'received' && (
            <Box>
              {activityData.receivedInterests.length > 0 ? (
                activityData.receivedInterests.map(interest =>
                  renderInterestCard(interest, true)
                )
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                    No interests received yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    Start sending interests to receive responses
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {activeTab === 'sent' && (
            <Box>
              {activityData.sentInterests.length > 0 ? (
                activityData.sentInterests.map(interest =>
                  renderInterestCard(interest, false)
                )
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                    No interests sent yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    Start sending interests to profiles you like
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ActivityPage;
