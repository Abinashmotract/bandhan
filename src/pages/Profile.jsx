import React, {useEffect, useState} from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Chip,
    Button,
    IconButton,
    Tabs,
    Tab,
    Avatar,
    Card,
    CardMedia,
    Rating,
    Fab,
} from "@mui/material";
import {
    Favorite,
    FavoriteBorder,
    LocationOn,
    Work,
    School,
    Cake,
    Language,
    Message,
    VerifiedUser,
    PhotoCamera,
    Person,
    Delete,
} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {fetchUserDetails} from "../store/slices/authSlice";
import PreferencesDialog from "../components/PreferencesDialog";
import SubscriptionStatus from "../components/SubscriptionStatus";
import PersonIcon from "@mui/icons-material/Person";
import {Edit} from "@mui/icons-material";
import {useRef} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {API_BASE_URL} from "../utils/api";
import {CircularProgress} from "@mui/material";

// Tab panel component
function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{py: 3}}>{children}</Box>}
        </div>
    );
}

const Profile = () => {
    const [tabValue, setTabValue] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [preferences, setPreferences] = useState({
        ageRange: {min: 28, max: 35},
        height: "",
        maritalStatus: "",
        religion: "",
        education: "",
        profession: "",
        location: "",
        diet: "",
    });

    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const accessToken = Cookies.get("accessToken");
    const {user, loading} = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user) {
            dispatch(fetchUserDetails());
        }
    }, [dispatch, user]);

    if (loading || !user) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    background: "#f5f5f5",
                }}
            >
                <CircularProgress color="secondary" />
            </Box>
        );
    }

    const calculateAge = (dob) => {
        if (!dob) return "";
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleFavoriteClick = () => {
        setIsFavorite(!isFavorite);
    };

    const handleProfilePictureClick = () => {
        fileInputRef.current?.click();
    };

    const handleProfilePictureUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append("profileImage", file);
            const response = await axios.put(`${API_BASE_URL}/auth/user/profile-picture`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.data.success) {
                dispatch(fetchUserDetails());
                alert("Profile picture updated successfully!");
            }
        } catch (error) {
            console.error("Profile picture upload error:", error);
            alert("Failed to upload profile picture. Please try again.");
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                py: 4,
                position: "relative",
                overflow: "hidden",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                    zIndex: 0,
                },
            }}
        >
            <Container maxWidth="lg" sx={{position: "relative", zIndex: 1}}>
                <Paper
                    elevation={10}
                    sx={{
                        borderRadius: "20px",
                        overflow: "hidden",
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
                        mb: 4,
                        position: "relative",
                    }}
                >
                    <Box
                        sx={{
                            height: "200px",
                            background: "#51365F",
                            position: "relative",
                        }}
                    >
                        <Fab
                            size="small"
                            color="primary"
                            sx={{
                                position: "absolute",
                                bottom: -20,
                                right: 20,
                                background: "#51365F",
                            }}
                        >
                            <PhotoCamera />
                        </Fab>
                    </Box>

                    {/* Profile Content */}
                    <Box sx={{p: 4, pt: 0}}>
                        <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "flex-end", mt: -8}}>
                            <Box
                                sx={{
                                    position: "relative",
                                    "&:hover .edit-icon": {
                                        opacity: 1,
                                    },
                                    "&:hover .verified-icon": {
                                        opacity: 0,
                                    },
                                }}
                            >
                                <Avatar
                                    src={
                                        user?.profileImage ||
                                        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                                    }
                                    sx={{
                                        width: 150,
                                        height: 150,
                                        border: "5px solid white",
                                        boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
                                        cursor: "pointer",
                                        transition: "opacity 0.3s ease",
                                        "&:hover": {
                                            opacity: 0.8,
                                        },
                                    }}
                                    onClick={handleProfilePictureClick}
                                />
                                <IconButton
                                    className="edit-icon"
                                    sx={{
                                        position: "absolute",
                                        bottom: 10,
                                        right: 10,
                                        backgroundColor: "#51365F",
                                        color: "white",
                                        opacity: 0,
                                        transition: "opacity 0.3s ease",
                                        "&:hover": {
                                            backgroundColor: "#880e4f",
                                        },
                                    }}
                                    onClick={handleProfilePictureClick}
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    hidden
                                    accept="image/*"
                                    onChange={handleProfilePictureUpload}
                                />
                                <VerifiedUser
                                    className="verified-icon"
                                    sx={{
                                        position: "absolute",
                                        bottom: 10,
                                        right: 10,
                                        color: "#51365F",
                                        background: "white",
                                        borderRadius: "50%",
                                        padding: "2px",
                                        fontSize: "28px",
                                        transition: "opacity 0.3s ease",
                                    }}
                                />
                            </Box>

                            {/* Action Buttons */}
                            <Box sx={{display: "flex", gap: 2}}>
                                <IconButton
                                    onClick={handleFavoriteClick}
                                    sx={{
                                        background: "#51365F",
                                        color: "white",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)",
                                        },
                                    }}
                                >
                                    {isFavorite ? <Favorite /> : <FavoriteBorder />}
                                </IconButton>
                                <Button
                                    variant="contained"
                                    startIcon={<Message />}
                                    sx={{
                                        borderRadius: "50px",
                                        textTransform: "none",
                                        background: "#51365F",
                                        px: 3,
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)",
                                        },
                                    }}
                                >
                                    Send Message
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleOpenDialog}
                                    startIcon={<PersonIcon />}
                                    sx={{
                                        borderRadius: "50px",
                                        textTransform: "none",
                                        background: "#51365F",
                                        px: 3,
                                        "&:hover": {background: "linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)"},
                                    }}
                                >
                                    Update Profile
                                </Button>
                            </Box>
                        </Box>

                        {/* User Info */}
                        <Box sx={{mt: 2}}>
                            <Box sx={{display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 1}}>
                                <Typography variant="h4" sx={{fontWeight: 700, color: "#51365F"}}>
                                    {user?.name}
                                </Typography>
                                <Chip
                                    label={`${calculateAge(user?.dob)} years`}
                                    variant="outlined"
                                    sx={{color: "#51365F", borderColor: "#51365F"}}
                                />
                            </Box>

                            <Box sx={{display: "flex", flexWrap: "wrap", gap: 2, mb: 3}}>
                                <Typography
                                    variant="body2"
                                    component="a"
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                        user?.location || ""
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        color: "#78909c",
                                        textDecoration: "none",
                                        cursor: "pointer",
                                        "&:hover": {
                                            color: "blue",
                                        },
                                    }}
                                >
                                    <LocationOn sx={{fontSize: "18px", mr: 0.5, color: "#51365F"}} />
                                    {user?.location}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{display: "flex", alignItems: "center", color: "#78909c"}}
                                >
                                    <Work sx={{fontSize: "18px", mr: 0.5, color: "#51365F"}} /> {user?.occupation}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{display: "flex", alignItems: "center", color: "#78909c"}}
                                >
                                    <School sx={{fontSize: "18px", mr: 0.5, color: "#51365F"}} /> {user?.education}
                                </Typography>
                            </Box>

                            {/* Match Score */}
                            <Box sx={{display: "flex", alignItems: "center", gap: 2, mb: 3}}>
                                <Box sx={{width: "100%", maxWidth: 300}}>
                                    <Box sx={{display: "flex", justifyContent: "space-between", mb: 0.5}}>
                                        <Typography variant="body2" sx={{color: "#78909c"}}>
                                            Profile Completeness
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: user?.profileCompletion === 100 ? "green" : "#51365F",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {user?.profileCompletion || 0}%
                                        </Typography>
                                    </Box>
                                    <Box sx={{width: "100%", height: 8, backgroundColor: "#f5f5f5", borderRadius: 4}}>
                                        <Box
                                            sx={{
                                                width: `${user?.profileCompletion || 0}%`,
                                                height: "100%",
                                                background:
                                                    user?.profileCompletion === 100
                                                        ? "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)" // Green gradient
                                                        : "#51365F", // Pink gradient
                                                borderRadius: 4,
                                                transition: "width 0.5s ease-in-out",
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Box sx={{textAlign: "center"}}>
                                    <Typography variant="h6" sx={{color: "#51365F", fontWeight: 700}}>
                                        {user?.matches || 0}%
                                    </Typography>
                                    <Typography variant="body2" sx={{color: "#78909c"}}>
                                        Match Score
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* Subscription Status - Highlighted */}
                    <Box sx={{ px: 4, pb: 2 }}>
                        <SubscriptionStatus />
                    </Box>

                    {/* Tabs */}
                    <Box
                        sx={{
                            position: "relative",
                            mb: 4,
                            background: "rgba(255, 255, 255, 0.95)",
                            borderRadius: "16px",
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                            mx: "auto",
                            maxWidth: "fit-content",
                            overflow: "hidden",
                            border: "1px solid rgba(216, 27, 96, 0.1)",
                        }}
                    >
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            sx={{
                                "& .MuiTabs-indicator": {
                                    height: "100%",
                                    background:
                                        "linear-gradient(135deg, rgba(216, 27, 96, 0.08) 0%, rgba(136, 14, 79, 0.05) 100%)",
                                    borderRadius: "16px",
                                    zIndex: 0,
                                    animation: "slideIndicator 0.4s ease-out",
                                    "@keyframes slideIndicator": {
                                        "0%": {opacity: 0, transform: "scale(0.95)"},
                                        "100%": {opacity: 1, transform: "scale(1)"},
                                    },
                                },
                                "& .MuiTab-root": {
                                    textTransform: "none",
                                    fontSize: "1rem",
                                    fontWeight: 500,
                                    color: "#78909c",
                                    padding: "16px 32px",
                                    transition: "all 0.3s ease",
                                    minHeight: "0px",
                                    zIndex: 1,
                                    position: "relative",
                                    "&.Mui-selected": {
                                        color: "#51365F",
                                        fontWeight: 600,
                                    },
                                },
                            }}
                        >
                            <Tab
                                icon={<Person sx={{fontSize: "20px", mb: 0.5}} />}
                                iconPosition="start"
                                label={
                                    <Box sx={{display: "flex", alignItems: "center"}}>
                                        About
                                        <Box
                                            sx={{
                                                ml: 1,
                                                background: tabValue === 0 ? "#51365F" : "rgba(216, 27, 96, 0.1)",
                                                color: tabValue === 0 ? "white" : "#51365F",
                                                borderRadius: "10px",
                                                px: 1,
                                                py: 0.2,
                                                fontSize: "0.7rem",
                                                fontWeight: "bold",
                                                transition: "all 0.3s ease",
                                            }}
                                        >
                                            5
                                        </Box>
                                    </Box>
                                }
                            />
                            <Tab
                                icon={<PhotoCamera sx={{fontSize: "20px", mb: 0.5}} />}
                                iconPosition="start"
                                label={
                                    <Box sx={{display: "flex", alignItems: "center"}}>
                                        Photos
                                        <Box
                                            sx={{
                                                ml: 1,
                                                background: tabValue === 1 ? "#51365F" : "rgba(216, 27, 96, 0.1)",
                                                color: tabValue === 1 ? "white" : "#51365F",
                                                borderRadius: "10px",
                                                px: 1,
                                                py: 0.2,
                                                fontSize: "0.7rem",
                                                fontWeight: "bold",
                                                transition: "all 0.3s ease",
                                            }}
                                        >
                                            12
                                        </Box>
                                    </Box>
                                }
                            />
                            <Tab
                                icon={<Favorite sx={{fontSize: "20px", mb: 0.5}} />}
                                iconPosition="start"
                                label={
                                    <Box sx={{display: "flex", alignItems: "center"}}>
                                        Family
                                        <Box
                                            sx={{
                                                ml: 1,
                                                background: tabValue === 2 ? "#51365F" : "rgba(216, 27, 96, 0.1)",
                                                color: tabValue === 2 ? "white" : "#51365F",
                                                borderRadius: "10px",
                                                px: 1,
                                                py: 0.2,
                                                fontSize: "0.7rem",
                                                fontWeight: "bold",
                                                transition: "all 0.3s ease",
                                            }}
                                        >
                                            6
                                        </Box>
                                    </Box>
                                }
                            />
                            <Tab
                                icon={<Favorite sx={{fontSize: "20px", mb: 0.5}} />}
                                iconPosition="start"
                                label={
                                    <Box sx={{display: "flex", alignItems: "center"}}>
                                        Preferences
                                        <Box
                                            sx={{
                                                ml: 1,
                                                background: tabValue === 3 ? "#51365F" : "rgba(216, 27, 96, 0.1)",
                                                color: tabValue === 3 ? "white" : "#51365F",
                                                borderRadius: "10px",
                                                px: 1,
                                                py: 0.2,
                                                fontSize: "0.7rem",
                                                fontWeight: "bold",
                                                transition: "all 0.3s ease",
                                            }}
                                        >
                                            8
                                        </Box>
                                    </Box>
                                }
                            />
                        </Tabs>
                    </Box>
                </Paper>

                {/* Tab Content */}
                <Paper
                    elevation={10}
                    sx={{
                        borderRadius: "20px",
                        overflow: "hidden",
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
                        p: 4,
                    }}
                >
                    <TabPanel value={tabValue} index={0}>
                        <Grid container spacing={2}>
                            <Grid size={{xs: 12, md: 8}}>
                                <Typography variant="h6" gutterBottom sx={{color: "#51365F", fontWeight: 600}}>
                                    About Me
                                </Typography>
                                <Typography variant="body1" sx={{color: "#37474f", lineHeight: 1.7, mb: 4}}>
                                    {user?.about}
                                </Typography>

                                <Typography variant="h6" gutterBottom sx={{color: "#51365F", fontWeight: 600}}>
                                    Interests
                                </Typography>
                                <Box sx={{display: "flex", flexWrap: "wrap", gap: 1, mb: 4}}>
                                    {user?.interests.map((interest, index) => (
                                        <Chip
                                            key={index}
                                            label={interest}
                                            sx={{
                                                background:
                                                    "linear-gradient(135deg, rgba(216, 27, 96, 0.1) 0%, rgba(136, 14, 79, 0.05) 100%)",
                                                color: "#51365F",
                                                fontWeight: 500,
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Grid>

                            <Grid size={{xs: 12, md: 4}}>
                                <Typography variant="h6" gutterBottom sx={{color: "#51365F", fontWeight: 600}}>
                                    Basic Details
                                </Typography>
                                <Box sx={{mb: 3}}>
                                    <DetailItem icon={<Cake />} label="Email Id" value={user?.email || "N/A"} />
                                    <DetailItem
                                        icon={<Cake />}
                                        label="Age"
                                        value={`${calculateAge(user?.dob)} years`}
                                    />
                                    <DetailItem icon={<Work />} label="Profession" value={user?.occupation} />
                                    <DetailItem icon={<School />} label="Education" value={user?.education || "N/A"} />
                                    <DetailItem
                                        icon={<Language />}
                                        label="Mother Tongue"
                                        value={user?.motherTongue || "N/A"}
                                    />
                                </Box>

                                <Typography variant="h6" gutterBottom sx={{color: "#51365F", fontWeight: 600}}>
                                    Background
                                </Typography>
                                <Box>
                                    <DetailItem label="Religion" value={user?.religion} />
                                    <DetailItem label="Caste" value={user?.caste} />
                                    <DetailItem label="Height" value={user?.height} />
                                </Box>
                            </Grid>
                        </Grid>
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3}}>
                            <Typography variant="h6" gutterBottom sx={{color: "#51365F", fontWeight: 600}}>
                                Photos
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<PhotoCamera />}
                                onClick={handleProfilePictureClick}
                                sx={{
                                    borderRadius: "20px",
                                    borderColor: "#51365F",
                                    color: "#51365F",
                                    "&:hover": {
                                        borderColor: "#51365F",
                                        backgroundColor: "rgba(216, 27, 96, 0.1)",
                                    },
                                }}
                            >
                                Add Photos
                            </Button>
                        </Box>
                        
                        {user?.photos && user.photos.length > 0 ? (
                            <Grid container spacing={2}>
                                {user.photos.map((photo, index) => (
                                    <Grid size={{xs: 12, sm: 6, md: 4}} key={index}>
                                        <Card sx={{borderRadius: "12px", overflow: "hidden", position: "relative"}}>
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={photo}
                                                alt={`Profile photo ${index + 1}`}
                                                sx={{cursor: "pointer"}}
                                                onClick={() => {
                                                    // Open photo in full screen
                                                    window.open(photo, '_blank');
                                                }}
                                            />
                                            <Box sx={{
                                                position: "absolute",
                                                top: 8,
                                                right: 8,
                                                display: "flex",
                                                gap: 1
                                            }}>
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: "rgba(0,0,0,0.5)",
                                                        color: "white",
                                                        "&:hover": {
                                                            backgroundColor: "rgba(0,0,0,0.7)",
                                                        }
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Set as profile picture
                                                        console.log("Set as profile picture");
                                                    }}
                                                >
                                                    <Person fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: "rgba(0,0,0,0.5)",
                                                        color: "white",
                                                        "&:hover": {
                                                            backgroundColor: "rgba(0,0,0,0.7)",
                                                        }
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Delete photo
                                                        console.log("Delete photo");
                                                    }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Box sx={{
                                textAlign: "center",
                                py: 8,
                                border: "2px dashed #e0e0e0",
                                borderRadius: "12px",
                                backgroundColor: "#fafafa"
                            }}>
                                <PhotoCamera sx={{fontSize: 64, color: "#e0e0e0", mb: 2}} />
                                <Typography variant="h6" sx={{color: "#78909c", mb: 1}}>
                                    No photos uploaded yet
                                </Typography>
                                <Typography variant="body2" sx={{color: "#78909c", mb: 3}}>
                                    Upload photos to make your profile more attractive
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<PhotoCamera />}
                                    onClick={handleProfilePictureClick}
                                    sx={{
                                        borderRadius: "20px",
                                        background: "#51365F",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)",
                                        },
                                    }}
                                >
                                    Upload Photos
                                </Button>
                            </Box>
                        )}
                    </TabPanel>

                    <TabPanel value={tabValue} index={2}>
                        <Typography variant="h6" gutterBottom sx={{color: "#51365F", fontWeight: 600, mb: 3}}>
                            Family Details
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{xs: 12, md: 6}}>
                                <DetailItem 
                                    icon={<Person />} 
                                    label="Father's Name" 
                                    value={user?.familyDetails?.fatherName || "Not specified"} 
                                />
                                <DetailItem 
                                    icon={<Work />} 
                                    label="Father's Occupation" 
                                    value={user?.familyDetails?.fatherOccupation || "Not specified"} 
                                />
                                <DetailItem 
                                    icon={<Person />} 
                                    label="Mother's Name" 
                                    value={user?.familyDetails?.motherName || "Not specified"} 
                                />
                                <DetailItem 
                                    icon={<Work />} 
                                    label="Mother's Occupation" 
                                    value={user?.familyDetails?.motherOccupation || "Not specified"} 
                                />
                            </Grid>
                            <Grid size={{xs: 12, md: 6}}>
                                <DetailItem 
                                    label="Family Type" 
                                    value={user?.familyDetails?.familyType || "Not specified"} 
                                />
                                <DetailItem 
                                    label="Family Status" 
                                    value={user?.familyDetails?.familyStatus || "Not specified"} 
                                />
                                <DetailItem 
                                    label="No. of Brothers" 
                                    value={user?.familyDetails?.brothers || "Not specified"} 
                                />
                                <DetailItem 
                                    label="No. of Sisters" 
                                    value={user?.familyDetails?.sisters || "Not specified"} 
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    <TabPanel value={tabValue} index={3}>
                        <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <Typography variant="h6" gutterBottom sx={{color: "#51365F", fontWeight: 600, mb: 3}}>
                                Partner Preferences
                            </Typography>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid size={{xs: 12, md: 6}}>
                                <PreferenceItem title="Age Range" value={`${user?.preferences?.ageRange?.min || ""} - ${user?.preferences?.ageRange?.max || ""} years`} />
                                <PreferenceItem title="Height" value={user?.preferences?.height || "Not specified"} />
                                <PreferenceItem title="Marital Status" value={user?.preferences?.maritalStatus || "Not specified"} />
                                <PreferenceItem title="Religion" value={user?.preferences?.religion || "Not specified"} />
                            </Grid>
                            <Grid size={{xs: 12, md: 6}}>
                                <PreferenceItem title="Education" value={user?.preferences?.education || "Not specified"} />
                                <PreferenceItem title="Profession" value={user?.preferences?.profession || "Not specified"} />
                                <PreferenceItem title="Location" value={user?.preferences?.location || "Not specified"} />
                                <PreferenceItem title="Diet" value={user?.preferences?.diet || "Not specified"} />
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <PreferencesDialog
                        open={dialogOpen}
                        onClose={handleCloseDialog}
                        currentPreferences={user?.preferences || preferences}
                        user={user}
                        onUpdateSuccess={(updatedUser) => {
                            dispatch(fetchUserDetails());
                        }}
                    />
                </Paper>
            </Container>
        </Box>
    );
};

// Helper Components
const DetailItem = ({icon, label, value}) => (
    <Box sx={{display: "flex", alignItems: "center", py: 1.5, borderBottom: "1px solid #f5f5f5"}}>
        {icon && React.cloneElement(icon, {sx: {color: "#51365F", mr: 2}})}
        <Typography variant="body2" sx={{color: "#78909c", minWidth: 120}}>
            {label}
        </Typography>
        <Typography variant="body2" sx={{color: "#37474f", fontWeight: 500}}>
            {value}
        </Typography>
    </Box>
);

const PreferenceItem = ({title, value}) => (
    <Box sx={{mb: 3}}>
        <Typography variant="subtitle2" sx={{color: "#51365F", fontWeight: 600, mb: 0.5}}>
            {title}
        </Typography>
        <Typography variant="body2" sx={{color: "#37474f"}}>
            {value}
        </Typography>
    </Box>
);
export default Profile;
