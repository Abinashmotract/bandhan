import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  getInterestsReceived,
  getInterestsSent,
  acceptInterest,
  declineInterest,
} from '../store/slices/activitySlice';
import ProfileCard from './ProfileCard';
import ProfileDetails from './ProfileDetails';

const InterestsTabView = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('received');
  const [selectedProfile, setSelectedProfile] = useState(null);

  const {
    interestsReceived,
    interestsSent,
    loading: { received: loadingReceived, sent: loadingSent },
    error: { received: receivedError, sent: sentError },
  } = useSelector((state) => state.activity);

  useEffect(() => {
    dispatch(getInterestsReceived());
    dispatch(getInterestsSent());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedProfile(null);
  };

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
  };

  const handleBackToList = () => {
    setSelectedProfile(null);
  };

  const handleInterestAction = async (interestId, action) => {
    try {
      if (action === 'accept') {
        await dispatch(acceptInterest(interestId)).unwrap();
      } else if (action === 'decline') {
        await dispatch(declineInterest(interestId)).unwrap();
      }
      // Refresh the interests after action
      dispatch(getInterestsReceived());
    } catch (error) {
      console.error('Failed to process interest:', error);
    }
  };

  const getAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (selectedProfile) {
    return (
      <ProfileDetails
        selectedMatch={selectedProfile}
        onBackToMatches={handleBackToList}
        getAge={getAge}
        actionButtonOption={activeTab === 'received' ? 1 : 2}
      />
    );
  }

  const renderContent = () => {
    const loading = activeTab === 'received' ? loadingReceived : loadingSent;
    const error = activeTab === 'received' ? receivedError : sentError;
    const interests = activeTab === 'received' ? interestsReceived : interestsSent;

    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Typography color="error" align="center" sx={{ py: 4 }}>
          {error}
        </Typography>
      );
    }

    if (!interests.length) {
      return (
        <Typography align="center" sx={{ py: 4 }}>
          No {activeTab === 'received' ? 'received' : 'sent'} interests found.
        </Typography>
      );
    }

    return (
      <Grid container spacing={2} sx={{ p: 2 }}>
        {interests.map((interest) => (
          <Grid item xs={12} sm={6} md={4} key={interest.id}>
            <ProfileCard
              profile={interest}
              onViewProfile={() => handleProfileClick(interest)}
              onAcceptInterest={
                activeTab === 'received'
                  ? () => handleInterestAction(interest.id, 'accept')
                  : undefined
              }
              onDeclineInterest={
                activeTab === 'received'
                  ? () => handleInterestAction(interest.id, 'decline')
                  : undefined
              }
              interestType={activeTab}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            label={`Interests Received (${interestsReceived.length})`}
            value="received"
          />
          <Tab
            label={`Interests Sent (${interestsSent.length})`}
            value="sent"
          />
        </Tabs>
      </Box>
      {renderContent()}
    </Box>
  );
};

export default InterestsTabView;