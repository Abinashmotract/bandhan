import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Avatar,
    Divider,
    LinearProgress,
    Tooltip
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Report as ReportIcon,
    Analytics as AnalyticsIcon,
    Block as BlockIcon,
    CheckCircle as ApproveIcon,
    Warning as WarningIcon,
    Notifications as NotificationIcon,
    Message as MessageIcon,
    Star as StarIcon,
    TrendingUp as TrendingUpIcon,
    PersonAdd as PersonAddIcon,
    PersonRemove as PersonRemoveIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Send as SendIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { formatTimeAgo, formatDate } from '../utils/dateUtils';
import {
    getDashboardStats,
        getAllUsers,
    getUserDetails,
    updateUserStatus,
    blockUser,
    unblockUser,
    getReports,
    getReportDetails,
    resolveReport,
    getAnalytics,
    sendSystemNotification,
    getSystemNotifications,
    deleteSystemNotification
} from '../store/slices/adminSlice';
import { showSuccess, showError } from '../utils/toast';

const AdminPanel = () => {
    const dispatch = useDispatch();
    const { 
        dashboardStats,
        users,
        reports,
        analytics,
        systemNotifications,
        loading,
        error
    } = useSelector(state => state.admin);

    const [activeTab, setActiveTab] = useState(0);
    const [usersPage, setUsersPage] = useState(0);
    const [reportsPage, setReportsPage] = useState(0);
    const [usersPerPage, setUsersPerPage] = useState(10);
    const [reportsPerPage, setReportsPerPage] = useState(10);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
    const [newNotification, setNewNotification] = useState({
        title: '',
        message: '',
        type: 'info',
        targetUsers: 'all'
    });

    const tabs = [
        { label: 'Dashboard', icon: <DashboardIcon /> },
        { label: 'Users', icon: <PeopleIcon /> },
        { label: 'Reports', icon: <ReportIcon /> },
        { label: 'Analytics', icon: <AnalyticsIcon /> },
        { label: 'Notifications', icon: <NotificationIcon /> }
    ];

    useEffect(() => {
        dispatch(getDashboardStats());
        dispatch(getAllUsers({ page: usersPage + 1, limit: usersPerPage }));
        dispatch(getReports({ page: reportsPage + 1, limit: reportsPerPage }));
        dispatch(getAnalytics());
        dispatch(getSystemNotifications());
    }, [dispatch, usersPage, usersPerPage, reportsPage, reportsPerPage]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleUserStatusChange = async (userId, status) => {
        try {
            await dispatch(updateUserStatus({ userId, status })).unwrap();
            showSuccess(`User ${status} successfully`);
                dispatch(getAllUsers({ page: usersPage + 1, limit: usersPerPage }));
        } catch (error) {
            showError(error || 'Failed to update user status');
        }
    };

    const handleBlockUser = async (userId) => {
        try {
            await dispatch(blockUser(userId)).unwrap();
            showSuccess('User blocked successfully');
                dispatch(getAllUsers({ page: usersPage + 1, limit: usersPerPage }));
        } catch (error) {
            showError(error || 'Failed to block user');
        }
    };

    const handleUnblockUser = async (userId) => {
        try {
            await dispatch(unblockUser(userId)).unwrap();
            showSuccess('User unblocked successfully');
                dispatch(getAllUsers({ page: usersPage + 1, limit: usersPerPage }));
        } catch (error) {
            showError(error || 'Failed to unblock user');
        }
    };

    const handleResolveReport = async (reportId) => {
        try {
            await dispatch(resolveReport(reportId)).unwrap();
            showSuccess('Report resolved successfully');
            dispatch(getReports({ page: reportsPage + 1, limit: reportsPerPage }));
        } catch (error) {
            showError(error || 'Failed to resolve report');
        }
    };

    const handleSendNotification = async () => {
        if (!newNotification.title || !newNotification.message) {
            showError('Please fill in all required fields');
            return;
        }

        try {
            await dispatch(sendSystemNotification(newNotification)).unwrap();
            showSuccess('System notification sent successfully');
            setNotificationDialogOpen(false);
            setNewNotification({ title: '', message: '', type: 'info', targetUsers: 'all' });
            dispatch(getSystemNotifications());
        } catch (error) {
            showError(error || 'Failed to send notification');
        }
    };

    const handleDeleteNotification = async (notificationId) => {
        try {
            await dispatch(deleteSystemNotification(notificationId)).unwrap();
            showSuccess('Notification deleted successfully');
            dispatch(getSystemNotifications());
        } catch (error) {
            showError(error || 'Failed to delete notification');
        }
    };

    const renderDashboard = () => (
        <Grid container spacing={3}>
            {/* Stats Cards */}
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: '#4caf50', mr: 2 }}>
                                <PeopleIcon />
                            </Avatar>
                            <Box>
                                <Typography color="textSecondary" gutterBottom>
                                    Total Users
                                </Typography>
                                <Typography variant="h4">
                                    {dashboardStats?.totalUsers || 0}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: '#2196f3', mr: 2 }}>
                                <PersonAddIcon />
                            </Avatar>
                            <Box>
                                <Typography color="textSecondary" gutterBottom>
                                    New Users (30d)
                                </Typography>
                                <Typography variant="h4">
                                    {dashboardStats?.newUsers || 0}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: '#ff9800', mr: 2 }}>
                                <ReportIcon />
                            </Avatar>
                            <Box>
                                <Typography color="textSecondary" gutterBottom>
                                    Pending Reports
                                </Typography>
                                <Typography variant="h4">
                                    {dashboardStats?.pendingReports || 0}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: '#e91e63', mr: 2 }}>
                                <StarIcon />
                            </Avatar>
                            <Box>
                                <Typography color="textSecondary" gutterBottom>
                                    Active Matches
                                </Typography>
                                <Typography variant="h4">
                                    {dashboardStats?.activeMatches || 0}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Recent Activity
                        </Typography>
                        <List>
                            {dashboardStats?.recentActivity?.map((activity, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={activity.description}
                                        secondary={formatTimeAgo(activity.timestamp)}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Grid>

            {/* System Status */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            System Status
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Database</Typography>
                                <Chip label="Healthy" color="success" size="small" />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">API Services</Typography>
                                <Chip label="Online" color="success" size="small" />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Email Service</Typography>
                                <Chip label="Active" color="success" size="small" />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2">Storage</Typography>
                                <Chip label="85% Used" color="warning" size="small" />
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );

    const renderUsers = () => (
        <Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Joined</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users?.data?.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{ mr: 2 }}>
                                            {user.name?.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2">
                                                {user.name}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                ID: {user._id.slice(-8)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.status}
                                        color={user.status === 'active' ? 'success' : user.status === 'blocked' ? 'error' : 'warning'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {formatTimeAgo(user.createdAt)}
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Tooltip title="View Details">
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setUserDialogOpen(true);
                                                }}
                                            >
                                                <ViewIcon />
                                            </IconButton>
                                        </Tooltip>
                                        
                                        {user.status === 'active' ? (
                                            <Tooltip title="Block User">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleBlockUser(user._id)}
                                                    color="error"
                                                >
                                                    <BlockIcon />
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="Unblock User">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleUnblockUser(user._id)}
                                                    color="success"
                                                >
                                                    <ApproveIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={users?.total || 0}
                rowsPerPage={usersPerPage}
                page={usersPage}
                onPageChange={(event, newPage) => setUsersPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setUsersPerPage(parseInt(event.target.value, 10));
                    setUsersPage(0);
                }}
            />
        </Box>
    );

    const renderReports = () => (
        <Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Reported User</TableCell>
                            <TableCell>Reporter</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports?.data?.map((report) => (
                            <TableRow key={report._id}>
                                <TableCell>{report.reportedUser?.name}</TableCell>
                                <TableCell>{report.reporter?.name}</TableCell>
                                <TableCell>{report.reason}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={report.status}
                                        color={report.status === 'resolved' ? 'success' : 'warning'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {formatTimeAgo(report.createdAt)}
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Tooltip title="View Details">
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setSelectedReport(report);
                                                    setReportDialogOpen(true);
                                                }}
                                            >
                                                <ViewIcon />
                                            </IconButton>
                                        </Tooltip>
                                        
                                        {report.status === 'pending' && (
                                            <Tooltip title="Resolve Report">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleResolveReport(report._id)}
                                                    color="success"
                                                >
                                                    <ApproveIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={reports?.total || 0}
                rowsPerPage={reportsPerPage}
                page={reportsPage}
                onPageChange={(event, newPage) => setReportsPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setReportsPerPage(parseInt(event.target.value, 10));
                    setReportsPage(0);
                }}
            />
        </Box>
    );

    const renderAnalytics = () => (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            User Growth
                        </Typography>
                        <Typography variant="h4" color="primary">
                            {analytics?.userGrowth?.percentage || 0}%
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            vs last month
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Match Success Rate
                        </Typography>
                        <Typography variant="h4" color="success.main">
                            {analytics?.matchSuccessRate || 0}%
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            successful matches
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Activity Overview
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Daily Active Users</Typography>
                                <Typography variant="body2">{analytics?.dailyActiveUsers || 0}</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={75} sx={{ mb: 2 }} />
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Messages Sent Today</Typography>
                                <Typography variant="body2">{analytics?.messagesToday || 0}</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={60} sx={{ mb: 2 }} />
                        </Box>
                        
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">New Matches Today</Typography>
                                <Typography variant="body2">{analytics?.newMatchesToday || 0}</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={45} />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );

    const renderNotifications = () => (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                    System Notifications
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={() => setNotificationDialogOpen(true)}
                >
                    Send Notification
                </Button>
            </Box>

            <List>
                {systemNotifications?.map((notification) => (
                    <ListItem key={notification._id} divider>
                        <ListItemText
                            primary={notification.title}
                            secondary={
                                <Box>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        {notification.message}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <Chip 
                                            label={notification.type} 
                                            size="small" 
                                            color={notification.type === 'warning' ? 'warning' : 'info'}
                                        />
                                        <Typography variant="caption" color="textSecondary">
                                            {formatTimeAgo(notification.createdAt)}
                                        </Typography>
                                    </Box>
                                </Box>
                            }
                        />
                        <ListItemSecondaryAction>
                            <IconButton
                                edge="end"
                                onClick={() => handleDeleteNotification(notification._id)}
                                color="error"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 0: return renderDashboard();
            case 1: return renderUsers();
            case 2: return renderReports();
            case 3: return renderAnalytics();
            case 4: return renderNotifications();
            default: return null;
        }
    };

    return (
        <Box sx={{ py: 4 }}>
            <Container maxWidth="xl">
                <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    {/* Header */}
                    <Box sx={{ 
                        p: 3, 
                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                        color: 'white'
                    }}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Admin Panel
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            Manage users, reports, and system settings
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ m: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Tabs */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                            {tabs.map((tab, index) => (
                                <Tab
                                    key={index}
                                    label={tab.label}
                                    icon={tab.icon}
                                    iconPosition="start"
                                />
                            ))}
                        </Tabs>
                    </Box>

                    {/* Tab Content */}
                    <Box sx={{ p: 3 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            renderTabContent()
                        )}
                    </Box>
                </Paper>

                {/* User Details Dialog */}
                <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} maxWidth="md" fullWidth>
                    <DialogTitle>User Details</DialogTitle>
                    <DialogContent>
                        {selectedUser && (
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    {selectedUser.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Email: {selectedUser.email}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Status: {selectedUser.status}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Joined: {formatDate(selectedUser.createdAt)}
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setUserDialogOpen(false)}>Close</Button>
                    </DialogActions>
                </Dialog>

                {/* Report Details Dialog */}
                <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)} maxWidth="md" fullWidth>
                    <DialogTitle>Report Details</DialogTitle>
                    <DialogContent>
                        {selectedReport && (
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Report #{selectedReport._id.slice(-8)}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    <strong>Reported User:</strong> {selectedReport.reportedUser?.name}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    <strong>Reporter:</strong> {selectedReport.reporter?.name}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    <strong>Reason:</strong> {selectedReport.reason}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    <strong>Description:</strong> {selectedReport.description}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    <strong>Status:</strong> {selectedReport.status}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    <strong>Date:</strong> {formatDate(selectedReport.createdAt)}
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setReportDialogOpen(false)}>Close</Button>
                        {selectedReport?.status === 'pending' && (
                            <Button 
                                onClick={() => handleResolveReport(selectedReport._id)}
                                color="success"
                                variant="contained"
                            >
                                Resolve
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>

                {/* Send Notification Dialog */}
                <Dialog open={notificationDialogOpen} onClose={() => setNotificationDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Send System Notification</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Title"
                            value={newNotification.title}
                            onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                            sx={{ mb: 2, mt: 1 }}
                        />
                        <TextField
                            fullWidth
                            label="Message"
                            multiline
                            rows={4}
                            value={newNotification.message}
                            onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={newNotification.type}
                                onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                                label="Type"
                            >
                                <MenuItem value="info">Info</MenuItem>
                                <MenuItem value="warning">Warning</MenuItem>
                                <MenuItem value="success">Success</MenuItem>
                                <MenuItem value="error">Error</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Target Users</InputLabel>
                            <Select
                                value={newNotification.targetUsers}
                                onChange={(e) => setNewNotification({...newNotification, targetUsers: e.target.value})}
                                label="Target Users"
                            >
                                <MenuItem value="all">All Users</MenuItem>
                                <MenuItem value="active">Active Users Only</MenuItem>
                                <MenuItem value="premium">Premium Users Only</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setNotificationDialogOpen(false)}>Cancel</Button>
                        <Button 
                            onClick={handleSendNotification}
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={20} /> : 'Send'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default AdminPanel;
