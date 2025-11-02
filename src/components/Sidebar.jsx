import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  Message as MessageIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  CameraAlt as CameraAltIcon,
  Edit as EditIcon,
  AttachMoney as AttachMoneyIcon,
  Phone as PhoneIcon,
  ContactPhone as ContactPhoneIcon,
  Search as SearchIconAlt,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

const Sidebar = ({ 
  user, 
  editingProfile, 
  middleSectionView, 
  onViewChange, 
  onEditProfile
}) => {
  // Get user ID from backend customId ONLY - no frontend generation
  const getUserDisplayId = () => {
    // Only use backend-provided customId - never generate on frontend
    return user?.customId || editingProfile?.customId || "Loading...";
  };
  return (
    <Box sx={{ 
      width: 280, 
      backgroundColor: '#f8f9fa', 
      borderRight: '1px solid #e0e0e0',
      minHeight: '100vh',
      p: 3
    }}>
      {/* User Profile */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
            src={user?.profileImage?.startsWith('http') ? user.profileImage : user?.profileImage ? `http://localhost:3000/uploads/${user.profileImage}` : editingProfile?.profileImage}
            sx={{ 
              width: 80, 
              height: 80, 
              mx: 'auto', 
              mb: 2,
              backgroundColor: '#e0e0e0',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)'
              }
            }}
            onClick={onEditProfile}
          />
          <Box sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: '#51365F',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#c2185b',
              transform: 'scale(1.1)'
            }
          }}>
            <CameraAltIcon sx={{ color: 'white', fontSize: 14 }} />
          </Box>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', mb: 0.5 }}>
          Hi {user?.name || editingProfile?.name || 'User'}!
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
          {getUserDisplayId()}
        </Typography>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={onEditProfile}
          sx={{ 
            color: '#51365F', 
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: 'rgba(233, 30, 99, 0.1)'
            }
          }}
        >
          Edit Profile
        </Button>
      </Box>

      {/* Navigation */}
      <List sx={{ mb: 4 }}>
        <ListItemButton 
          sx={{ 
            borderRadius: 1, 
            mb: 1, 
            backgroundColor: middleSectionView === 'matches' ? '#51365F' : 'transparent',
            color: middleSectionView === 'matches' ? 'white' : 'inherit',
            '&:hover': {
              backgroundColor: middleSectionView === 'matches' ? '#c2185b' : 'rgba(233, 30, 99, 0.1)'
            }
          }}
          onClick={() => onViewChange('matches')}
        >
          <ListItemIcon sx={{ color: middleSectionView === 'matches' ? 'white' : 'inherit' }}>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Matches" />
          <KeyboardArrowRightIcon />
        </ListItemButton>
        <ListItemButton 
          sx={{ 
            borderRadius: 1, 
            mb: 1,
            backgroundColor: middleSectionView === 'activity' ? '#51365F' : 'transparent',
            color: middleSectionView === 'activity' ? 'white' : 'inherit',
            '&:hover': {
              backgroundColor: middleSectionView === 'activity' ? '#c2185b' : 'rgba(233, 30, 99, 0.1)'
            }
          }}
          onClick={() => onViewChange('activity')}
        >
          <ListItemIcon sx={{ color: middleSectionView === 'activity' ? 'white' : 'inherit' }}>
            <TrendingUpIcon />
          </ListItemIcon>
          <ListItemText primary="Activity" />
          <KeyboardArrowRightIcon />
        </ListItemButton>
        <ListItemButton 
          sx={{ 
            borderRadius: 1, 
            mb: 1,
            backgroundColor: middleSectionView === 'search' ? '#51365F' : 'transparent',
            color: middleSectionView === 'search' ? 'white' : 'inherit',
            '&:hover': {
              backgroundColor: middleSectionView === 'search' ? '#c2185b' : 'rgba(233, 30, 99, 0.1)'
            }
          }}
          onClick={() => onViewChange('search')}
        >
          <ListItemIcon sx={{ color: middleSectionView === 'search' ? 'white' : 'inherit' }}>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText primary="Search" />
          <KeyboardArrowRightIcon />
        </ListItemButton>
        <ListItemButton 
          sx={{ 
            borderRadius: 1, 
            mb: 1,
            backgroundColor: middleSectionView === 'messenger' ? '#51365F' : 'transparent',
            color: middleSectionView === 'messenger' ? 'white' : 'inherit',
            '&:hover': {
              backgroundColor: middleSectionView === 'messenger' ? '#c2185b' : 'rgba(233, 30, 99, 0.1)'
            }
          }}
          onClick={() => onViewChange('messenger')}
        >
          <ListItemIcon sx={{ color: middleSectionView === 'messenger' ? 'white' : 'inherit' }}>
            <MessageIcon />
          </ListItemIcon>
          <ListItemText primary="Messenger" />
          <KeyboardArrowRightIcon />
        </ListItemButton>
      </List>

      {/* Upgrade Section */}
      <Box sx={{ 
        backgroundColor: 'white', 
        borderRadius: 2, 
        p: 2, 
        border: '1px solid #e0e0e0'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
          Upgrade
        </Typography>
        <Box sx={{ 
          backgroundColor: '#4caf50', 
          color: 'white', 
          borderRadius: 1, 
          px: 1, 
          py: 0.5, 
          display: 'inline-block',
          mb: 1
        }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            54% Off
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Premium Benefits
          </Typography>
          <KeyboardArrowRightIcon sx={{ color: '#666' }} />
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
