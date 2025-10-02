import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Check as CheckIcon,
  Star as StarIcon,
  Diamond as DiamondIcon,
  Crown as CrownIcon,
  Lock as LockIcon,
  Upgrade as UpgradeIcon
} from '@mui/icons-material';
import { useSubscription } from '../contexts/SubscriptionContext';

const SubscriptionStatus = () => {
  const {
    currentSubscription,
    plans,
    openUpgradeModal,
    handleCancelSubscription,
    paymentLoading
  } = useSubscription();

  const currentPlan = plans.find(plan => plan._id === currentSubscription?.plan);

  if (!currentSubscription || !currentPlan) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#000', mb: 2 }}>
            No Active Subscription
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
            You're currently on the free plan. Upgrade to access premium features and connect with more profiles.
          </Typography>
          <Button
            variant="contained"
            startIcon={<UpgradeIcon />}
            onClick={() => openUpgradeModal()}
            sx={{
              background: 'linear-gradient(135deg, #d81b60 0%, #ad1457 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #ad1457 0%, #880e4f 100%)',
              }
            }}
          >
            Upgrade Now
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getPlanIcon = (planName) => {
    switch (planName) {
      case 'Basic': return <LockIcon sx={{ color: '#9c27b0' }} />;
      case 'Entry': return <StarIcon sx={{ color: '#d81b60' }} />;
      case 'Advanced': return <DiamondIcon sx={{ color: '#ff6f00' }} />;
      case 'Premium': return <CrownIcon sx={{ color: '#4caf50' }} />;
      case 'Elite': return <CrownIcon sx={{ color: '#ff9800' }} />;
      default: return <StarIcon />;
    }
  };

  const getPlanColor = (planName) => {
    switch (planName) {
      case 'Basic': return '#9c27b0';
      case 'Entry': return '#d81b60';
      case 'Advanced': return '#ff6f00';
      case 'Premium': return '#4caf50';
      case 'Elite': return '#ff9800';
      default: return '#d81b60';
    }
  };

  const getUsagePercentage = (used, total) => {
    if (total === -1) return 0; // Unlimited
    return Math.min((used / total) * 100, 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'error';
    if (percentage >= 70) return 'warning';
    return 'primary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isExpiringSoon = (endDate) => {
    const daysUntilExpiry = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getPlanIcon(currentPlan.name)}
            <Typography variant="h6" sx={{ color: '#000', fontWeight: 'bold' }}>
              {currentPlan.name} Plan
            </Typography>
            <Chip
              label={currentPlan.planType === 'paid' ? 'Premium' : 'Free'}
              color={currentPlan.planType === 'paid' ? 'primary' : 'default'}
              size="small"
            />
          </Box>
          
          <Button
            variant="outlined"
            onClick={() => openUpgradeModal()}
            sx={{
              borderColor: getPlanColor(currentPlan.name),
              color: getPlanColor(currentPlan.name),
              '&:hover': {
                borderColor: getPlanColor(currentPlan.name),
                backgroundColor: `${getPlanColor(currentPlan.name)}10`
              }
            }}
          >
            Upgrade
          </Button>
        </Box>

        {currentPlan.planType === 'paid' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
              Subscription Details
            </Typography>
            <Typography variant="body2" sx={{ color: '#000' }}>
              Started: {formatDate(currentSubscription.startDate)}
            </Typography>
            <Typography variant="body2" sx={{ color: '#000' }}>
              Expires: {formatDate(currentSubscription.endDate)}
            </Typography>
            {isExpiringSoon(currentSubscription.endDate) && (
              <Chip
                label="Expires Soon"
                color="warning"
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        )}

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h6" sx={{ color: '#000', mb: 2 }}>
          Usage Statistics
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#000' }}>
                  Profile Views
                </Typography>
                <Typography variant="body2" sx={{ color: '#000', fontWeight: 'bold' }}>
                  {currentSubscription.profileViewsUsed || 0} / {currentPlan.profileViews === -1 ? '∞' : currentPlan.profileViews}
                </Typography>
              </Box>
              {currentPlan.profileViews !== -1 && (
                <LinearProgress
                  variant="determinate"
                  value={getUsagePercentage(currentSubscription.profileViewsUsed || 0, currentPlan.profileViews)}
                  color={getUsageColor(getUsagePercentage(currentSubscription.profileViewsUsed || 0, currentPlan.profileViews))}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#000' }}>
                  Interests Sent
                </Typography>
                <Typography variant="body2" sx={{ color: '#000', fontWeight: 'bold' }}>
                  {currentSubscription.interestsUsed || 0} / {currentPlan.interests === -1 ? '∞' : currentPlan.interests}
                </Typography>
              </Box>
              {currentPlan.interests !== -1 && (
                <LinearProgress
                  variant="determinate"
                  value={getUsagePercentage(currentSubscription.interestsUsed || 0, currentPlan.interests)}
                  color={getUsageColor(getUsagePercentage(currentSubscription.interestsUsed || 0, currentPlan.interests))}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              )}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ color: '#000', mb: 2 }}>
          Plan Features
        </Typography>

        <List dense>
          {currentPlan.features.slice(0, 6).map((feature, index) => (
            <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
              <ListItemIcon sx={{ minWidth: 24 }}>
                <CheckIcon sx={{ color: getPlanColor(currentPlan.name), fontSize: 16 }} />
              </ListItemIcon>
              <ListItemText
                primary={feature}
                primaryTypographyProps={{ 
                  fontSize: '0.9rem',
                  color: '#000'
                }}
              />
            </ListItem>
          ))}
          {currentPlan.features.length > 6 && (
            <ListItem sx={{ py: 0.5, px: 0 }}>
              <ListItemText
                primary={`+${currentPlan.features.length - 6} more features`}
                primaryTypographyProps={{ 
                  fontSize: '0.8rem',
                  color: '#666',
                  fontStyle: 'italic'
                }}
              />
            </ListItem>
          )}
        </List>

        {currentPlan.planType === 'paid' && (
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleCancelSubscription}
              disabled={paymentLoading}
              sx={{ width: '100%' }}
            >
              Cancel Subscription
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
