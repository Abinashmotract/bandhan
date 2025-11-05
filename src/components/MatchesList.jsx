import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Skeleton,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Search as SearchIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import MatchCard from './MatchCard';
import FilterDialog from './FilterDialog';
import { useSubscription } from '../hooks/useSubscription';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getSubscriptionStatus, getSubscriptionPlans } from '../store/slices/subscriptionSlice';


const MatchesList = ({
  filteredMatches,
  loading,
  error,
  filters,
  onFilterChange,
  onSearchClick,
  onRetryLoad,
  onShowInterest,
  onShowSuperInterest,
  onViewProfile,
  onToggleShortlist,
  onChatClick,
  getAge,
  getHeight,
  isLoadingMore,
  hasMoreMatches
}) => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const { openUpgradeModal } = useSubscription();
  const subscription = useSelector((state) => state.subscription);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Ensure subscription data is loaded when component mounts
  useEffect(() => {
    if (!subscription.currentSubscription && !subscription.loading) {
      console.log('🔄 Loading subscription data...');
      dispatch(getSubscriptionStatus());
      dispatch(getSubscriptionPlans({ duration: "quarterly" }));
    }
  }, [dispatch, subscription.currentSubscription, subscription.loading]);
  
  // Check if user has access to premium features (Entry, Advanced, Premium, Elite plans)
  // These filters (Verified, Just Joined, Nearby) should be available to all paid plans
  const hasFilterAccess = () => {
    // Debug logging
    console.log('🔍 Checking filter access:', {
      hasSubscription: !!subscription.currentSubscription,
      subscription: subscription.currentSubscription,
      plansCount: subscription.plans?.length || 0,
      loading: subscription.loading,
    });
    
    // Check if subscription exists
    if (!subscription.currentSubscription) {
      console.log('❌ No subscription found');
      return false;
    }
    
    // Check if subscription is active - handle both isActive and status fields
    const isActive = subscription.currentSubscription.isActive !== undefined 
      ? subscription.currentSubscription.isActive 
      : subscription.currentSubscription.status === 'active';
    
    console.log('📊 Subscription active status:', isActive);
    
    if (!isActive) {
      console.log('❌ Subscription is not active');
      return false;
    }
    
    // Handle both populated plan object and plan ID string
    const subscriptionPlan = subscription.currentSubscription.plan;
    console.log('📦 Subscription plan data:', subscriptionPlan);
    
    const planId = typeof subscriptionPlan === 'object' && subscriptionPlan !== null
      ? String(subscriptionPlan._id || subscriptionPlan.id)
      : String(subscriptionPlan || '');
    
    console.log('🆔 Extracted plan ID:', planId);
    
    if (!planId) {
      console.log('❌ No plan ID found');
      return false;
    }
    
    // If we have plans loaded, check plan type
    if (subscription.plans && subscription.plans.length > 0) {
      const currentPlan = subscription.plans.find(
        (plan) => String(plan._id) === planId
      );
      
      console.log('📋 Found plan:', currentPlan);
      
      if (currentPlan) {
        const hasAccess = currentPlan.planType === 'paid';
        console.log(`✅ Plan type: ${currentPlan.planType}, Has access: ${hasAccess}`);
        return hasAccess;
      } else {
        console.log('⚠️ Plan not found in plans array, checking if plan object has planType');
        // If plan is populated, check its planType directly
        if (typeof subscriptionPlan === 'object' && subscriptionPlan.planType) {
          const hasAccess = subscriptionPlan.planType === 'paid';
          console.log(`✅ Plan object type: ${subscriptionPlan.planType}, Has access: ${hasAccess}`);
          return hasAccess;
        }
      }
    } else {
      console.log('⚠️ Plans not loaded yet, checking if plan object has planType');
      // If plans aren't loaded yet but we have a populated plan object, check it directly
      if (typeof subscriptionPlan === 'object' && subscriptionPlan.planType) {
        const hasAccess = subscriptionPlan.planType === 'paid';
        console.log(`✅ Plan object type: ${subscriptionPlan.planType}, Has access: ${hasAccess}`);
        return hasAccess;
      }
    }
    
    console.log('❌ Could not determine plan type');
    return false;
  };

  const hasAccess = hasFilterAccess();
  console.log('🎯 Final access result:', hasAccess);
  
  // Handle filter button click - redirect to subscription page if no access
  const handleFilterClick = (filterType, currentValue) => {
    if (!hasAccess && !currentValue) {
      navigate('/membership');
      return;
    }
    onFilterChange(filterType, !currentValue);
  };

  const handleFilterApply = (filterData) => {
    // Map filter dialog data to filter state format
    const updatedFilters = { 
      ...filters,
      // Keep existing verified, justJoined, nearby values (they can be set via buttons)
    };
    
    // Map filter dialog data to filter state
    if (filterData.ageRange) {
      updatedFilters.ageRange = filterData.ageRange;
    } else {
      updatedFilters.ageRange = [18, 60]; // Default if not set
    }
    
    if (filterData.heightRange) {
      updatedFilters.heightRange = filterData.heightRange;
    } else {
      updatedFilters.heightRange = ["", ""];
    }
    
    if (filterData.maritalStatus && Array.isArray(filterData.maritalStatus) && filterData.maritalStatus.length > 0) {
      updatedFilters.maritalStatus = filterData.maritalStatus;
    } else {
      updatedFilters.maritalStatus = [];
    }
    
    if (filterData.religion) {
      updatedFilters.religion = filterData.religion;
    } else {
      updatedFilters.religion = "";
    }
    
    if (filterData.caste) {
      updatedFilters.caste = filterData.caste;
    } else {
      updatedFilters.caste = "";
    }
    
    if (filterData.motherTongue && Array.isArray(filterData.motherTongue) && filterData.motherTongue.length > 0) {
      updatedFilters.motherTongue = filterData.motherTongue;
    } else {
      updatedFilters.motherTongue = [];
    }
    
    if (filterData.education) {
      updatedFilters.education = filterData.education;
    } else {
      updatedFilters.education = "";
    }
    
    if (filterData.occupation) {
      updatedFilters.occupation = filterData.occupation;
    } else {
      updatedFilters.occupation = "";
    }
    
    if (filterData.location) {
      updatedFilters.location = filterData.location;
    } else {
      updatedFilters.location = "";
    }
    
    if (filterData.annualIncome) {
      updatedFilters.annualIncome = filterData.annualIncome;
    } else {
      updatedFilters.annualIncome = "";
    }

    // Apply all filters at once through a single filter change
    // Use a special 'applyAllFilters' key to indicate batch update
    onFilterChange('applyAllFilters', updatedFilters);
  };
  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Box sx={{  mb: 3 }}>
          {/* <Typography variant="h4" sx={{ color: '#51365F', fontWeight: 700 }}>
            Matches for You
          </Typography> */}
        </Box>

        {/* Filter Bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<FilterIcon />}
            onClick={() => setFilterDialogOpen(true)}
            sx={{
              backgroundColor: '#51365F',
              '&:hover': {
                backgroundColor: '#c2185b'
              },
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Refine Matches
          </Button>
          <Button
            variant={filters?.verified ? "contained" : "outlined"}
            onClick={() => handleFilterClick('verified', filters?.verified)}
            startIcon={!hasAccess && !filters?.verified ? <LockIcon sx={{ fontSize: 16 }} /> : null}
            sx={{
              borderColor: filters?.verified ? '#51365F' : '#e0e0e0',
              backgroundColor: filters?.verified ? '#51365F' : 'transparent',
              color: filters?.verified ? 'white' : '#666',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: filters?.verified ? '#c2185b' : 'rgba(233, 30, 99, 0.1)',
                borderColor: '#51365F'
              },
            }}
          >
            Verified
          </Button>
          <Button
            variant={filters?.justJoined ? "contained" : "outlined"}
            onClick={() => handleFilterClick('justJoined', filters?.justJoined)}
            startIcon={!hasAccess && !filters?.justJoined ? <LockIcon sx={{ fontSize: 16 }} /> : null}
            sx={{
              borderColor: filters?.justJoined ? '#51365F' : '#e0e0e0',
              backgroundColor: filters?.justJoined ? '#51365F' : 'transparent',
              color: filters?.justJoined ? 'white' : '#666',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: filters?.justJoined ? '#c2185b' : 'rgba(233, 30, 99, 0.1)',
                borderColor: '#51365F'
              },
            }}
          >
            Just Joined
          </Button>
          <Button
            variant={filters?.nearby ? "contained" : "outlined"}
            onClick={() => handleFilterClick('nearby', filters?.nearby)}
            startIcon={!hasAccess && !filters?.nearby ? <LockIcon sx={{ fontSize: 16 }} /> : null}
            sx={{
              borderColor: filters?.nearby ? '#51365F' : '#e0e0e0',
              backgroundColor: filters?.nearby ? '#51365F' : 'transparent',
              color: filters?.nearby ? 'white' : '#666',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: filters?.nearby ? '#c2185b' : 'rgba(233, 30, 99, 0.1)',
                borderColor: '#51365F'
              },
            }}
          >
            Nearby
          </Button>
        </Box>
      </Box>

      {/* Matches Grid */}
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 3,
          width: '100%',
          maxWidth: '100%'
        }}>
          {[...Array(6)].map((_, index) => (
            <Card key={index} sx={{ height: 280 }}>
              <Skeleton variant="rectangular" width="100%" height={200} />
              <CardContent>
                <Skeleton variant="text" width="80%" height={30} />
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={onRetryLoad}
            sx={{ backgroundColor: '#51365F' }}
          >
            Try Again
          </Button>
        </Box>
      ) : !Array.isArray(filteredMatches) || filteredMatches.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No matches found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or search criteria
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 3,
          width: '100%',
          maxWidth: '100%'
        }}>
          {Array.isArray(filteredMatches) && filteredMatches.map((match) => (
            <MatchCard
              key={match._id}
              match={match}
              onShowInterest={onShowInterest}
              onShowSuperInterest={onShowSuperInterest}
              onViewProfile={onViewProfile}
              onToggleShortlist={onToggleShortlist}
              onChatClick={onChatClick}
              getAge={getAge}
              getHeight={getHeight}
            />
          ))}
          
          {/* Loading More Indicator */}
          {isLoadingMore && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              py: 4 
            }}>
              <CircularProgress size={24} sx={{ color: '#51365F', mr: 2 }} />
              <Typography variant="body2" sx={{ color: '#666' }}>
                Loading more matches...
              </Typography>
            </Box>
          )}
          
          {/* End of Results Indicator */}
          {!hasMoreMatches && Array.isArray(filteredMatches) && filteredMatches.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              py: 4 
            }}>
              <Typography variant="body2" sx={{ color: '#999' }}>
                You've reached the end of the matches
              </Typography>
            </Box>
          )}
        </Box>
      )}

      <FilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        onApply={handleFilterApply}
        filters={filters}
      />
    </>
  );
};

export default MatchesList;
