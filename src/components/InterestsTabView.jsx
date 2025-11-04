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
import MatchCard from './MatchCard';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../utils/toast';
import { showSuperInterest, addToShortlist, removeFromShortlist, updateShortlistStatus } from '../store/slices/matchesSlice';

const InterestsTabView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getHeight = (height) => {
    if (!height) return null;
    return height;
  };

  const handleShowInterest = (profileId) => {
    // Interest is handled within MatchCard component
    console.log("Interest shown for:", profileId);
  };

  const handleShowSuperInterest = async (profileId) => {
    try {
      const result = await dispatch(showSuperInterest(profileId));
      if (showSuperInterest.fulfilled.match(result)) {
        showSuccess("Super interest sent successfully!");
      } else {
        showError(result.payload || "Failed to send super interest");
      }
    } catch (error) {
      showError("Failed to send super interest");
    }
  };

  const handleToggleShortlist = async (profileId, isShortlisted = null) => {
    // If isShortlisted is provided, just update the local state without making API call
    if (isShortlisted !== null) {
      dispatch(updateShortlistStatus({ profileId, isShortlisted }));
      return;
    }

    // Otherwise, make the API call
    try {
      if (isShortlisted) {
        const result = await dispatch(removeFromShortlist(profileId));
        if (removeFromShortlist.fulfilled.match(result)) {
          showSuccess("Profile removed from shortlist");
        } else {
          showError(result.payload || "Failed to remove from shortlist");
        }
      } else {
        const result = await dispatch(addToShortlist(profileId));
        if (addToShortlist.fulfilled.match(result)) {
          showSuccess("Profile added to shortlist");
        } else {
          if (result.payload && result.payload.includes("already")) {
            showSuccess("Profile is already in your shortlist");
          } else {
            showError(result.payload || "Failed to add to shortlist");
          }
        }
      }
    } catch (error) {
      showError("Failed to update shortlist");
    }
  };

  const handleViewProfile = (match) => {
    navigate(`/profile/${match._id}`);
  };

  const handleChatClick = (match) => {
    navigate(`/chat/${match._id}`);
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

    // For "Interest Sent" tab, use MatchCard with vertical and compact props
    if (activeTab === 'sent') {
      return (
        <Grid container spacing={2} sx={{ p: 2, justifyContent: 'center' }}>
          {interests?.map((interest) => {
            const user = interest.targetUser || interest;
            const matchData = {
              _id: user.id || user._id || interest.targetUser?.id || interest.id,
              name: user.name || interest.name,
              age: user.age || getAge(user.dob || user.dateOfBirth || interest.dob),
              profileImage: user.profileImage || interest.profileImage || user.profilePicture,
              location: user.location || user.city || interest.location || interest.city,
              occupation: user.occupation || interest.occupation,
              education: user.education || interest.education,
              height: user.height || interest.height,
              isShortlisted: user.isShortlisted || interest.isShortlisted || false,
              hasShownInterest: true, // Since it's in "Interest Sent" tab
              hasShownSuperInterest: user.hasShownSuperInterest || interest.hasShownSuperInterest || interest.type === 'super_interest' || false,
              customId: user.customId || interest.customId || interest.profileId,
              maritalStatus: user.maritalStatus || interest.maritalStatus,
              ...interest
            };

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={matchData._id}>
                <Box sx={{ maxWidth: "320px", width: "100%", mx: "auto" }}>
                  <MatchCard
                    match={matchData}
                    onShowInterest={handleShowInterest}
                    onShowSuperInterest={handleShowSuperInterest}
                    onViewProfile={handleViewProfile}
                    onToggleShortlist={handleToggleShortlist}
                    onChatClick={handleChatClick}
                    getAge={getAge}
                    getHeight={getHeight}
                    variant="vertical"
                    compact={true}
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      );
    }

    // For "Interests Received" tab, keep using ProfileCard
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