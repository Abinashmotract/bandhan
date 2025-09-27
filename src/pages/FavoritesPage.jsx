import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Chip,
    IconButton,
    Paper,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import {
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    LocationOn as LocationIcon,
    Work as WorkIcon,
    School as SchoolIcon,
    Visibility as VisibilityIcon,
    Message as MessageIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import defaultImg from "../assets/default.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { 
  getFavourites,
  removeFromFavourites 
} from "../store/slices/interactionSlice";
import { showSuccess, showError } from "../utils/toast";

const FavoritesPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [profileDialogOpen, setProfileDialogOpen] = useState(false);
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
    const [profileToRemove, setProfileToRemove] = useState(null);

    const { favourites, loading, error } = useSelector((state) => state.interaction);

    useEffect(() => {
        dispatch(getFavourites());
    }, [dispatch]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    };

    const cardVariants = {
        hidden: { scale: 0.9, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
        hover: {
            y: -10,
            boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
            transition: {
                duration: 0.3,
            },
        },
    };

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    const openProfileDialog = (profile) => {
        setSelectedProfile(profile);
        setProfileDialogOpen(true);
    };

    const handleRemoveFromFavourites = async (profileId) => {
        try {
            await dispatch(removeFromFavourites(profileId)).unwrap();
            showSuccess('Removed from favourites!');
            setRemoveDialogOpen(false);
            setProfileToRemove(null);
        } catch (error) {
            showError(error || 'Failed to remove from favourites');
        }
    };

    const confirmRemove = (profile) => {
        setProfileToRemove(profile);
        setRemoveDialogOpen(true);
    };

    const handleMessage = (profile) => {
        navigate('/chat');
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress size={60} thickness={4} color="secondary" />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Box sx={{ py: 4, minHeight: "100vh" }}>
            <Container maxWidth="xl">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Box textAlign="center" mb={4}>
                        <Typography variant="h2" component="h1" gutterBottom sx={{ color: "#C8A2C8", fontStyle: "italic", fontWeight: 800, mb: 2 }}>
                            Your Favorites
                        </Typography>
                        <Typography variant="h6" sx={{ color: "black", maxWidth: "600px", margin: "0 auto" }}>
                            Profiles you've added to your favorites list
                        </Typography>
                    </Box>
                </motion.div>

                {/* Results Count */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <Typography variant="h6" sx={{ color: "white" }}>
                            {favourites?.length || 0} favorites found
                        </Typography>
                    </Box>
                </motion.div>

                {/* Favorites Grid */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <Grid container spacing={3}>
                        <AnimatePresence>
                            {favourites && favourites.length > 0 ? (
                                favourites.map((favourite) => {
                                    const profile = favourite.user || favourite;
                                    return (
                                        <Grid item xs={12} sm={6} md={4} key={profile._id}>
                                            <motion.div variants={itemVariants} layout>
                                                <motion.div variants={cardVariants} whileHover="hover">
                                                    <Card sx={{ borderRadius: 3, overflow: "hidden", position: "relative", cursor: "pointer", width: "350px" }}>
                                                        {/* Profile Image */}
                                                        <Box sx={{ position: "relative" }}>
                                                            <CardMedia 
                                                                component="img" 
                                                                height="250" 
                                                                image={profile.profileImage || defaultImg} 
                                                                alt={profile.name} 
                                                                onClick={() => openProfileDialog(profile)} 
                                                            />

                                                            {/* Favorite Badge */}
                                                            <Chip
                                                                label="Favorited"
                                                                sx={{
                                                                    position: "absolute",
                                                                    top: 16,
                                                                    right: 16,
                                                                    background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
                                                                    color: "white",
                                                                    fontWeight: "bold",
                                                                }}
                                                            />

                                                            {/* Remove Button */}
                                                            <IconButton
                                                                sx={{
                                                                    position: "absolute",
                                                                    top: 16,
                                                                    left: 16,
                                                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                                                    "&:hover": {
                                                                        backgroundColor: "rgba(255, 255, 255, 1)",
                                                                    },
                                                                }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    confirmRemove(profile);
                                                                }}
                                                            >
                                                                <DeleteIcon sx={{ color: "#f44336" }} />
                                                            </IconButton>
                                                        </Box>

                                                        <CardContent>
                                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                                                                <Typography variant="h6" sx={{ color: "#37474f", fontWeight: 600 }}>
                                                                    {profile.name}, {calculateAge(profile.dob)}
                                                                </Typography>
                                                            </Box>

                                                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                                <WorkIcon sx={{ fontSize: 20, color: "#d81b60", mr: 1 }} />
                                                                <Typography variant="body2" sx={{ color: "#78909c" }}>
                                                                    {profile.occupation || 'N/A'}
                                                                </Typography>
                                                            </Box>

                                                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                                <SchoolIcon sx={{ fontSize: 20, color: "#d81b60", mr: 1 }} />
                                                                <Typography variant="body2" sx={{ color: "#78909c" }}>
                                                                    {profile.education || 'N/A'}
                                                                </Typography>
                                                            </Box>

                                                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                                                <LocationIcon sx={{ fontSize: 20, color: "#d81b60", mr: 1 }} />
                                                                <Typography variant="body2" sx={{ color: "#78909c" }}>
                                                                    {profile.location || 'N/A'}
                                                                </Typography>
                                                            </Box>

                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: "#555",
                                                                    mb: 2,
                                                                    display: "-webkit-box",
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: "vertical",
                                                                    overflow: "hidden",
                                                                }}
                                                            >
                                                                {profile.about || 'No description available'}
                                                            </Typography>

                                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
                                                                {(Array.isArray(profile.interests) ? profile.interests : []).slice(0, 3).map((interest, index) => (
                                                                    <Chip
                                                                        key={index}
                                                                        label={interest}
                                                                        size="small"
                                                                        sx={{
                                                                            backgroundColor: "rgba(216, 27, 96, 0.1)",
                                                                            color: "#d81b60",
                                                                        }}
                                                                    />
                                                                ))}
                                                                {Array.isArray(profile.interests) && profile.interests.length > 3 && (
                                                                    <Chip
                                                                        label={`+${profile.interests.length - 3}`}
                                                                        size="small"
                                                                        sx={{
                                                                            backgroundColor: "rgba(136, 14, 79, 0.1)",
                                                                            color: "#880e4f",
                                                                        }}
                                                                    />
                                                                )}
                                                            </Box>

                                                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                                                <Button
                                                                    variant="outlined"
                                                                    startIcon={<VisibilityIcon />}
                                                                    onClick={() => openProfileDialog(profile)}
                                                                    sx={{
                                                                        borderRadius: 2,
                                                                        borderColor: "#d81b60",
                                                                        color: "#d81b60",
                                                                        px: 1.5,
                                                                        py: 0.5,
                                                                        fontSize: "0.875rem",
                                                                        minWidth: "auto",
                                                                        "&:hover": {
                                                                            borderColor: "#d81b60",
                                                                            backgroundColor: "rgba(216, 27, 96, 0.1)",
                                                                        },
                                                                    }}
                                                                >
                                                                    View
                                                                </Button>

                                                                <Button
                                                                    variant="outlined"
                                                                    startIcon={<MessageIcon />}
                                                                    onClick={() => handleMessage(profile)}
                                                                    sx={{
                                                                        borderRadius: 2,
                                                                        borderColor: "#4caf50",
                                                                        color: "#4caf50",
                                                                        px: 1.5,
                                                                        py: 0.5,
                                                                        fontSize: "0.875rem",
                                                                        minWidth: "auto",
                                                                        "&:hover": {
                                                                            borderColor: "#4caf50",
                                                                            backgroundColor: "rgba(76, 175, 80, 0.1)",
                                                                        },
                                                                    }}
                                                                >
                                                                    Msg
                                                                </Button>
                                                            </Box>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            </motion.div>
                                        </Grid>
                                    );
                                })
                            ) : (
                                <Grid item xs={12}>
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                                        <Paper elevation={3} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
                                            <Typography variant="h5" sx={{ color: "#d81b60", mb: 2 }}>
                                                No favorites yet
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: "#78909c", mb: 3 }}>
                                                Start adding profiles to your favorites by clicking the heart icon on profiles you like.
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                onClick={() => navigate('/matches')}
                                                sx={{
                                                    borderRadius: 2,
                                                    background: "linear-gradient(135deg, #d81b60 0%, #880e4f 100%)",
                                                    fontWeight: "bold",
                                                    "&:hover": {
                                                        background: "linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)",
                                                    },
                                                }}
                                            >
                                                Browse Matches
                                            </Button>
                                        </Paper>
                                    </motion.div>
                                </Grid>
                            )}
                        </AnimatePresence>
                    </Grid>
                </motion.div>

                {/* Profile Detail Dialog */}
                <Dialog open={profileDialogOpen} onClose={() => setProfileDialogOpen(false)} maxWidth="md" fullWidth>
                    {selectedProfile && (
                        <>
                            <DialogTitle sx={{ color: "#d81b60", fontWeight: 600 }}>
                                {selectedProfile.name}'s Profile
                            </DialogTitle>
                            <DialogContent>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={5}>
                                        <CardMedia
                                            component="img"
                                            image={selectedProfile.profileImage || defaultImg}
                                            alt={selectedProfile.name}
                                            sx={{ borderRadius: 3 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={7}>
                                        <Typography variant="h6" gutterBottom sx={{ color: "#37474f", fontWeight: 600 }}>
                                            {selectedProfile.name}, {calculateAge(selectedProfile.dob)}
                                        </Typography>

                                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                            <WorkIcon sx={{ fontSize: 20, color: "#d81b60", mr: 1 }} />
                                            <Typography variant="body2" sx={{ color: "#78909c" }}>
                                                {selectedProfile.occupation || 'N/A'}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                            <SchoolIcon sx={{ fontSize: 20, color: "#d81b60", mr: 1 }} />
                                            <Typography variant="body2" sx={{ color: "#78909c" }}>
                                                {selectedProfile.education || 'N/A'}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                            <LocationIcon sx={{ fontSize: 20, color: "#d81b60", mr: 1 }} />
                                            <Typography variant="body2" sx={{ color: "#78909c" }}>
                                                {selectedProfile.location || 'N/A'}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ color: "#78909c" }}>
                                                Community: {selectedProfile.religion || 'N/A'}
                                            </Typography>
                                        </Box>

                                        <Typography variant="body1" sx={{ color: "#555", mb: 2 }}>
                                            {selectedProfile.about || 'No description available'}
                                        </Typography>

                                        <Typography variant="subtitle2" sx={{ color: "#37474f", fontWeight: 600, mb: 1 }}>
                                            Interests:
                                        </Typography>
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 3 }}>
                                            {(Array.isArray(selectedProfile.interests) ? selectedProfile.interests : []).map((interest, index) => (
                                                <Chip
                                                    key={index}
                                                    label={interest}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: "rgba(216, 27, 96, 0.1)",
                                                        color: "#d81b60",
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setProfileDialogOpen(false)} sx={{ color: "#78909c" }}>
                                    Close
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<MessageIcon />}
                                    onClick={() => {
                                        setProfileDialogOpen(false);
                                        handleMessage(selectedProfile);
                                    }}
                                    sx={{
                                        background: "linear-gradient(135deg, #d81b60 0%, #880e4f 100%)",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)",
                                        },
                                    }}
                                >
                                    Send Message
                                </Button>
                            </DialogActions>
                        </>
                    )}
                </Dialog>

                {/* Remove Confirmation Dialog */}
                <Dialog open={removeDialogOpen} onClose={() => setRemoveDialogOpen(false)}>
                    <DialogTitle>Remove from Favorites</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to remove {profileToRemove?.name} from your favorites?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setRemoveDialogOpen(false)}>Cancel</Button>
                        <Button 
                            onClick={() => handleRemoveFromFavourites(profileToRemove?._id)}
                            color="error"
                            variant="contained"
                        >
                            Remove
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default FavoritesPage;
