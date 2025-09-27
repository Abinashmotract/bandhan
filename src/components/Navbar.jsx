import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Box, Typography, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { showError, showSuccess } from '../utils/toast';

const theme = createTheme({
    palette: {
        primary: {
            main: '#d81b60',
        },
        secondary: {
            main: '#f8bbd0',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h6: {
            fontWeight: 600,
        },
    },
});

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, loading } = useSelector((state) => state.auth);
    const { unreadCount } = useSelector((state) => state.notification);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = async () => {
        try {
            const resultAction = await dispatch(logoutUser());
            if (logoutUser.fulfilled.match(resultAction)) {
                showSuccess(resultAction.payload);
                navigate('/login');
            } else {
                showError(resultAction.payload || "Logout failed. Please try again.");
            }
        } catch (error) {
            showError("An error occurred during logout.");
        }
    };

    const navItems = [
        { text: 'Search', href: 'search-match' },
        { text: 'Matches', href: 'matches' },
        { text: 'Messages', href: 'chat' },
        { text: 'Notifications', href: 'notifications', showBadge: true },
        { text: 'Verification', href: 'verification' },
        { text: 'Profile', href: 'profile' },
    ];

    // Add admin link if user is admin
    const user = useSelector((state) => state.auth.user);
    const isAdmin = user?.role === 'admin';
    
    if (isAdmin) {
        navItems.push({ text: 'Admin Panel', href: 'admin' });
    }

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)', height: '100%', color: 'white' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                <IconButton sx={{ color: 'white' }} onClick={handleDrawerToggle}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <List>
                {navItems?.map((item) => (
                    <ListItem
                        key={item.text}
                        component={Link}
                        to={item.href}
                        sx={{
                            color: 'white',
                            justifyContent: 'center',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                        }}
                        onClick={handleDrawerToggle}
                    >
                        <ListItemText 
                            primary={
                                item.showBadge && unreadCount > 0 ? (
                                    <Badge badgeContent={unreadCount} color="error">
                                        {item.text}
                                    </Badge>
                                ) : (
                                    item.text
                                )
                            } 
                        />
                    </ListItem>
                ))}
                {!isAuthenticated ? (
                    <ListItem
                        component={Link}
                        to="/login"
                        sx={{
                            color: 'white',
                            justifyContent: 'center',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.1)',
                            },
                        }}
                    >
                        <ListItemText primary="Login / Sign Up" />
                    </ListItem>
                ) : (
                    <ListItem
                        sx={{
                            color: 'white',
                            justifyContent: 'center',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.1)',
                            },
                        }}
                        onClick={handleLogout}
                    >
                        <ListItemText
                            primary={loading ? 'Logging out...' : 'Logout'}
                        />
                    </ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="sticky" sx={{ background: 'linear-gradient(135deg, #ffffff 0%, #fff9fb 100%)', boxShadow: '0 2px 15px rgba(0, 0, 0, 0.08)' }}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                        <Link to="/" style={{ textDecoration: "none" }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 800,
                                    letterSpacing: "2px",
                                    textTransform: "uppercase",
                                    background: "linear-gradient(135deg, #d81b60 0%, #880e4f 100%)",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    fontFamily: "'Poppins', sans-serif",
                                }}
                            >
                                bandhnam
                            </Typography>
                        </Link>
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                        {navItems.map((item) => (
                            <Link
                                key={item.text}
                                to={item.href}
                                style={{
                                    textDecoration: 'none',
                                    color: '#37474f',
                                    fontWeight: '500',
                                    margin: '0 12px',
                                    padding: '8px 0',
                                    position: 'relative',
                                    transition: 'all 0.3s',
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = '#d81b60';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = '#37474f';
                                }}
                            >
                                {item.text}
                                <span
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        width: '0',
                                        height: '2px',
                                        background: '#d81b60',
                                        transition: 'all 0.3s',
                                    }}
                                    className="nav-underline"
                                ></span>
                            </Link>
                        ))}

                        {/* Auth Buttons */}
                        {!isAuthenticated ? (
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <button style={{
                                    background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '25px',
                                    padding: '10px 25px',
                                    marginLeft: '15px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    boxShadow: '0 4px 8px rgba(216, 27, 96, 0.3)'
                                }}
                                    onMouseEnter={(e) => {
                                        e.target.style.boxShadow = '0 6px 12px rgba(216, 27, 96, 0.4)';
                                        e.target.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.boxShadow = '0 4px 8px rgba(216, 27, 96, 0.3)';
                                        e.target.style.transform = 'translateY(0)';
                                    }}>
                                    Login / Sign Up
                                </button>
                            </Link>
                        ) : (
                            <button
                                onClick={handleLogout}
                                disabled={loading}
                                style={{
                                    background:
                                        'linear-gradient(135deg, #880e4f 0%, #d81b60 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '25px',
                                    padding: '10px 25px',
                                    marginLeft: '15px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    boxShadow:
                                        '0 4px 8px rgba(136, 14, 79, 0.3)',
                                }}
                            >
                                {loading ? 'Logging out...' : 'Logout'}
                            </button>
                        )}
                    </Box>

                    {/* Mobile menu button */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ display: { md: 'none' }, color: '#d81b60' }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
                }}
            >
                {drawer}
            </Drawer>

            <style>
                {`
                a:hover .nav-underline {
                    width: 100% !important;
                }
                
                @media (max-width: 900px) {
                    .desktop-nav {
                    display: none;
                    }
                }
                `}
            </style>
        </ThemeProvider>
    );
};

export default Navbar;