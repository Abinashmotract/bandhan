import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
  Chip,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack,
  Notifications,
  Person,
  Visibility,
  Phone,
  ContactPhone,
  Search,
  Star,
  CheckCircle,
  TrendingUp,
  Favorite,
  Message
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { notificationsAPI } from '../services/apiService';
import { showSuccess, showError } from '../utils/toast';

const NotificationsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useSelector(state => state.auth);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications on component mount
  useEffect(() => {
    loadNotifications();
    loadNotificationCount();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsAPI.getNotifications();
      if (response.data.success) {
        setNotifications(response.data.data.notifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      showError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationCount = async () => {
    try {
      const response = await notificationsAPI.getNotificationCount();
      if (response.data.success) {
        setUnreadCount(response.data.data.unreadCount);
      }
    } catch (error) {
      console.error('Error loading notification count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      showError('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
      showSuccess('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      showError('Failed to mark all notifications as read');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationsAPI.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      showSuccess('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      showError('Failed to delete notification');
    }
  };

  const premiumBenefits = [
    {
      icon: <Visibility sx={{ color: '#9c27b0', fontSize: 28 }} />,
      title: 'Get upto 3x more profile views',
      description: 'Increase your visibility'
    },
    {
      icon: <Phone sx={{ color: '#ff9800', fontSize: 28 }} />,
      title: 'Unlimited voice & video calls',
      description: 'Connect directly with matches'
    },
    {
      icon: <ContactPhone sx={{ color: '#4caf50', fontSize: 28 }} />,
      title: 'Get access to contact details',
      description: 'Skip the wait, get direct contact'
    },
    {
      icon: <Search sx={{ color: '#2196f3', fontSize: 28 }} />,
      title: 'Perform unlimited searches',
      description: 'Find your perfect match faster'
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'match_of_day':
        return <Star sx={{ color: '#e91e63', fontSize: 24 }} />;
      case 'profile_live':
        return <CheckCircle sx={{ color: '#4caf50', fontSize: 24 }} />;
      case 'profile_view':
        return <Visibility sx={{ color: '#2196f3', fontSize: 24 }} />;
      case 'interest_received':
        return <Favorite sx={{ color: '#e91e63', fontSize: 24 }} />;
      case 'premium_reminder':
        return <TrendingUp sx={{ color: '#ff9800', fontSize: 24 }} />;
      default:
        return <Notifications sx={{ color: '#666', fontSize: 24 }} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'match_of_day':
        return '#e91e63';
      case 'profile_live':
        return '#4caf50';
      case 'profile_view':
        return '#2196f3';
      case 'interest_received':
        return '#e91e63';
      case 'premium_reminder':
        return '#ff9800';
      default:
        return '#666';
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInHours = Math.floor((now - notificationDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w`;
  };

  const renderNotificationCard = (notification) => (
    <motion.div
      key={notification._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          mb: 2,
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          backgroundColor: notification.isRead ? '#fafafa' : '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease'
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            {/* Profile Image or Icon */}
            <Box sx={{ position: 'relative' }}>
              {notification.relatedUserId?.profileImage ? (
                <Avatar
                  src={notification.relatedUserId.profileImage?.startsWith('http') 
                    ? notification.relatedUserId.profileImage 
                    : `http://localhost:3000/uploads/${notification.relatedUserId.profileImage}`}
                  sx={{ width: 50, height: 50, border: '2px solid #e91e63' }}
                />
              ) : (
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    backgroundColor: getNotificationColor(notification.type),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {getNotificationIcon(notification.type)}
                </Box>
              )}
              {!notification.isRead && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#e91e63'
                  }}
                />
              )}
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', fontSize: '1rem' }}>
                  {notification.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
                    {formatTimeAgo(notification.createdAt)}
                  </Typography>
                  {!notification.isRead && (
                    <Button
                      size="small"
                      onClick={() => handleMarkAsRead(notification._id)}
                      sx={{ minWidth: 'auto', p: 0.5 }}
                    >
                      <CheckCircle sx={{ fontSize: 16, color: '#4caf50' }} />
                    </Button>
                  )}
                </Box>
              </Box>
              
              <Typography variant="body2" sx={{ color: '#666', mb: 2, lineHeight: 1.5 }}>
                {notification.message}
              </Typography>

              {notification.actionText && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: '#e91e63',
                      color: '#e91e63',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 2,
                      py: 0.5,
                      '&:hover': {
                        backgroundColor: '#e91e63',
                        color: 'white'
                      }
                    }}
                  >
                    {notification.actionText}
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleDeleteNotification(notification._id)}
                    sx={{ minWidth: 'auto', p: 0.5, color: '#f44336' }}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderPremiumSidebar = () => (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0'
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: '#333',
          mb: 3,
          textAlign: 'center',
          '& span': { color: '#e91e63' }
        }}
      >
        You are <span>missing</span> out on the premium benefits!
      </Typography>

      <List sx={{ mb: 3 }}>
        {premiumBenefits.map((benefit, index) => (
          <ListItem key={index} sx={{ px: 0, py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              {benefit.icon}
            </ListItemIcon>
            <ListItemText
              primary={benefit.title}
              secondary={benefit.description}
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#333'
              }}
              secondaryTypographyProps={{
                fontSize: '0.8rem',
                color: '#666'
              }}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
          Flat 54% OFF till 17 Oct
        </Typography>
      </Box>

      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: '#e91e63',
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: 2,
          '&:hover': {
            backgroundColor: '#c2185b'
          }
        }}
      >
        Upgrade now →
      </Button>
    </Paper>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #e0e0e0',
          p: 2,
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton>
            <ArrowBack sx={{ color: '#666' }} />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>
            What's New?
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                  Recent
                </Typography>
                {unreadCount > 0 && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleMarkAllAsRead}
                    sx={{
                      borderColor: '#4caf50',
                      color: '#4caf50',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#4caf50',
                        color: 'white'
                      }
                    }}
                  >
                    Mark all as read
                  </Button>
                )}
              </Box>
              
              {loading ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" sx={{ color: '#666' }}>
                    Loading notifications...
                  </Typography>
                </Box>
              ) : notifications.length > 0 ? (
                <Box>
                  {notifications.map(renderNotificationCard)}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Notifications sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                    No notifications yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    We'll notify you when there's something new
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Premium Sidebar */}
          {!isMobile && (
            <Grid item xs={12} lg={4}>
              {renderPremiumSidebar()}
            </Grid>
          )}
        </Grid>

        {/* Mobile Premium Section */}
        {isMobile && (
          <Box sx={{ mt: 3 }}>
            {renderPremiumSidebar()}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default NotificationsPage;