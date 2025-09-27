import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    IconButton,
    Chip,
    Button,
    Tabs,
    Tab,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Badge,
    Divider,
    Avatar,
    Tooltip
} from '@mui/material';
import {
    Notifications as NotificationIcon,
    Delete as DeleteIcon,
    MarkEmailRead as MarkReadIcon,
    MarkEmailUnread as MarkUnreadIcon,
    ClearAll as ClearAllIcon,
    Favorite as LikeIcon,
    Message as MessageIcon,
    PersonAdd as MatchIcon,
    Security as SecurityIcon,
    Star as StarIcon,
    CheckCircle as CheckIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
    Warning as WarningIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { formatTimeAgo } from '../utils/dateUtils';
import {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    deleteAllNotifications
} from '../store/slices/notificationSlice';
import { showSuccess, showError } from '../utils/toast';

const NotificationsPage = () => {
    const dispatch = useDispatch();
    const { 
        notifications, 
        loading, 
        error,
        unreadCount 
    } = useSelector(state => state.notification);

    const [activeTab, setActiveTab] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    const notificationTypes = [
        { label: 'All', value: 'all', count: notifications?.length || 0 },
        { label: 'Unread', value: 'unread', count: unreadCount || 0 },
        { label: 'Matches', value: 'match', count: notifications?.filter(n => n.type === 'match').length || 0 },
        { label: 'Messages', value: 'message', count: notifications?.filter(n => n.type === 'message').length || 0 },
        { label: 'Likes', value: 'like', count: notifications?.filter(n => n.type === 'like').length || 0 },
        { label: 'System', value: 'system', count: notifications?.filter(n => n.type === 'system').length || 0 }
    ];

    useEffect(() => {
        dispatch(getNotifications());
    }, [dispatch]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await dispatch(markNotificationRead(notificationId)).unwrap();
            showSuccess('Notification marked as read');
        } catch (error) {
            showError(error || 'Failed to mark notification as read');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await dispatch(markAllNotificationsRead()).unwrap();
            showSuccess('All notifications marked as read');
        } catch (error) {
            showError(error || 'Failed to mark all notifications as read');
        }
    };

    const handleDeleteNotification = async (notificationId) => {
        try {
            await dispatch(deleteNotification(notificationId)).unwrap();
            showSuccess('Notification deleted');
            setDeleteDialogOpen(false);
            setSelectedNotification(null);
        } catch (error) {
            showError(error || 'Failed to delete notification');
        }
    };

    const handleDeleteAllNotifications = async () => {
        try {
            await dispatch(deleteAllNotifications()).unwrap();
            showSuccess('All notifications deleted');
            setDeleteDialogOpen(false);
            setSelectedNotification(null);
        } catch (error) {
            showError(error || 'Failed to delete all notifications');
        }
    };

    const openDeleteDialog = (notification) => {
        setSelectedNotification(notification);
        setDeleteDialogOpen(true);
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'like': return <LikeIcon sx={{ color: '#e91e63' }} />;
            case 'match': return <MatchIcon sx={{ color: '#4caf50' }} />;
            case 'message': return <MessageIcon sx={{ color: '#2196f3' }} />;
            case 'system': return <SecurityIcon sx={{ color: '#ff9800' }} />;
            case 'superlike': return <StarIcon sx={{ color: '#ffeb3b' }} />;
            case 'verification': return <CheckIcon sx={{ color: '#4caf50' }} />;
            default: return <NotificationIcon sx={{ color: '#9e9e9e' }} />;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'like': return '#e91e63';
            case 'match': return '#4caf50';
            case 'message': return '#2196f3';
            case 'system': return '#ff9800';
            case 'superlike': return '#ffeb3b';
            case 'verification': return '#4caf50';
            default: return '#9e9e9e';
        }
    };

    const getNotificationTitle = (notification) => {
        switch (notification.type) {
            case 'like':
                return `${notification.senderName} liked your profile`;
            case 'superlike':
                return `${notification.senderName} super liked your profile`;
            case 'match':
                return `New match with ${notification.senderName}!`;
            case 'message':
                return `New message from ${notification.senderName}`;
            case 'system':
                return notification.title || 'System notification';
            case 'verification':
                return 'Verification update';
            default:
                return notification.title || 'Notification';
        }
    };

    const getNotificationDescription = (notification) => {
        switch (notification.type) {
            case 'message':
                return notification.message || 'You have a new message';
            case 'like':
                return 'Someone is interested in your profile';
            case 'superlike':
                return 'You received a super like!';
            case 'match':
                return 'You both liked each other. Start a conversation!';
            case 'verification':
                return notification.message || 'Your verification status has been updated';
            default:
                return notification.message || 'You have a new notification';
        }
    };

    const filteredNotifications = () => {
        const currentFilter = notificationTypes[activeTab]?.value;
        
        if (currentFilter === 'all') {
            return notifications || [];
        } else if (currentFilter === 'unread') {
            return notifications?.filter(n => !n.read) || [];
        } else {
            return notifications?.filter(n => n.type === currentFilter) || [];
        }
    };

    const renderNotificationItem = (notification) => (
        <ListItem
            key={notification._id}
            sx={{
                backgroundColor: notification.read ? 'transparent' : 'rgba(216, 27, 96, 0.05)',
                borderLeft: notification.read ? 'none' : '4px solid #d81b60',
                mb: 1,
                borderRadius: 2,
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
            }}
        >
            <ListItemIcon>
                <Avatar
                    sx={{
                        backgroundColor: getNotificationColor(notification.type),
                        width: 40,
                        height: 40
                    }}
                >
                    {getNotificationIcon(notification.type)}
                </Avatar>
            </ListItemIcon>
            
            <ListItemText
                primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                            variant="subtitle1" 
                            sx={{ 
                                fontWeight: notification.read ? 'normal' : 'bold',
                                color: notification.read ? 'text.primary' : 'text.primary'
                            }}
                        >
                            {getNotificationTitle(notification)}
                        </Typography>
                        {!notification.read && (
                            <Chip 
                                label="New" 
                                size="small" 
                                color="primary" 
                                sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                        )}
                    </Box>
                }
                secondary={
                    <Box>
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                        >
                            {getNotificationDescription(notification)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ScheduleIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                            <Typography variant="caption" color="text.disabled">
                                {formatTimeAgo(notification.createdAt)}
                            </Typography>
                        </Box>
                    </Box>
                }
            />
            
            <ListItemSecondaryAction>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {!notification.read && (
                        <Tooltip title="Mark as read">
                            <IconButton
                                size="small"
                                onClick={() => handleMarkAsRead(notification._id)}
                                sx={{ color: '#4caf50' }}
                            >
                                <MarkReadIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    
                    <Tooltip title="Delete">
                        <IconButton
                            size="small"
                            onClick={() => openDeleteDialog(notification)}
                            sx={{ color: '#f44336' }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </ListItemSecondaryAction>
        </ListItem>
    );

    const renderEmptyState = () => (
        <Box sx={{ textAlign: 'center', py: 8 }}>
            <NotificationIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
                No notifications yet
            </Typography>
            <Typography variant="body2" color="text.disabled">
                {activeTab === 0 ? 'You\'re all caught up!' : 
                 activeTab === 1 ? 'No unread notifications' : 
                 'No notifications of this type'}
            </Typography>
        </Box>
    );

    return (
        <Box sx={{ py: 4 }}>
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    {/* Header */}
                    <Box sx={{ 
                        p: 3, 
                        background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                        color: 'white'
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Notifications
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                    Stay updated with your matches and activities
                                </Typography>
                            </Box>
                            <Badge badgeContent={unreadCount} color="error">
                                <NotificationIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                            </Badge>
                        </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ p: 2, display: 'flex', gap: 2, backgroundColor: '#f5f5f5' }}>
                        <Button
                            variant="outlined"
                            startIcon={<MarkReadIcon />}
                            onClick={handleMarkAllAsRead}
                            disabled={unreadCount === 0 || loading}
                            size="small"
                        >
                            Mark All Read
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<ClearAllIcon />}
                            onClick={() => openDeleteDialog(null)}
                            disabled={!notifications?.length || loading}
                            size="small"
                        >
                            Clear All
                        </Button>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ m: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Tabs */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs 
                            value={activeTab} 
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            {notificationTypes.map((type, index) => (
                                <Tab
                                    key={type.value}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {type.label}
                                            {type.count > 0 && (
                                                <Chip 
                                                    label={type.count} 
                                                    size="small" 
                                                    color={type.value === 'unread' ? 'error' : 'default'}
                                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                                />
                                            )}
                                        </Box>
                                    }
                                />
                            ))}
                        </Tabs>
                    </Box>

                    {/* Notifications List */}
                    <Box sx={{ minHeight: 400, maxHeight: 600, overflow: 'auto' }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                                <CircularProgress />
                            </Box>
                        ) : filteredNotifications().length > 0 ? (
                            <List sx={{ p: 0 }}>
                                {filteredNotifications().map((notification, index) => (
                                    <React.Fragment key={notification._id}>
                                        {renderNotificationItem(notification)}
                                        {index < filteredNotifications().length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        ) : (
                            renderEmptyState()
                        )}
                    </Box>
                </Paper>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        {selectedNotification ? 'Delete Notification' : 'Clear All Notifications'}
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            {selectedNotification 
                                ? 'Are you sure you want to delete this notification?'
                                : 'Are you sure you want to delete all notifications? This action cannot be undone.'
                            }
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => selectedNotification 
                                ? handleDeleteNotification(selectedNotification._id)
                                : handleDeleteAllNotifications()
                            }
                            color="error"
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={20} /> : 'Delete'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default NotificationsPage;
