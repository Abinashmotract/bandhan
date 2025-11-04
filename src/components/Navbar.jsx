import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";
import { getNotifications } from "../store/slices/notificationSlice";
import { showError, showSuccess } from "../utils/toast";
import logo from "../assets/WhatsApp Image 2025-01-28 at 9.41.07 PM.png";

const theme = createTheme({
  palette: {
    primary: {
      main: "#51365F", // Exact logo background color
      light: "#7A5A7A",
      dark: "#3A2640",
    },
    secondary: {
      main: "#FFD700", // Golden color to match logo text
      light: "#FFF176",
      dark: "#F57F17",
    },
    background: {
      default: "#F8F6F9", // Light background complementing logo color
      paper: "#FFFFFF",
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
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, isInitialized } = useSelector(
    (state) => state.auth
  );
  const { unreadCount } = useSelector((state) => state.notification);
  console.log("isInitialized", isInitialized, isAuthenticated);

  // Fetch notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      // Fetch notifications to get unread count (API returns unreadCount in response)
      dispatch(getNotifications({ page: 1, limit: 10 }));
      
      // Set up interval to refresh notifications every 30 seconds
      const interval = setInterval(() => {
        dispatch(getNotifications({ page: 1, limit: 10 }));
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, isInitialized, dispatch]);

  // Function to check if a route is active
  const isActiveRoute = (href) => {
    const normalizedHref = href.startsWith("/") ? href : `/${href}`;
    if (normalizedHref === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(normalizedHref);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      const resultAction = await dispatch(logoutUser());
      if (logoutUser.fulfilled.match(resultAction)) {
        showSuccess(resultAction.payload);
        setLogoutDialogOpen(false);
        navigate("/login");
      } else {
        showError(resultAction.payload || "Logout failed. Please try again.");
        setLogoutDialogOpen(false);
      }
    } catch (error) {
      showError("An error occurred during logout.");
      setLogoutDialogOpen(false);
    }
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  // Public navigation items (visible to all users)
  const publicNavItems = [
    { text: "Home", href: "/" },
    // { text: 'About', href: 'about' },
    // { text: 'Search', href: '/matches' },
    // { text: 'Blog', href: 'blog' },
  ];

  // Authenticated navigation items (only visible to logged-in users)
  const authenticatedNavItems = [
    { text: "Matches", href: "matches" },
    // { text: "Favorites", href: "favorites" },
    // { text: "Horoscope", href: "horoscope" },
    // { text: "Events", href: "events" },
    { text: "Notifications", href: "notifications", showBadge: true, isIcon: true },
  ];

  // Get user info for admin check
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";

  // Combine navigation items based on authentication status
  let navItems = [...publicNavItems];

  if (isAuthenticated) {
    navItems = [...navItems, ...authenticatedNavItems];

    // Add admin link if user is admin
    if (isAdmin) {
      navItems.push({ text: "Admin Panel", href: "admin" });
    }
  }

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: "center",
        background: "var(--drawer-gradient)",
        height: "100%",
        color: "white",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <IconButton sx={{ color: "white" }} onClick={handleDrawerToggle}>
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
                color: isActive ? "#FFD700" : "white",
                justifyContent: "center",
                backgroundColor: isActive
                  ? "rgba(255, 215, 0, 0.1)"
                  : "transparent",
                borderLeft: isActive
                  ? "4px solid #FFD700"
                  : "4px solid transparent",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
              onClick={handleDrawerToggle}
            >
              <ListItemText
                primary={
                  item.isIcon ? (
                    item.showBadge && unreadCount > 0 ? (
                      <Badge badgeContent={unreadCount} color="error">
                        <CircleNotificationsIcon />
                      </Badge>
                    ) : (
                      <CircleNotificationsIcon />
                    )
                  ) : item.showBadge && unreadCount > 0 ? (
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
            color: "white",
            justifyContent: "center",
            backgroundColor: "rgba(255, 215, 0, 0.2)",
            margin: "10px 20px",
            borderRadius: "25px",
            "&:hover": {
              backgroundColor: "rgba(255, 215, 0, 0.3)",
              transform: "scale(1.05)",
            },
            transition: "all 0.3s ease",
          }}
          onClick={handleDrawerToggle}
        >
          <ListItemText
            primary={
              <Box
                sx={{
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontSize: "0.9rem",
                }}
              >
                Upgrade Membership
              </Box>
            }
          />
        </ListItem>

        {!isAuthenticated ? (
          <ListItem
            component={Link}
            to="/login"
            sx={{
              color: "white",
              justifyContent: "center",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <ListItemText primary="Login / Sign Up" />
          </ListItem>
        ) : (
          <ListItem
            sx={{
              color: "white",
              justifyContent: "center",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
            onClick={handleLogoutClick}
          >
            <ListItemText primary={loading ? "Logging out..." : "Logout"} />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="sticky"
        sx={{
          background: "#51375f",
          boxShadow: "0 2px 15px var(--shadow-primary)",
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <img
                src={logo}
                alt="Bandhnam Logo"
                style={{ width: 200, height: 90 }}
              />
            </Link>
          </Box>

          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            {navItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.text}
                  to={item.href}
                  className={`nav-link ${isActive ? "active" : ""}`}
                  style={{ 
                    display: "flex", 
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {item.isIcon ? (
                    item.showBadge && unreadCount > 0 ? (
                      <Badge badgeContent={unreadCount} color="error">
                        <CircleNotificationsIcon sx={{ fontSize: 24 }} />
                      </Badge>
                    ) : (
                      <CircleNotificationsIcon sx={{ fontSize: 24 }} />
                    )
                  ) : (
                    <>
                      {item.text}
                      <span className="nav-underline"></span>
                    </>
                  )}
                </Link>
              );
            })}

            {/* Upgrade Button - Always visible */}
            <Link to="/membership" style={{ textDecoration: "none" }}>
              <button
                style={{
                  background:
                    "linear-gradient(135deg, #FFD700 0%, #F57F17 100%)",
                  color: "#3A2640",
                  border: "none",
                  borderRadius: "25px",
                  padding: "10px 25px",
                  marginLeft: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 8px rgba(255, 215, 0, 0.3)",
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  letterSpacing: "0.5px",
                }}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow =
                    "0 6px 12px rgba(255, 215, 0, 0.4)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = "0 4px 8px rgba(255, 215, 0, 0.3)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Upgrade
              </button>
            </Link>
            {!isInitialized ? (
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #51365F 0%, #3A2640 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  padding: "10px 25px",
                  marginLeft: "15px",
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                Loading...
              </div>
            ) : !isAuthenticated ? (
              <Link to="/login" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    background:
                      "linear-gradient(135deg, #51365F 0%, #3A2640 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "25px",
                    padding: "10px 25px",
                    marginLeft: "15px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    boxShadow: "0 4px 8px rgba(106, 27, 154, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.boxShadow =
                      "0 6px 12px rgba(106, 27, 154, 0.4)";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow =
                      "0 4px 8px rgba(106, 27, 154, 0.3)";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Login / Sign Up
                </button>
              </Link>
            ) : (
              <button
                style={{
                  background:
                    "linear-gradient(135deg, #51365F 0%, #3A2640 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  padding: "10px 25px",
                  marginLeft: "15px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 8px rgba(106, 27, 154, 0.3)",
                }}
                onClick={handleLogoutClick}
                disabled={loading}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow =
                    "0 6px 12px rgba(106, 27, 154, 0.4)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow =
                    "0 4px 8px rgba(106, 27, 154, 0.3)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            )}

            {/* Auth Buttons — keep your existing logic here */}
          </Box>

          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: "none" }, color: "#51365F" }}
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
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "8px",
            background: "linear-gradient(135deg, #F8F6F9 0%, #FFFFFF 100%)",
          },
        }}
      >
        <DialogTitle
          id="logout-dialog-title"
          sx={{ textAlign: "center", pb: 1 }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 600, color: "#51365F" }}
          >
            Confirm Logout
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", pb: 2 }}>
          <Typography variant="body1" sx={{ color: "#51365F" }}>
            Are you sure you want to logout?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
          <Button
            onClick={handleLogoutCancel}
            variant="outlined"
            sx={{
              borderRadius: "25px",
              padding: "8px 24px",
              borderColor: "#51365F",
              color: "#51365F",
              fontWeight: "600",
              "&:hover": {
                borderColor: "#3A2640",
                backgroundColor: "rgba(81, 54, 95, 0.04)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: "25px",
              padding: "8px 24px",
              background: "linear-gradient(135deg, #51365F 0%, #3A2640 100%)",
              fontWeight: "600",
              "&:hover": {
                background: "linear-gradient(135deg, #3A2640 0%, #51365F 100%)",
                boxShadow: "0 4px 12px rgba(81, 54, 95, 0.4)",
              },
            }}
          >
            {loading ? "Logging out..." : "Yes, Logout"}
          </Button>
        </DialogActions>
      </Dialog>

      <style>
        {`
         .nav-link {
    position: relative;
    text-decoration: none;
    color: white;
    font-weight: 500;
    margin: 0 12px;
    padding: 8px 0;
    transition: color 0.3s;
  }

  .nav-link .nav-underline {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0%;
    height: 2px;
    background: #FFD700;
    transition: width 0.3s;
  }

  /* Hover animation */
  .nav-link:hover .nav-underline {
    width: 100%;
  }

  /* Active state */
  .nav-link.active {
    color: #FFD700;
    font-weight: bold;
  }

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
