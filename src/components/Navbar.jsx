import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Box, Typography, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { showError, showSuccess } from '../utils/toast';
import logo from '../assets/WhatsApp Image 2025-01-28 at 9.41.07 PM.png';

const theme = createTheme({
    palette: {
        primary: {
            main: '#51365F', // Exact logo background color
            light: '#7A5A7A',
            dark: '#3A2640',
        },
        secondary: {
            main: '#FFD700', // Golden color to match logo text
            light: '#FFF176',
            dark: '#F57F17',
        },
        background: {
            default: '#F8F6F9', // Light background complementing logo color
            paper: '#FFFFFF',
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
    const location = useLocation();
    const dispatch = useDispatch();
    const { isAuthenticated, loading, isInitialized } = useSelector((state) => state.auth);
    const { unreadCount } = useSelector((state) => state.notification);

    // Function to check if a route is active
    const isActiveRoute = (href) => {
        if (href === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(href);
    };

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

    // Public navigation items (visible to all users)
    const publicNavItems = [
        { text: 'Home', href: '/' },
        // { text: 'About', href: 'about' },
        // { text: 'Search', href: '/matches' },
        // { text: 'Blog', href: 'blog' },
    ];

    // Authenticated navigation items (only visible to logged-in users)
    const authenticatedNavItems = [
        { text: 'Matches', href: 'matches' },
        { text: 'Favorites', href: 'favorites' },
        { text: 'Messages', href: 'chat' },
        { text: 'Horoscope', href: 'horoscope' },
        { text: 'Events', href: 'events' },
        { text: 'Notifications', href: 'notifications', showBadge: true },
        { text: 'Verification', href: 'verification' },
    ];

    // Get user info for admin check
    const user = useSelector((state) => state.auth.user);
    const isAdmin = user?.role === 'admin';
    
    // Combine navigation items based on authentication status
    let navItems = [...publicNavItems];
    
    if (isAuthenticated) {
        navItems = [...navItems, ...authenticatedNavItems];
        
        // Add admin link if user is admin
        if (isAdmin) {
            navItems.push({ text: 'Admin Panel', href: 'admin' });
        }
    }

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', background: 'var(--drawer-gradient)', height: '100%', color: 'white' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                <IconButton sx={{ color: 'white' }} onClick={handleDrawerToggle}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <List>
                {navItems?.map((item) => {
                    const isActive = isActiveRoute(item.href);
                    return (
                        <ListItem
                            key={item.text}
                            component={Link}
                            to={item.href}
                            sx={{
                                color: isActive ? '#FFD700' : 'white',
                                justifyContent: 'center',
                                backgroundColor: isActive ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                                borderLeft: isActive ? '4px solid #FFD700' : '4px solid transparent',
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
                    );
                })}
                
                {/* Upgrade Button for Mobile */}
                <ListItem
                    component={Link}
                    to="/membership"
                    sx={{
                        color: 'white',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 215, 0, 0.2)',
                        margin: '10px 20px',
                        borderRadius: '25px',
                        '&:hover': { 
                            backgroundColor: 'rgba(255, 215, 0, 0.3)',
                            transform: 'scale(1.05)'
                        },
                        transition: 'all 0.3s ease'
                    }}
                    onClick={handleDrawerToggle}
                >
                    <ListItemText 
                        primary={
                            <Box sx={{ 
                                fontWeight: '600', 
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                fontSize: '0.9rem'
                            }}>
                                Upgrade Membership
                            </Box>
                        } 
                    />
                </ListItem>
                
                {!isInitialized ? (
                    <ListItem
                        sx={{
                            color: 'white',
                            justifyContent: 'center',
                        }}
                    >
                        <ListItemText primary="Loading..." />
                    </ListItem>
                ) : !isAuthenticated ? (
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
            <AppBar position="sticky" sx={{ background: '#51375f', boxShadow: '0 2px 15px var(--shadow-primary)' }}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                        <Link to="/" style={{ textDecoration: "none" }}>
                            <img src={logo} alt="Bandhnam Logo" style={{ width: 200, height: 90 }} />
                        </Link>
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                        {navItems.map((item) => {
                            const isActive = isActiveRoute(item.href);
                            return (
                                <Link
                                    key={item.text}
                                    to={item.href}
                                    style={{
                                        textDecoration: 'none',
                                        color: isActive ? '#FFD700' : 'white',
                                        fontWeight: 'bold',
                                        margin: '0 12px',
                                        padding: '8px 0',
                                        position: 'relative',
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    {item?.text}
                                    <span
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            width: isActive ? '100%' : '0',
                                            height: '2px',
                                            background: '#FFD700',
                                            transition: 'all 0.3s',
                                        }}
                                        className="nav-underline"
                                    ></span>
                                </Link>
                            );
                        })}

                        {/* Upgrade Button - Always visible */}
                        <Link to="/membership" style={{ textDecoration: 'none' }}>
                            <button style={{
                                background: 'linear-gradient(135deg, #FFD700 0%, #F57F17 100%)',
                                color: '#3A2640',
                                border: 'none',
                                borderRadius: '25px',
                                padding: '10px 25px',
                                marginLeft: '15px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: '0 4px 8px rgba(255, 215, 0, 0.3)',
                                textTransform: 'uppercase',
                                fontSize: '0.85rem',
                                letterSpacing: '0.5px'
                            }}
                                onMouseEnter={(e) => {
                                    e.target.style.boxShadow = '0 6px 12px rgba(255, 215, 0, 0.4)';
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.boxShadow = '0 4px 8px rgba(255, 215, 0, 0.3)';
                                    e.target.style.transform = 'translateY(0)';
                                }}>
                                Upgrade
                            </button>
                        </Link>

                        {/* Auth Buttons */}
                        {!isInitialized ? (
                            <div style={{
                                background: 'linear-gradient(135deg, #51365F 0%, #3A2640 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '25px',
                                padding: '10px 25px',
                                marginLeft: '15px',
                                fontWeight: '500',
                                textAlign: 'center'
                            }}>
                                Loading...
                            </div>
                        ) : !isAuthenticated ? (
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <button style={{
                                    background: 'linear-gradient(135deg, #51365F 0%, #3A2640 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '25px',
                                    padding: '10px 25px',
                                    marginLeft: '15px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    boxShadow: '0 4px 8px rgba(106, 27, 154, 0.3)'
                                }}
                                    onMouseEnter={(e) => {
                                        e.target.style.boxShadow = '0 6px 12px rgba(106, 27, 154, 0.4)';
                                        e.target.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.boxShadow = '0 4px 8px rgba(106, 27, 154, 0.3)';
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
                                        'linear-gradient(135deg, #3A2640 0%, #51365F 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '25px',
                                    padding: '10px 25px',
                                    marginLeft: '15px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    boxShadow:
                                        '0 4px 8px rgba(58, 38, 64, 0.3)',
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
                        sx={{ display: { md: 'none' }, color: '#51365F' }}
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