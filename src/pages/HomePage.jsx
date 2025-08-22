import React from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, CardMedia, Button, TextField, InputAdornment } from '@mui/material';
import {
    Search as SearchIcon,
    Favorite as FavoriteIcon,
    People as PeopleIcon,
    Chat as ChatIcon,
    Security as SecurityIcon,
    ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

const HomePage = () => {
    const successStories = [
        {
            name: 'Amit & Priya',
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
            story: 'Met through bandhanmatch in 2021 and married in 2022'
        },
        {
            name: 'Rahul & Sneha',
            image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
            story: 'Found their perfect match within 3 months of joining'
        },
        {
            name: 'Vikram & Anjali',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
            story: 'Connected through our advanced matching system'
        }
    ];

    const features = [
        {
            icon: <PeopleIcon sx={{ fontSize: 40 }} />,
            title: 'Smart Matching',
            description: 'Advanced algorithm to find your perfect partner based on preferences'
        },
        {
            icon: <SecurityIcon sx={{ fontSize: 40 }} />,
            title: 'Privacy Protection',
            description: 'Your data is secure with our advanced privacy controls'
        },
        {
            icon: <ChatIcon sx={{ fontSize: 40 }} />,
            title: 'Secure Chat',
            description: 'Get to know your matches with our safe messaging system'
        },
        {
            icon: <FavoriteIcon sx={{ fontSize: 40 }} />,
            title: 'Verified Profiles',
            description: 'All profiles are verified to ensure authenticity'
        }
    ];

    return (
        <Box sx={{ padding: "0px" }}>
            <Box id="home" sx={{
                background: 'linear-gradient(135deg, rgba(255,249,251,0.95) 0%, rgba(248,187,208,0.8) 100%)',
                py: 10,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h2" component="h1" gutterBottom sx={{ color: '#d81b60', fontWeight: 700 }}>
                                Find Your Perfect Life Partner
                            </Typography>
                            <Typography variant="subtitle1" sx={{ color: '#555', fontStyle: 'italic' }}>
                                अपना सही जीवनसाथी खोजें
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#37474f', mb: 4, fontSize: '1.2rem' }}>
                                Join thousands of couples who found their soulmates through our trusted matchmaking service
                            </Typography>

                            {/* Search Box */}
                            <Box sx={{
                                backgroundColor: 'white',
                                borderRadius: '50px',
                                p: 1,
                                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                maxWidth: '500px'
                            }}>
                                <TextField
                                    fullWidth
                                    placeholder="Search by profession, interest, or community..."
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                        sx: { borderRadius: '50px', border: 'none' }
                                    }}
                                    sx={{
                                        '& fieldset': { border: 'none' },
                                    }}
                                />
                                <Button variant="contained" sx={{
                                    borderRadius: '50px',
                                    px: 3,
                                    py: 1,
                                    background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)'
                                }}>
                                    Search
                                </Button>
                            </Box>

                            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ color: '#78909c', mr: 2 }}>
                                    Trusted by over 500,000 members
                                </Typography>
                                <Box sx={{ display: 'flex' }}>
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <Box key={item} sx={{
                                            width: 35,
                                            height: 35,
                                            borderRadius: '50%',
                                            border: '2px solid white',
                                            ml: -1,
                                            background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            {item === 5 ? '5K+' : 'U'}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
                            <Box sx={{
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                    borderRadius: '20px',
                                    transform: 'rotate(5deg)',
                                    zIndex: 0
                                }
                            }}>
                                <Box component="img"
                                    src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"
                                    alt="Happy couple"
                                    sx={{
                                        width: '100%',
                                        borderRadius: '20px',
                                        position: 'relative',
                                        zIndex: 1,
                                        transform: 'rotate(-5deg)',
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'rotate(0deg)'
                                        }
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Box id="features" sx={{
                py: 8,
                backgroundColor: 'white',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100%',
                    background: 'radial-gradient(circle at 30% 70%, rgba(248, 187, 208, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(136, 14, 79, 0.1) 0%, transparent 50%)',
                    zIndex: 0
                }
            }}>
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{
                        textAlign: 'center',
                        mb: 6,
                        opacity: 0,
                        animation: 'fadeInUp 0.8s ease forwards',
                        '@keyframes fadeInUp': {
                            '0%': {
                                opacity: 0,
                                transform: 'translateY(30px)'
                            },
                            '100%': {
                                opacity: 1,
                                transform: 'translateY(0)'
                            }
                        }
                    }}>
                        <Typography variant="h3" component="h2" sx={{
                            color: '#d81b60',
                            mb: 2,
                            background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block'
                        }}>
                            Why Choose bandhanmatch?
                        </Typography>
                        <Typography variant="body1" sx={{
                            color: '#78909c',
                            maxWidth: '600px',
                            margin: '0 auto',
                            fontSize: '1.1rem',
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-15px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '60px',
                                height: '3px',
                                background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                borderRadius: '2px'
                            }
                        }}>
                            We provide the best platform to find your perfect life partner with trust and safety
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        {features?.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card sx={{
                                    textAlign: 'center',
                                    p: 3,
                                    borderRadius: '20px',
                                    background: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
                                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    border: '1px solid rgba(248, 187, 208, 0.3)',
                                    opacity: 0,
                                    animation: `cardReveal 0.6s ease forwards ${index * 0.2 + 0.3}s`,
                                    '@keyframes cardReveal': {
                                        '0%': {
                                            opacity: 0,
                                            transform: 'translateY(40px) scale(0.95)'
                                        },
                                        '100%': {
                                            opacity: 1,
                                            transform: 'translateY(0) scale(1)'
                                        }
                                    },
                                    '&:hover': {
                                        transform: 'translateY(-12px) scale(1.02)',
                                        boxShadow: '0 20px 40px rgba(216, 27, 96, 0.15), 0 8px 20px rgba(136, 14, 79, 0.1)',
                                        '& .feature-icon': {
                                            transform: 'scale(1.1) rotate(5deg)',
                                            background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                            color: 'white'
                                        }
                                    }
                                }}>
                                    <Box className="feature-icon" sx={{
                                        color: '#d81b60',
                                        mb: 2,
                                        display: 'inline-flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(145deg, #fff9fb 0%, #fce4ec 100%)',
                                        boxShadow: '0 4px 15px rgba(216, 27, 96, 0.2)',
                                        transition: 'all 0.4s ease',
                                        position: 'relative',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, rgba(216, 27, 96, 0.1) 0%, rgba(136, 14, 79, 0.05) 100%)',
                                            animation: 'pulse 2s infinite',
                                            '@keyframes pulse': {
                                                '0%': {
                                                    transform: 'scale(1)',
                                                    opacity: 0.7
                                                },
                                                '50%': {
                                                    transform: 'scale(1.5)',
                                                    opacity: 0
                                                },
                                                '100%': {
                                                    transform: 'scale(1)',
                                                    opacity: 0.7
                                                }
                                            }
                                        }
                                    }}>
                                        {React.cloneElement(feature.icon, { sx: { fontSize: 40, position: 'relative', zIndex: 1 } })}
                                    </Box>
                                    <Typography variant="h5" component="h3" gutterBottom sx={{
                                        color: '#37474f',
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #37474f 0%, #d81b60 50%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        color: '#78909c',
                                        lineHeight: 1.6
                                    }}>
                                        {feature.description}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{
                        position: 'absolute',
                        top: '20%',
                        left: '5%',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(216, 27, 96, 0.1) 0%, rgba(136, 14, 79, 0.05) 100%)',
                        animation: 'float 6s ease-in-out infinite',
                        '@keyframes float': {
                            '0%, 100%': {
                                transform: 'translateY(0px)'
                            },
                            '50%': {
                                transform: 'translateY(-20px)'
                            }
                        }
                    }} />
                    <Box sx={{
                        position: 'absolute',
                        bottom: '30%',
                        right: '10%',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(248, 187, 208, 0.2) 0%, rgba(216, 27, 96, 0.1) 100%)',
                        animation: 'float 5s ease-in-out infinite 1s',
                        '@keyframes float': {
                            '0%, 100%': {
                                transform: 'translateY(0px)'
                            },
                            '50%': {
                                transform: 'translateY(-15px)'
                            }
                        }
                    }} />
                </Container>
            </Box>

            {/* Success Stories */}
            <Box id="stories" sx={{ py: 8, backgroundColor: '#fff9fb' }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" component="h2" align="center" sx={{ color: '#d81b60', mb: 2 }}>
                        Success Stories
                    </Typography>
                    <Typography variant="body1" align="center" sx={{ color: '#78909c', maxWidth: '600px', margin: '0 auto 50px', fontSize: '1.1rem' }}>
                        Real couples who found their perfect match through our platform
                    </Typography>

                    <Grid container spacing={4}>
                        {successStories.map((story, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card sx={{
                                    borderRadius: '15px',
                                    overflow: 'hidden',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-5px)'
                                    }
                                }}>
                                    <CardMedia
                                        component="img"
                                        height="250"
                                        image={story.image}
                                        alt={story.name}
                                    />
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h6" component="h3" gutterBottom>
                                            {story.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#78909c' }}>
                                            {story.story}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ textAlign: 'center', mt: 5 }}>
                        <Button variant="outlined" sx={{
                            borderRadius: '50px',
                            px: 4,
                            py: 1,
                            color: '#d81b60',
                            borderColor: '#d81b60',
                            '&:hover': {
                                borderColor: '#d81b60',
                                backgroundColor: 'rgba(216, 27, 96, 0.04)'
                            }
                        }}>
                            View More Stories
                            <ArrowForwardIcon sx={{ ml: 1 }} />
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box sx={{
                py: 10,
                background: 'linear-gradient(135deg, rgba(216,27,96,0.9) 0%, rgba(136,14,79,0.9) 100%)',
                color: 'white',
                textAlign: 'center'
            }}>
                <Container maxWidth="md">
                    <Typography variant="h3" component="h2" gutterBottom>
                        Ready to Find Your Perfect Match?
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                        Join today and start your journey to forever happiness
                    </Typography>
                    <Button variant="contained" size="large" sx={{
                        borderRadius: '50px',
                        px: 5,
                        py: 1.5,
                        backgroundColor: 'white',
                        color: '#d81b60',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        '&:hover': {
                            backgroundColor: '#f5f5f5'
                        }
                    }}>
                        Create Your Profile
                    </Button>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{
                py: 4,
                backgroundColor: '#fff',
                borderTop: '1px solid #f0f0f0',
                textAlign: 'center'
            }}>
                <Container maxWidth="lg">
                    <Typography variant="body2" sx={{ color: '#78909c' }}>
                        © 2023 bandhanmatch. All rights reserved. | Privacy Policy | Terms of Service
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage;