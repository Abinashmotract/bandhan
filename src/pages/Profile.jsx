import React, { useState } from 'react';
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
    Fab
} from '@mui/material';
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
    Person
} from '@mui/icons-material';

// Tab panel component
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const Profile = () => {
    const [tabValue, setTabValue] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    // Sample user data
    const user = {
        name: "Priya Sharma",
        age: 28,
        location: "Mumbai, India",
        profession: "Software Engineer",
        education: "Master of Computer Applications",
        height: "5'4\"",
        religion: "Hindu",
        caste: "Brahmin",
        motherTongue: "Hindi",
        about: "I am a cheerful and caring person who values family and relationships. I enjoy traveling, cooking, and reading in my free time. Looking for someone who is honest, caring, and family-oriented.",
        interests: ["Travel", "Cooking", "Reading", "Music", "Dance", "Yoga"],
        photos: [
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
            "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
        ],
        profileCompletion: 85,
        matches: 92
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleFavoriteClick = () => {
        setIsFavorite(!isFavorite);
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, rgba(255,249,251,0.95) 0%, rgba(248,187,208,0.8) 100%)',
            py: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                background: `
                radial-gradient(circle at 10% 20%, rgba(255, 200, 220, 0.3) 0%, transparent 20%),
                radial-gradient(circle at 90% 70%, rgba(216, 27, 96, 0.2) 0%, transparent 20%)
                `,
                zIndex: 0
            }
        }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Paper elevation={10} sx={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                    mb: 4,
                    position: 'relative'
                }}>
                    <Box sx={{
                        height: '200px',
                        background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                        position: 'relative'
                    }}>
                        <Fab size="small" color="primary" sx={{
                            position: 'absolute',
                            bottom: -20,
                            right: 20,
                            background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)'
                        }}>
                            <PhotoCamera />
                        </Fab>
                    </Box>

                    {/* Profile Content */}
                    <Box sx={{ p: 4, pt: 0 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: -8 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={user.photos[0]}
                                    sx={{
                                        width: 150,
                                        height: 150,
                                        border: '5px solid white',
                                        boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <VerifiedUser sx={{
                                    position: 'absolute',
                                    bottom: 10,
                                    right: 10,
                                    color: '#d81b60',
                                    background: 'white',
                                    borderRadius: '50%',
                                    padding: '2px',
                                    fontSize: '28px'
                                }} />
                            </Box>

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <IconButton onClick={handleFavoriteClick} sx={{
                                    background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                    color: 'white',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)'
                                    }
                                }}>
                                    {isFavorite ? <Favorite /> : <FavoriteBorder />}
                                </IconButton>
                                <Button variant="contained" startIcon={<Message />} sx={{
                                    borderRadius: '50px',
                                    background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                    px: 3,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)'
                                    }
                                }}>
                                    Send Message
                                </Button>
                            </Box>
                        </Box>

                        {/* User Info */}
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#d81b60' }}>
                                    {user.name}
                                </Typography>
                                <Chip label={`${user.age} years`} variant="outlined" sx={{ color: '#d81b60', borderColor: '#d81b60' }} />
                            </Box>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: '#78909c' }}>
                                    <LocationOn sx={{ fontSize: '18px', mr: 0.5, color: '#d81b60' }} /> {user.location}
                                </Typography>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: '#78909c' }}>
                                    <Work sx={{ fontSize: '18px', mr: 0.5, color: '#d81b60' }} /> {user.profession}
                                </Typography>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: '#78909c' }}>
                                    <School sx={{ fontSize: '18px', mr: 0.5, color: '#d81b60' }} /> {user.education}
                                </Typography>
                            </Box>

                            {/* Match Score */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Box sx={{ width: '100%', maxWidth: 300 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="body2" sx={{ color: '#78909c' }}>Profile Completeness</Typography>
                                        <Typography variant="body2" sx={{ color: '#d81b60', fontWeight: 600 }}>{user.profileCompletion}%</Typography>
                                    </Box>
                                    <Box sx={{ width: '100%', height: 8, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                                        <Box sx={{
                                            width: `${user.profileCompletion}%`,
                                            height: '100%',
                                            background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                            borderRadius: 4
                                        }} />
                                    </Box>
                                </Box>

                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" sx={{ color: '#d81b60', fontWeight: 700 }}>{user.matches}%</Typography>
                                    <Typography variant="body2" sx={{ color: '#78909c' }}>Match Score</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* Tabs */}
                    <Box sx={{
                        position: 'relative',
                        mb: 4,
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        mx: 'auto',
                        maxWidth: 'fit-content',
                        overflow: 'hidden',
                        border: '1px solid rgba(216, 27, 96, 0.1)'
                    }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            sx={{
                                '& .MuiTabs-indicator': {
                                    height: '100%',
                                    background: 'linear-gradient(135deg, rgba(216, 27, 96, 0.08) 0%, rgba(136, 14, 79, 0.05) 100%)',
                                    borderRadius: '16px',
                                    zIndex: 0,
                                    animation: 'slideIndicator 0.4s ease-out',
                                    '@keyframes slideIndicator': {
                                        '0%': { opacity: 0, transform: 'scale(0.95)' },
                                        '100%': { opacity: 1, transform: 'scale(1)' }
                                    }
                                },
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    color: '#78909c',
                                    padding: '16px 32px',
                                    transition: 'all 0.3s ease',
                                    minHeight: '0px',
                                    zIndex: 1,
                                    position: 'relative',
                                    '&.Mui-selected': {
                                        color: '#d81b60',
                                        fontWeight: 600,
                                    },
                                }
                            }}
                        >
                            <Tab
                                icon={<Person sx={{ fontSize: '20px', mb: 0.5 }} />}
                                iconPosition="start"
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        About
                                        <Box sx={{
                                            ml: 1,
                                            background: tabValue === 0 ? '#d81b60' : 'rgba(216, 27, 96, 0.1)',
                                            color: tabValue === 0 ? 'white' : '#d81b60',
                                            borderRadius: '10px',
                                            px: 1,
                                            py: 0.2,
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            5
                                        </Box>
                                    </Box>
                                }
                            />
                            <Tab
                                icon={<PhotoCamera sx={{ fontSize: '20px', mb: 0.5 }} />}
                                iconPosition="start"
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        Photos
                                        <Box sx={{
                                            ml: 1,
                                            background: tabValue === 1 ? '#d81b60' : 'rgba(216, 27, 96, 0.1)',
                                            color: tabValue === 1 ? 'white' : '#d81b60',
                                            borderRadius: '10px',
                                            px: 1,
                                            py: 0.2,
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            12
                                        </Box>
                                    </Box>
                                }
                            />
                            <Tab
                                icon={<Favorite sx={{ fontSize: '20px', mb: 0.5 }} />}
                                iconPosition="start"
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        Preferences
                                        <Box sx={{
                                            ml: 1,
                                            background: tabValue === 2 ? '#d81b60' : 'rgba(216, 27, 96, 0.1)',
                                            color: tabValue === 2 ? 'white' : '#d81b60',
                                            borderRadius: '10px',
                                            px: 1,
                                            py: 0.2,
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            8
                                        </Box>
                                    </Box>
                                }
                            />
                        </Tabs>
                    </Box>
                </Paper>

                {/* Tab Content */}
                <Paper elevation={10} sx={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                    p: 4
                }}>
                    <TabPanel value={tabValue} index={0}>
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Typography variant="h6" gutterBottom sx={{ color: '#d81b60', fontWeight: 600 }}>
                                    About Me
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#37474f', lineHeight: 1.7, mb: 4 }}>
                                    {user.about}
                                </Typography>

                                <Typography variant="h6" gutterBottom sx={{ color: '#d81b60', fontWeight: 600 }}>
                                    Interests
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                                    {user.interests.map((interest, index) => (
                                        <Chip
                                            key={index}
                                            label={interest}
                                            sx={{
                                                background: 'linear-gradient(135deg, rgba(216, 27, 96, 0.1) 0%, rgba(136, 14, 79, 0.05) 100%)',
                                                color: '#d81b60',
                                                fontWeight: 500
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="h6" gutterBottom sx={{ color: '#d81b60', fontWeight: 600 }}>
                                    Basic Details
                                </Typography>
                                <Box sx={{ mb: 3 }}>
                                    <DetailItem icon={<Cake />} label="Age" value={`${user.age} years`} />
                                    <DetailItem icon={<Work />} label="Profession" value={user.profession} />
                                    <DetailItem icon={<School />} label="Education" value={user.education} />
                                    <DetailItem icon={<Language />} label="Mother Tongue" value={user.motherTongue} />
                                </Box>

                                <Typography variant="h6" gutterBottom sx={{ color: '#d81b60', fontWeight: 600 }}>
                                    Background
                                </Typography>
                                <Box>
                                    <DetailItem label="Religion" value={user.religion} />
                                    <DetailItem label="Caste" value={user.caste} />
                                    <DetailItem label="Height" value={user.height} />
                                </Box>
                            </Grid>
                        </Grid>
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#d81b60', fontWeight: 600, mb: 3 }}>
                            Photos
                        </Typography>
                        <Grid container spacing={2}>
                            {user.photos.map((photo, index) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                    <Card sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={photo}
                                            alt={`Profile photo ${index + 1}`}
                                        />
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </TabPanel>

                    <TabPanel value={tabValue} index={2}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#d81b60', fontWeight: 600, mb: 3 }}>
                            Partner Preferences
                        </Typography>
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, md: 6 }} >
                                <PreferenceItem title="Age Range" value="28-35 years" />
                                <PreferenceItem title="Height" value={'5\'8" and above'} />
                                <PreferenceItem title="Marital Status" value="Never Married" />
                                <PreferenceItem title="Religion" value="Hindu" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <PreferenceItem title="Education" value="Graduate or above" />
                                <PreferenceItem title="Profession" value="Employed" />
                                <PreferenceItem title="Location" value="Any metro city in India" />
                                <PreferenceItem title="Diet" value="Vegetarian preferred" />
                            </Grid>
                        </Grid>
                    </TabPanel>
                </Paper>
            </Container>
        </Box>
    );
};

// Helper Components
const DetailItem = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid #f5f5f5' }}>
        {icon && React.cloneElement(icon, { sx: { color: '#d81b60', mr: 2 } })}
        <Typography variant="body2" sx={{ color: '#78909c', minWidth: 120 }}>{label}</Typography>
        <Typography variant="body2" sx={{ color: '#37474f', fontWeight: 500 }}>{value}</Typography>
    </Box>
);

const PreferenceItem = ({ title, value }) => (
    <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ color: '#d81b60', fontWeight: 600, mb: 0.5 }}>{title}</Typography>
        <Typography variant="body2" sx={{ color: '#37474f' }}>{value}</Typography>
    </Box>
);

export default Profile;