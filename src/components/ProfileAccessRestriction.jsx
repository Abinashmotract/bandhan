import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Lock as LockIcon,
  Star as StarIcon,
  Diamond as DiamondIcon,
  EmojiEvents as CrownIcon
} from '@mui/material';
import { useSubscription } from '../contexts/SubscriptionContext';

const ProfileAccessRestriction = ({ profile, children, onUpgrade }) => {
  const { checkProfileAccess, currentSubscription, plans } = useSubscription();

  const hasAccess = checkProfileAccess(profile);
  const currentPlan = plans.find(plan => plan._id === currentSubscription?.plan);

  if (hasAccess) {
    return children;
  }

  const getRequiredPlan = () => {
    if (profile.requiresSubscription) {
      return plans.find(plan => plan.planType === 'paid' && plan.name === 'Entry');
    }
    return currentPlan;
  };

  const requiredPlan = getRequiredPlan();

  const getPlanIcon = (planName) => {
    switch (planName) {
      case 'Basic': return <LockIcon sx={{ color: '#9c27b0' }} />;
      case 'Entry': return <StarIcon sx={{ color: '#51365F' }} />;
      case 'Advanced': return <DiamondIcon sx={{ color: '#ff6f00' }} />;
      case 'Premium': return <CrownIcon sx={{ color: '#4caf50' }} />;
      case 'Elite': return <CrownIcon sx={{ color: '#ff9800' }} />;
      default: return <StarIcon />;
    }
  };

  const getPlanColor = (planName) => {
    switch (planName) {
      case 'Basic': return '#9c27b0';
      case 'Entry': return '#51365F';
      case 'Advanced': return '#ff6f00';
      case 'Premium': return '#4caf50';
      case 'Elite': return '#ff9800';
      default: return '#51365F';
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Blurred content */}
      <Box
        sx={{
          filter: 'blur(8px)',
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >
        {children}
      </Box>

      {/* Overlay with upgrade prompt */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(2px)',
          zIndex: 10
        }}
      >
        <Card
          sx={{
            maxWidth: 500,
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: `2px solid ${getPlanColor(requiredPlan?.name || 'Entry')}`,
            borderRadius: 3
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              {getPlanIcon(requiredPlan?.name || 'Entry')}
            </Box>
            
            <Typography variant="h5" sx={{ color: '#000', fontWeight: 'bold', mb: 1 }}>
              Premium Profile
            </Typography>
            
            <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
              This profile requires a {requiredPlan?.name || 'Entry'} subscription to view
            </Typography>

            {requiredPlan && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#000', mb: 2 }}>
                  {requiredPlan.name} Plan Features:
                </Typography>
                
                <List dense>
                  {requiredPlan.features.slice(0, 4).map((feature, index) => (
                    <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: getPlanColor(requiredPlan.name)
                          }}
                        />
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
                </List>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => window.history.back()}
                sx={{
                  borderColor: '#666',
                  color: '#666',
                  '&:hover': {
                    borderColor: '#000',
                    color: '#000'
                  }
                }}
              >
                Go Back
              </Button>
              
              <Button
                variant="contained"
                onClick={onUpgrade}
                sx={{
                  background: `linear-gradient(135deg, ${getPlanColor(requiredPlan?.name || 'Entry')} 0%, ${getPlanColor(requiredPlan?.name || 'Entry')}dd 100%)`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${getPlanColor(requiredPlan?.name || 'Entry')}dd 0%, ${getPlanColor(requiredPlan?.name || 'Entry')} 100%)`,
                  }
                }}
              >
                Upgrade Now
              </Button>
            </Box>

            <Typography variant="caption" sx={{ color: '#666', mt: 2, display: 'block' }}>
              Starting from ₹{requiredPlan?.price || 999} per quarter
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ProfileAccessRestriction;
