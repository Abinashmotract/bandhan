import React, { useState, useEffect } from 'react';
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
    Avatar,
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
    useMediaQuery
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    FilterList as FilterIcon,
    Search as SearchIcon,
    LocationOn as LocationIcon,
    Work as WorkIcon,
    School as SchoolIcon,
    Favorite as HeartIcon,
    Visibility as VisibilityIcon,
    Message as MessageIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const PartnerMatchesPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [profiles, setProfiles] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [profileDialogOpen, setProfileDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        ageRange: [25, 35],
        heightRange: [150, 180],
        education: '',
        profession: '',
        community: ''
    });

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const cardVariants = {
        hidden: { scale: 0.9, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        },
        hover: {
            y: -10,
            boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
            transition: {
                duration: 0.3
            }
        }
    };

    // Sample profile data
    useEffect(() => {
        const sampleProfiles = [
            {
                id: 1,
                name: 'Priya Sharma',
                age: 28,
                height: 162,
                education: 'MBA, IIM Bangalore',
                profession: 'Marketing Manager',
                location: 'Mumbai, India',
                community: 'Hindu',
                bio: 'Looking for someone who values family and career equally. Enjoy traveling and trying new cuisines.',
                image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
                interests: ['Travel', 'Music', 'Cooking', 'Reading'],
                liked: false,
                compatibility: 92
            },
            {
                id: 2,
                name: 'Rahul Kapoor',
                age: 32,
                height: 178,
                education: 'BTech, IIT Delhi',
                profession: 'Software Engineer',
                location: 'Bangalore, India',
                community: 'Hindu',
                bio: 'Tech enthusiast who loves outdoor activities. Looking for a partner to share adventures with.',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
                interests: ['Technology', 'Hiking', 'Photography', 'Movies'],
                liked: false,
                compatibility: 88
            },
            {
                id: 3,
                name: 'Anjali Patel',
                age: 26,
                height: 165,
                education: 'MSc Chemistry',
                profession: 'Research Scientist',
                location: 'Ahmedabad, India',
                community: 'Hindu',
                bio: 'Passionate about science and art. Looking for someone who can appreciate both logic and creativity.',
                image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
                interests: ['Science', 'Painting', 'Music', 'Dance'],
                liked: false,
                compatibility: 95
            },
            {
                id: 4,
                name: 'Vikram Singh',
                age: 35,
                height: 182,
                education: 'CA',
                profession: 'Chartered Accountant',
                location: 'Delhi, India',
                community: 'Sikh',
                bio: 'Finance professional with a love for sports and fitness. Seeking a partner who values health and wellness.',
                image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
                interests: ['Finance', 'Cricket', 'Fitness', 'Travel'],
                liked: false,
                compatibility: 84
            },
            {
                id: 5,
                name: 'Neha Reddy',
                age: 29,
                height: 160,
                education: 'BArch',
                profession: 'Architect',
                location: 'Hyderabad, India',
                community: 'Hindu',
                bio: 'Creative soul who loves designing spaces and experiences. Looking for someone who appreciates beauty in everyday life.',
                image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
                interests: ['Design', 'Art', 'Travel', 'Food'],
                liked: false,
                compatibility: 90
            },
            {
                id: 6,
                name: 'Arjun Malhotra',
                age: 31,
                height: 175,
                education: 'MBA',
                profession: 'Business Consultant',
                location: 'Pune, India',
                community: 'Hindu',
                bio: 'Entrepreneur at heart who enjoys solving complex problems. Seeking an intelligent and ambitious partner.',
                image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
                interests: ['Business', 'Reading', 'Cooking', 'Technology'],
                liked: false,
                compatibility: 87
            }
        ];

        setProfiles(sampleProfiles);
        setFilteredProfiles(sampleProfiles);
    }, []);

    const handleLike = (id) => {
        const updatedProfiles = profiles.map(profile =>
            profile.id === id ? { ...profile, liked: !profile.liked } : profile
        );
        setProfiles(updatedProfiles);
        setFilteredProfiles(updatedProfiles);
    };

    const handleFilterChange = (filter, value) => {
        setFilters({
            ...filters,
            [filter]: value
        });
    };

    const applyFilters = () => {
        let filtered = profiles.filter(profile => {
            return (
                profile.age >= filters.ageRange[0] &&
                profile.age <= filters.ageRange[1] &&
                profile.height >= filters.heightRange[0] &&
                profile.height <= filters.heightRange[1] &&
                (filters.education === '' || profile.education.includes(filters.education)) &&
                (filters.profession === '' || profile.profession.includes(filters.profession)) &&
                (filters.community === '' || profile.community === filters.community) &&
                (searchTerm === '' ||
                    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    profile.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    profile.interests.some(interest =>
                        interest.toLowerCase().includes(searchTerm.toLowerCase())
                    ))
            );
        });
        setFilteredProfiles(filtered);
        setFilterDialogOpen(false);
    };

    const resetFilters = () => {
        setFilters({
            ageRange: [25, 35],
            heightRange: [150, 180],
            education: '',
            profession: '',
            community: ''
        });
        setSearchTerm('');
        setFilteredProfiles(profiles);
    };

    const openProfileDialog = (profile) => {
        setSelectedProfile(profile);
        setProfileDialogOpen(true);
    };

    return (
        <Box sx={{
            py: 4,
            minHeight: '100vh',
        }}>
            <Container maxWidth="xl">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box textAlign="center" mb={4}>
                        <Typography
                            variant="h2"
                            component="h1"
                            gutterBottom
                            sx={{
                                color: '#d81b60',
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 2
                            }}
                        >
                            Find Your Perfect Match
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'white', maxWidth: '600px', margin: '0 auto' }}>
                            Discover profiles that match your preferences and start your journey to forever happiness
                        </Typography>
                    </Box>
                </motion.div>

                {/* Search and Filter Bar */}
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
                                        startAdornment: <SearchIcon sx={{ mr: 1, color: '#d81b60' }} />,
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': {
                                                borderColor: '#d81b60',
                                            },
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<FilterIcon />}
                                    onClick={() => setFilterDialogOpen(true)}
                                    sx={{
                                        flex: 1,
                                        borderRadius: 2,
                                        borderColor: '#d81b60',
                                        color: '#d81b60',
                                        '&:hover': {
                                            borderColor: '#d81b60',
                                            backgroundColor: 'rgba(216, 27, 96, 0.1)'
                                        }
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
                                        background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)',
                                        }
                                    }}
                                >
                                    Apply
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </motion.div>

                {/* Results Count */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ color: 'white' }}>
                            {filteredProfiles.length} matches found
                        </Typography>
                        <Button
                            onClick={resetFilters}
                            sx={{
                                color: '#d81b60',
                                '&:hover': {
                                    backgroundColor: 'rgba(216, 27, 96, 0.1)'
                                }
                            }}
                        >
                            Reset Filters
                        </Button>
                    </Box>
                </motion.div>

                {/* Profiles Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Grid container spacing={3}>
                        <AnimatePresence>
                            {filteredProfiles.map(profile => (
                                <Grid item xs={12} sm={6} md={4} key={profile.id}>
                                    <motion.div
                                        variants={itemVariants}
                                        layout
                                    >
                                        <motion.div
                                            variants={cardVariants}
                                            whileHover="hover"
                                        >
                                            <Card sx={{ borderRadius: 3, overflow: 'hidden', position: 'relative', cursor: 'pointer', width: "350px" }}>
                                                {/* Profile Image */}
                                                <Box sx={{ position: 'relative' }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="250"
                                                        image={profile.image}
                                                        alt={profile.name}
                                                        onClick={() => openProfileDialog(profile)}
                                                    />

                                                    {/* Compatibility Badge */}
                                                    <Chip
                                                        label={`${profile.compatibility}% Match`}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 16,
                                                            right: 16,
                                                            background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                                                            color: 'white',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />

                                                    {/* Like Button */}
                                                    <IconButton
                                                        sx={{
                                                            position: 'absolute',
                                                            bottom: 16,
                                                            right: 16,
                                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(255, 255, 255, 0.9)'
                                                            }
                                                        }}
                                                        onClick={() => handleLike(profile.id)}
                                                    >
                                                        {profile.liked ? (
                                                            <FavoriteIcon sx={{ color: '#d81b60' }} />
                                                        ) : (
                                                            <FavoriteBorderIcon sx={{ color: '#d81b60' }} />
                                                        )}
                                                    </IconButton>
                                                </Box>

                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                        <Typography variant="h6" sx={{ color: '#37474f', fontWeight: 600 }}>
                                                            {profile.name}, {profile.age}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <WorkIcon sx={{ fontSize: 20, color: '#d81b60', mr: 1 }} />
                                                        <Typography variant="body2" sx={{ color: '#78909c' }}>
                                                            {profile.profession}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <SchoolIcon sx={{ fontSize: 20, color: '#d81b60', mr: 1 }} />
                                                        <Typography variant="body2" sx={{ color: '#78909c' }}>
                                                            {profile.education}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                        <LocationIcon sx={{ fontSize: 20, color: '#d81b60', mr: 1 }} />
                                                        <Typography variant="body2" sx={{ color: '#78909c' }}>
                                                            {profile.location}
                                                        </Typography>
                                                    </Box>

                                                    <Typography variant="body2" sx={{
                                                        color: '#555',
                                                        mb: 2,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}>
                                                        {profile.bio}
                                                    </Typography>

                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                                                        {profile.interests.slice(0, 3).map((interest, index) => (
                                                            <Chip
                                                                key={index}
                                                                label={interest}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: 'rgba(216, 27, 96, 0.1)',
                                                                    color: '#d81b60'
                                                                }}
                                                            />
                                                        ))}
                                                        {profile.interests.length > 3 && (
                                                            <Chip
                                                                label={`+${profile.interests.length - 3}`}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: 'rgba(136, 14, 79, 0.1)',
                                                                    color: '#880e4f'
                                                                }}
                                                            />
                                                        )}
                                                    </Box>

                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Button
                                                            variant="outlined"
                                                            fullWidth
                                                            startIcon={<VisibilityIcon />}
                                                            onClick={() => openProfileDialog(profile)}
                                                            sx={{
                                                                borderRadius: 2,
                                                                borderColor: '#d81b60',
                                                                color: '#d81b60',
                                                                '&:hover': {
                                                                    borderColor: '#d81b60',
                                                                    backgroundColor: 'rgba(216, 27, 96, 0.1)'
                                                                }
                                                            }}
                                                        >
                                                            View Profile
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            fullWidth
                                                            startIcon={<MessageIcon />}
                                                            sx={{
                                                                borderRadius: 2,
                                                                background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                                                fontWeight: 'bold',
                                                                '&:hover': {
                                                                    background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)',
                                                                }
                                                            }}
                                                        >
                                                            Message
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
                {filteredProfiles.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                            <Typography variant="h5" sx={{ color: '#d81b60', mb: 2 }}>
                                No matches found
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#78909c', mb: 3 }}>
                                Try adjusting your filters or search terms to see more profiles.
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={resetFilters}
                                sx={{
                                    borderRadius: 2,
                                    background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)',
                                    }
                                }}
                            >
                                Reset Filters
                            </Button>
                        </Paper>
                    </motion.div>
                )}

                {/* Filter Dialog */}
                <Dialog
                    open={filterDialogOpen}
                    onClose={() => setFilterDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ color: '#d81b60', fontWeight: 600 }}>
                        <FilterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Filter Profiles
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2 }}>
                            <Typography gutterBottom sx={{ color: '#37474f', fontWeight: 600, mt: 2 }}>
                                Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}
                            </Typography>
                            <Slider
                                value={filters.ageRange}
                                onChange={(e, newValue) => handleFilterChange('ageRange', newValue)}
                                valueLabelDisplay="auto"
                                min={18}
                                max={45}
                                sx={{ color: '#d81b60', mb: 3 }}
                            />

                            <Typography gutterBottom sx={{ color: '#37474f', fontWeight: 600 }}>
                                Height Range: {filters.heightRange[0]}cm - {filters.heightRange[1]}cm
                            </Typography>
                            <Slider
                                value={filters.heightRange}
                                onChange={(e, newValue) => handleFilterChange('heightRange', newValue)}
                                valueLabelDisplay="auto"
                                min={140}
                                max={200}
                                sx={{ color: '#d81b60', mb: 3 }}
                            />

                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Education</InputLabel>
                                <Select
                                    value={filters.education}
                                    label="Education"
                                    onChange={(e) => handleFilterChange('education', e.target.value)}
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
                                    onChange={(e) => handleFilterChange('profession', e.target.value)}
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
                                    onChange={(e) => handleFilterChange('community', e.target.value)}
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
                        <Button
                            onClick={() => setFilterDialogOpen(false)}
                            sx={{ color: '#78909c' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={applyFilters}
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)',
                                }
                            }}
                        >
                            Apply Filters
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Profile Detail Dialog */}
                <Dialog
                    open={profileDialogOpen}
                    onClose={() => setProfileDialogOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    {selectedProfile && (
                        <>
                            <DialogTitle sx={{ color: '#d81b60', fontWeight: 600 }}>
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
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                            <Chip
                                                label={`${selectedProfile.compatibility}% Match`}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: '1rem',
                                                    p: 2
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={7}>
                                        <Typography variant="h6" gutterBottom sx={{ color: '#37474f', fontWeight: 600 }}>
                                            {selectedProfile.name}, {selectedProfile.age}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <WorkIcon sx={{ fontSize: 20, color: '#d81b60', mr: 1 }} />
                                            <Typography variant="body2" sx={{ color: '#78909c' }}>
                                                {selectedProfile.profession}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <SchoolIcon sx={{ fontSize: 20, color: '#d81b60', mr: 1 }} />
                                            <Typography variant="body2" sx={{ color: '#78909c' }}>
                                                {selectedProfile.education}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <LocationIcon sx={{ fontSize: 20, color: '#d81b60', mr: 1 }} />
                                            <Typography variant="body2" sx={{ color: '#78909c' }}>
                                                {selectedProfile.location}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ color: '#78909c' }}>
                                                Community: {selectedProfile.community}
                                            </Typography>
                                        </Box>

                                        <Typography variant="body1" sx={{ color: '#555', mb: 2 }}>
                                            {selectedProfile.bio}
                                        </Typography>

                                        <Typography variant="subtitle2" sx={{ color: '#37474f', fontWeight: 600, mb: 1 }}>
                                            Interests:
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 3 }}>
                                            {selectedProfile.interests.map((interest, index) => (
                                                <Chip
                                                    key={index}
                                                    label={interest}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 'rgba(216, 27, 96, 0.1)',
                                                        color: '#d81b60'
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={() => setProfileDialogOpen(false)}
                                    sx={{ color: '#78909c' }}
                                >
                                    Close
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<MessageIcon />}
                                    sx={{
                                        background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)',
                                        }
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