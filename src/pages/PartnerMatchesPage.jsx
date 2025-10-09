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
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import {
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    FilterList as FilterIcon,
    Search as SearchIcon,
    LocationOn as LocationIcon,
    Work as WorkIcon,
    School as SchoolIcon,
    Visibility as VisibilityIcon,
    Message as MessageIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import defaultImg from "../assets/default.jpeg";
import Cookies from "js-cookie";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchMatchedProfiles } from "../store/slices/profileSlice";
import { 
  likeProfile, 
  superlikeProfile, 
  addToFavourites, 
  removeFromFavourites,
  getFavourites 
} from "../store/slices/interactionSlice";
import { CircularProgress } from "@mui/material";
import { showSuccess, showError } from "../utils/toast";

const PartnerMatchesPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const navigate = useNavigate();
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [profileDialogOpen, setProfileDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        ageRange: [25, 35],
        heightRange: [150, 180],
        education: "",
        profession: "",
        community: "",
    });

    const dispatch = useDispatch();

    const { profiles, loading, error } = useSelector((state) => state.profiles);
    const { favourites } = useSelector((state) => state.interaction);
    const allProfiles = profiles;

    useEffect(() => {
        dispatch(fetchMatchedProfiles());
        dispatch(getFavourites());
    }, [dispatch]);

    const accessToken = Cookies.get("accessToken");

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

    // Process API data to match our component structure
    useEffect(() => {
        if (allProfiles && allProfiles.length > 0) {
            const processedProfiles = allProfiles?.map((profile) => ({
                id: profile?._id,
                name: profile?.name || 'N/A',
                age: calculateAge(profile?.dob) || 'N/A',
                height: profile?.data?.height || 'N/A',
                education: profile?.education || 'N/A',
                profession: profile?.occupation || 'N/A',
                location: profile?.location || 'N/A',
                community: profile?.religion || 'N/A',
                bio: profile?.about || 'N/A',
                image: profile?.profileImage || defaultImg,
                interests: generateRandomInterests(),
                liked: false,
                compatibility: profile?.matchScore || 0,
            }));
            // setProfiles(processedProfiles);
            setFilteredProfiles(processedProfiles);
        }
    }, [allProfiles]);

    // Helper functions to generate missing data
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

    const generateRandomInterests = () => {
        const allInterests = [
            "Travel",
            "Music",
            "Cooking",
            "Reading",
            "Technology",
            "Hiking",
            "Photography",
            "Movies",
            "Science",
            "Painting",
            "Dance",
            "Finance",
            "Cricket",
            "Fitness",
            "Design",
            "Art",
            "Food",
            "Business",
            "Yoga",
            "Gardening",
        ];

        // Shuffle array and take 4-6 interests
        const shuffled = [...allInterests].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.floor(Math.random() * 3) + 4);
    };

    // const handleLike = (id) => {
    //     const updatedProfiles = profiles.map((profile) =>
    //         profile.id === id ? { ...profile, liked: !profile.liked } : profile
    //     );
    //     // setProfiles(updatedProfiles);
    //     setFilteredProfiles(updatedProfiles);
    // };

    const handleFilterChange = (filter, value) => {
        setFilters({
            ...filters,
            [filter]: value,
        });
    };

    const applyFilters = async () => {
        try {
            const queryParams = new URLSearchParams({
                ageMin: filters.ageRange[0],
                ageMax: filters.ageRange[1],
                education: filters.education,
                profession: filters.profession,
                religion: filters.community,
                location: "",
            }).toString();

            const res = await axios.get(`${API_BASE_URL}/profiles/filter?${queryParams}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (res.data.success) {
                const processedProfiles = res.data.data.map((profile) => ({
                    id: profile?._id,
                    name: profile?.name || 'N/A',
                    age: calculateAge(profile?.dob) || 'N/A',
                    height: profile?.data?.height || 'N/A',
                    education: profile?.education || 'N/A',
                    profession: profile?.occupation || 'N/A',
                    location: profile?.location || 'N/A',
                    community: profile?.religion || 'N/A',
                    bio: profile?.about || 'N/A',
                    image: profile?.profileImage || defaultImg,
                    interests: profile?.interests?.length ? profile?.interests : 'N/A',
                    liked: false,
                    compatibility: profile?.matchScore || 0,
                }));
                setFilteredProfiles(processedProfiles);
            }
            setFilterDialogOpen(false);
        } catch (err) {
            console.error("Error filtering profiles:", err);
        }
    };

    const resetFilters = () => {
        setFilters({
            ageRange: [25, 35],
            heightRange: [150, 180],
            education: "",
            profession: "",
            community: "",
        });
        setSearchTerm("");
        if (allProfiles && allProfiles.length > 0) {
            const processedProfiles = allProfiles.map((profile) => ({
                id: profile._id,
                name: profile.name,
                age: calculateAge(profile.dob),
                height: profile?.data?.height || 'N/A',
                education: profile.education || 'N/A',
                profession: profile.occupation || 'N/A',
                location: profile.location || 'N/A',
                community: profile.religion || 'N/A',
                bio: profile.about || 'N/A',
                image: profile.profileImage || defaultImg,
                interests: profile.interests?.length ? profile.interests : 'N/A',
                liked: false,
                compatibility: profile.matchScore || 0,
            }));
            setFilteredProfiles(processedProfiles);
        }
    };

    const openProfileDialog = (profile) => {
        setSelectedProfile(profile);
        setProfileDialogOpen(true);
    };

    // Interaction handlers
    const handleLike = async (profileId) => {
        try {
            await dispatch(likeProfile(profileId)).unwrap();
            showSuccess('Profile liked successfully!');
            // Update local state
            setFilteredProfiles(prev => 
                prev.map(profile => 
                    profile.id === profileId 
                        ? { ...profile, liked: !profile.liked }
                        : profile
                )
            );
        } catch (error) {
            showError(error || 'Failed to like profile');
        }
    };

    const handleSuperLike = async (profileId) => {
        try {
            await dispatch(superlikeProfile(profileId)).unwrap();
            showSuccess('Super like sent!');
        } catch (error) {
            showError(error || 'Failed to send super like');
        }
    };

    const handleAddToFavourites = async (profileId) => {
        try {
            await dispatch(addToFavourites(profileId)).unwrap();
            showSuccess('Added to favourites!');
            // Update local state
            setFilteredProfiles(prev => 
                prev.map(profile => 
                    profile.id === profileId 
                        ? { ...profile, favourited: true }
                        : profile
                )
            );
        } catch (error) {
            showError(error || 'Failed to add to favourites');
        }
    };

    const handleRemoveFromFavourites = async (profileId) => {
        try {
            await dispatch(removeFromFavourites(profileId)).unwrap();
            showSuccess('Removed from favourites!');
            // Update local state
            setFilteredProfiles(prev => 
                prev.map(profile => 
                    profile.id === profileId 
                        ? { ...profile, favourited: false }
                        : profile
                )
            );
        } catch (error) {
            showError(error || 'Failed to remove from favourites');
        }
    };

    // Check if profile is in favourites
    const isFavourite = (profileId) => {
        return Array.isArray(favourites) && favourites.some(fav => fav.userId === profileId || fav._id === profileId);
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", }}>
                <CircularProgress size={60} thickness={4} color="secondary" />
            </Box>
        );
    }

    return (
        <Box sx={{ py: 4, minHeight: "100vh", }}>
            <Container maxWidth="xl">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Box textAlign="center" mb={4}>
                        <Typography variant="h2" component="h1" gutterBottom sx={{ color: "#51365F", fontStyle: "italic", fontWeight: 800, mb: 2, }}>
                            Find Your Perfect Match
                        </Typography>
                        <Typography variant="h6" sx={{ color: "black", maxWidth: "600px", margin: "0 auto" }}>
                            Discover profiles that match your preferences and start your journey to forever happiness
                        </Typography>
                    </Box>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <TextField
                                    fullWidth
                                    placeholder="Search by name, interests, or keywords..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: <SearchIcon sx={{ mr: 1, color: "#51365F" }} />,
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                            "&:hover fieldset": {
                                                borderColor: "#51365F",
                                            },
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} sx={{ display: "flex", gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<FilterIcon />}
                                    onClick={() => setFilterDialogOpen(true)}
                                    sx={{
                                        flex: 1,
                                        borderRadius: 2,
                                        borderColor: "#51365F",
                                        color: "#51365F",
                                        "&:hover": {
                                            borderColor: "#51365F",
                                            backgroundColor: "rgba(216, 27, 96, 0.1)",
                                        },
                                    }}
                                >
                                    Filters
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={applyFilters}
                                    sx={{
                                        flex: 1,
                                        borderRadius: 2,
                                        background: "#51365F",
                                        fontWeight: "bold",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)",
                                        },
                                    }}
                                >
                                    Apply
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </motion.div>

                {/* Results Count */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <Typography variant="h6" sx={{ color: "white" }}>
                            {filteredProfiles.length} matches found
                        </Typography>
                        <Button
                            onClick={resetFilters}
                            sx={{
                                color: "#51365F",
                                "&:hover": {
                                    backgroundColor: "rgba(216, 27, 96, 0.1)",
                                },
                            }}
                        >
                            Reset Filters
                        </Button>
                    </Box>
                </motion.div>

                {/* Profiles Grid */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <Grid container spacing={3}>
                        <AnimatePresence>
                            {filteredProfiles.map((profile) => (
                                <Grid item xs={12} sm={6} md={4} key={profile.id}>
                                    <motion.div variants={itemVariants} layout>
                                        <motion.div variants={cardVariants} whileHover="hover">
                                            <Card sx={{ borderRadius: 3, overflow: "hidden", position: "relative", cursor: "pointer", width: "350px", }}>
                                                {/* Profile Image */}
                                                <Box sx={{ position: "relative" }}>
                                                    <CardMedia component="img" height="250" image={profile.image} alt={profile.name} onClick={() => openProfileDialog(profile)} />

                                                    {/* Compatibility Badge */}
                                                    <Chip
                                                        label={`${profile?.compatibility}% Match`}
                                                        sx={{
                                                            position: "absolute",
                                                            top: 16,
                                                            right: 16,
                                                            background:
                                                                "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
                                                            color: "white",
                                                            fontWeight: "bold",
                                                        }}
                                                    />

                                                    {/* Like and Super Like Buttons */}
                                                    <Box sx={{ 
                                                        position: "absolute", 
                                                        bottom: 16, 
                                                        right: 16, 
                                                        display: "flex", 
                                                        gap: 1 
                                                    }}>
                                                        <IconButton
                                                            sx={{
                                                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                                                "&:hover": {
                                                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                                                },
                                                            }}
                                                            onClick={() => handleLike(profile.id)}
                                                        >
                                                            {profile.liked ? (
                                                                <FavoriteIcon sx={{ color: "#51365F" }} />
                                                            ) : (
                                                                <FavoriteBorderIcon sx={{ color: "#51365F" }} />
                                                            )}
                                                        </IconButton>
                                                        
                                                        <IconButton
                                                            sx={{
                                                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                                                "&:hover": {
                                                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                                                },
                                                            }}
                                                            onClick={() => handleSuperLike(profile.id)}
                                                        >
                                                            <FavoriteIcon sx={{ color: "#ff5722", transform: "scale(1.2)" }} />
                                                        </IconButton>
                                                    </Box>
                                                </Box>

                                                <CardContent>
                                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2, }}>
                                                        <Typography variant="h6" sx={{ color: "#37474f", fontWeight: 600 }}>
                                                            {profile.name}, {profile.age}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                        <WorkIcon sx={{ fontSize: 20, color: "#51365F", mr: 1 }} />
                                                        <Typography variant="body2" sx={{ color: "#78909c" }}>
                                                            {profile.profession}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                        <SchoolIcon sx={{ fontSize: 20, color: "#51365F", mr: 1 }} />
                                                        <Typography variant="body2" sx={{ color: "#78909c" }}>
                                                            {profile.education}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                                        <LocationIcon sx={{ fontSize: 20, color: "#51365F", mr: 1 }} />
                                                        <Typography variant="body2" sx={{ color: "#78909c" }}>
                                                            {profile.location}
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
                                                        {profile.bio}
                                                    </Typography>

                                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
                                                        {(Array.isArray(profile.interests) ? profile.interests : []).slice(0, 3).map((interest, index) => (
                                                            <Chip
                                                                key={index}
                                                                label={interest}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: "rgba(216, 27, 96, 0.1)",
                                                                    color: "#51365F",
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
                                                                borderColor: "#51365F",
                                                                color: "#51365F",
                                                                px: 1.5,
                                                                py: 0.5,
                                                                fontSize: "0.875rem",
                                                                minWidth: "auto",
                                                                "&:hover": {
                                                                    borderColor: "#51365F",
                                                                    backgroundColor: "rgba(216, 27, 96, 0.1)",
                                                                },
                                                            }}
                                                        >
                                                            View
                                                        </Button>

                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<MessageIcon />}
                                                            onClick={() => navigate('/chat')}
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

                                                        <Button
                                                            variant="outlined"
                                                            startIcon={isFavourite(profile.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                                            onClick={() => isFavourite(profile.id) 
                                                                ? handleRemoveFromFavourites(profile.id)
                                                                : handleAddToFavourites(profile.id)
                                                            }
                                                            sx={{
                                                                borderRadius: 2,
                                                                borderColor: isFavourite(profile.id) ? "#ff9800" : "#ff9800",
                                                                color: isFavourite(profile.id) ? "#ff9800" : "#ff9800",
                                                                px: 1.5,
                                                                py: 0.5,
                                                                fontSize: "0.875rem",
                                                                minWidth: "auto",
                                                                "&:hover": {
                                                                    borderColor: "#ff9800",
                                                                    backgroundColor: "rgba(255, 152, 0, 0.1)",
                                                                },
                                                            }}
                                                        >
                                                            {isFavourite(profile.id) ? 'Favorited' : 'Favorite'}
                                                        </Button>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </motion.div>
                                </Grid>
                            ))}
                        </AnimatePresence>
                    </Grid>
                </motion.div>

                {/* No Results Message */}
                {filteredProfiles?.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <Paper elevation={3} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
                            <Typography variant="h5" sx={{ color: "#51365F", mb: 2 }}>
                                No matches found
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#78909c", mb: 3 }}>
                                Try adjusting your filters or search terms to see more profiles.
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={resetFilters}
                                sx={{
                                    borderRadius: 2,
                                    background: "#51365F",
                                    fontWeight: "bold",
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)",
                                    },
                                }}
                            >
                                Reset Filters
                            </Button>
                        </Paper>
                    </motion.div>
                )}

                {/* Filter Dialog */}
                <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ color: "#51365F", fontWeight: 600 }}>
                        <FilterIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                        Filter Profiles
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2 }}>
                            <Typography gutterBottom sx={{ color: "#37474f", fontWeight: 600, mt: 2 }}>
                                Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}
                            </Typography>
                            <Slider
                                value={filters.ageRange}
                                onChange={(e, newValue) => handleFilterChange("ageRange", newValue)}
                                valueLabelDisplay="auto"
                                min={18}
                                max={45}
                                sx={{ color: "#51365F", mb: 3 }}
                            />

                            <Typography gutterBottom sx={{ color: "#37474f", fontWeight: 600 }}>
                                Height Range: {filters.heightRange[0]}cm - {filters.heightRange[1]}cm
                            </Typography>
                            <Slider
                                value={filters.heightRange}
                                onChange={(e, newValue) => handleFilterChange("heightRange", newValue)}
                                valueLabelDisplay="auto"
                                min={140}
                                max={200}
                                sx={{ color: "#51365F", mb: 3 }}
                            />

                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Education</InputLabel>
                                <Select
                                    value={filters.education}
                                    label="Education"
                                    onChange={(e) => handleFilterChange("education", e.target.value)}
                                >
                                    <MenuItem value="">Any Education</MenuItem>
                                    <MenuItem value="MBA">MBA</MenuItem>
                                    <MenuItem value="BTech">BTech</MenuItem>
                                    <MenuItem value="MCA">MCA</MenuItem>
                                    <MenuItem value="CA">CA</MenuItem>
                                    <MenuItem value="MBBS">MBBS</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Profession</InputLabel>
                                <Select
                                    value={filters.profession}
                                    label="Profession"
                                    onChange={(e) => handleFilterChange("profession", e.target.value)}
                                >
                                    <MenuItem value="">Any Profession</MenuItem>
                                    <MenuItem value="Engineer">Engineer</MenuItem>
                                    <MenuItem value="Doctor">Doctor</MenuItem>
                                    <MenuItem value="Manager">Manager</MenuItem>
                                    <MenuItem value="Teacher">Teacher</MenuItem>
                                    <MenuItem value="Accountant">Accountant</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Community</InputLabel>
                                <Select
                                    value={filters.community}
                                    label="Community"
                                    onChange={(e) => handleFilterChange("community", e.target.value)}
                                >
                                    <MenuItem value="">Any Community</MenuItem>
                                    <MenuItem value="Hindu">Hindu</MenuItem>
                                    <MenuItem value="Muslim">Muslim</MenuItem>
                                    <MenuItem value="Christian">Christian</MenuItem>
                                    <MenuItem value="Sikh">Sikh</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setFilterDialogOpen(false)} sx={{ color: "#78909c" }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={applyFilters}
                            variant="contained"
                            sx={{
                                background: "#51365F",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)",
                                },
                            }}
                        >
                            Apply Filters
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Profile Detail Dialog */}
                <Dialog open={profileDialogOpen} onClose={() => setProfileDialogOpen(false)} maxWidth="md" fullWidth>
                    {selectedProfile && (
                        <>
                            <DialogTitle sx={{ color: "#51365F", fontWeight: 600 }}>
                                {selectedProfile.name}'s Profile
                            </DialogTitle>
                            <DialogContent>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={5}>
                                        <CardMedia
                                            component="img"
                                            image={selectedProfile.image}
                                            alt={selectedProfile.name}
                                            sx={{ borderRadius: 3 }}
                                        />
                                        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                            <Chip
                                                label={`${selectedProfile.compatibility}% Match`}
                                                sx={{
                                                    background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
                                                    color: "white",
                                                    fontWeight: "bold",
                                                    fontSize: "1rem",
                                                    p: 2,
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={7}>
                                        <Typography variant="h6" gutterBottom sx={{ color: "#37474f", fontWeight: 600 }}>
                                            {selectedProfile.name}, {selectedProfile.age}
                                        </Typography>

                                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                            <WorkIcon sx={{ fontSize: 20, color: "#51365F", mr: 1 }} />
                                            <Typography variant="body2" sx={{ color: "#78909c" }}>
                                                {selectedProfile.profession}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                            <SchoolIcon sx={{ fontSize: 20, color: "#51365F", mr: 1 }} />
                                            <Typography variant="body2" sx={{ color: "#78909c" }}>
                                                {selectedProfile.education}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                            <LocationIcon sx={{ fontSize: 20, color: "#51365F", mr: 1 }} />
                                            <Typography variant="body2" sx={{ color: "#78909c" }}>
                                                {selectedProfile.location}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ color: "#78909c" }}>
                                                Community: {selectedProfile.community}
                                            </Typography>
                                        </Box>

                                        <Typography variant="body1" sx={{ color: "#555", mb: 2 }}>
                                            {selectedProfile.bio}
                                        </Typography>

                                        <Typography variant="subtitle2" sx={{ color: "#37474f", fontWeight: 600, mb: 1 }}>
                                            Interests:
                                        </Typography>
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 3 }}>
                                            {selectedProfile.interests.map((interest, index) => (
                                                <Chip
                                                    key={index}
                                                    label={interest}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: "rgba(216, 27, 96, 0.1)",
                                                        color: "#51365F",
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
                                    sx={{
                                        background: "#51365F",
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
            </Container>
        </Box>
    );
};
export default PartnerMatchesPage;
