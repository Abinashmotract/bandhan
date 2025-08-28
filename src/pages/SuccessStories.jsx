import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Button,
    Tabs,
    Tab,
    Avatar,
    IconButton,
    Dialog,
    DialogContent,
    DialogTitle,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    Favorite,
    PlayArrow,
    Close,
    Facebook,
    Instagram,
    Twitter,
    LinkedIn,
    ArrowForward
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const SuccessStories = () => {
    const [tabValue, setTabValue] = useState(0);
    const [selectedStory, setSelectedStory] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleStoryClick = (story) => {
        setSelectedStory(story);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedStory(null);
    };

    // Success stories data
    const successStories = [
        {
            id: 1,
            coupleName: "Rahul & Priya",
            marriageDate: "Married on February 14, 2022",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
            story: "We met through bandhnammatch in 2021 and instantly connected over our love for travel and photography. After six months of dating, Rahul proposed during a sunrise hike in the mountains. Our wedding was an intimate affair with close family and friends.",
            video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            tags: ["Intercaste", "Love Marriage", "Travel Lovers"]
        },
        {
            id: 2,
            coupleName: "Amit & Sunita",
            marriageDate: "Married on November 5, 2021",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
            story: "Both coming from traditional families, we were hesitant about online matchmaking. But bandhnammatch made the process comfortable and secure. We found we had similar values and life goals. Today, we're happily married and expecting our first child!",
            video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            tags: ["Arranged Marriage", "Traditional", "Family Values"]
        },
        {
            id: 3,
            coupleName: "Vikram & Neha",
            marriageDate: "Married on June 18, 2022",
            image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db1604?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
            story: "We were both focused on our careers and had almost given up on finding the right partner. bandhnammatch's compatibility matching brought us together. We bonded over our love for cooking and now run a food blog together!",
            video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            tags: ["Career-oriented", "Food Lovers", "Compatibility Match"]
        },
        {
            id: 4,
            coupleName: "Raj & Meera",
            marriageDate: "Married on September 10, 2021",
            image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
            story: "After our previous marriages ended, we were both cautious about finding love again. bandhnammatch gave us a safe space to connect without judgment. We took things slow and built a strong foundation of friendship first.",
            video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            tags: ["Second Chance", "Mature Love", "Blended Family"]
        },
        {
            id: 5,
            coupleName: "Sanjay & Pooja",
            marriageDate: "Married on December 3, 2022",
            image: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
            story: "As single parents, we wanted to find someone who would understand our responsibilities. bandhnammatch helped us connect with others in similar situations. Our children are now the best of friends!",
            video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            tags: ["Single Parents", "Understanding", "Family First"]
        },
        {
            id: 6,
            coupleName: "Anil & Kavita",
            marriageDate: "Married on April 22, 2022",
            image: "https://images.unsplash.com/photo-1548449112-96a38a643324?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
            story: "We both believed that everyone deserves a second chance at happiness. bandhnammatch made us believe in love again. Our wedding was a celebration of new beginnings with all our loved ones.",
            video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            tags: ["New Beginnings", "Happiness", "Second Chance"]
        }
    ]

    return (
        <Box sx={{
            // minHeight: '100vh',
            // background: 'linear-gradient(135deg, rgba(255,249,251,0.95) 0%, rgba(248,187,208,0.8) 100%)',
            pt: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                width: '100%',
                // height: '100%',
                top: 0,
                left: 0,
        //         background: `
        //   radial-gradient(circle at 10% 20%, rgba(255, 200, 220, 0.3) 0%, transparent 20%),
        //   radial-gradient(circle at 90% 70%, rgba(216, 27, 96, 0.2) 0%, transparent 20%)
        // `,
                zIndex: 0
            }
        }}>
            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 6 }}>
                {/* Header Section */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h2" sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 2
                    }}>
                        Success Stories
                    </Typography>
                    <Typography variant="h6" sx={{
                        color: 'white',
                        maxWidth: '700px',
                        mx: 'auto',
                        fontSize: '1.2rem',
                        lineHeight: 1.6
                    }}>
                        Real stories of love and companionship that began on bandhnammatch.
                        These couples found their perfect match and are now living their happily ever after.
                    </Typography>
                </Box>

                {/* Stats Section */}
                <Box sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '20px',
                    p: 4,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    mb: 6,
                    textAlign: 'center'
                }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="h3" sx={{ color: '#d81b60', fontWeight: 700, mb: 1 }}>
                                5000+
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'white' }}>
                                Successful Matches
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="h3" sx={{ color: '#d81b60', fontWeight: 700, mb: 1 }}>
                                92%
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#78909c' }}>
                                Success Rate
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="h3" sx={{ color: '#d81b60', fontWeight: 700, mb: 1 }}>
                                28
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#78909c' }}>
                                Countries
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Grid container spacing={4}>
                    {successStories.map((story) => (
                        <Grid item xs={12} md={6} lg={4} key={story.id}>
                            <Card
                                sx={{
                                    width: '340px',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                    transition: 'all 0.4s ease',
                                    '&:hover': {
                                        transform: 'translateY(-10px)',
                                        boxShadow: '0 20px 40px rgba(216, 27, 96, 0.15)'
                                    }
                                }}
                            >
                                <Box sx={{ position: 'relative' }}>
                                    <CardMedia
                                        component="img"
                                        height="280"
                                        image={story.image}
                                        alt={story.coupleName}
                                    />
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        p: 3
                                    }}>
                                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                            {story.coupleName}
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        onClick={() => handleStoryClick(story)}
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            '&:hover': {
                                                background: '#d81b60',
                                                color: 'white'
                                            }
                                        }}
                                    >
                                        <PlayArrow />
                                    </IconButton>
                                </Box>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="body2" sx={{ color: '#880e4f', mb: 2, fontWeight: 500 }}>
                                        {story.marriageDate}
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        color: '#37474f',
                                        mb: 2,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {story.story}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                        {story.tags.map((tag, index) => (
                                            <Chip
                                                key={index}
                                                label={tag}
                                                size="small"
                                                sx={{
                                                    background: 'rgba(216, 27, 96, 0.1)',
                                                    color: '#d81b60',
                                                    fontWeight: 500
                                                }}
                                            />
                                        ))}
                                    </Box>
                                    <Button
                                        onClick={() => handleStoryClick(story)}
                                        endIcon={<ArrowForward />}
                                        sx={{
                                            color: '#d81b60',
                                            fontWeight: 600,
                                            '&:hover': {
                                                background: 'rgba(216, 27, 96, 0.1)'
                                            }
                                        }}
                                    >
                                        Read Full Story
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* CTA Section */}
                <Box sx={{
                    textAlign: 'center',
                    mt: 10,
                    background: 'linear-gradient(135deg, rgba(216, 27, 96, 0.05) 0%, rgba(136, 14, 79, 0.03) 100%)',
                    borderRadius: '30px',
                    p: 6
                }}>
                    <Typography variant="h3" sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 2
                    }}>
                        Ready to Write Your Success Story?
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: '#78909c',
                        maxWidth: '600px',
                        mx: 'auto',
                        mb: 4,
                        fontSize: '1.1rem'
                    }}>
                        Join thousands of couples who found their life partners on bandhnammatch
                    </Typography>
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" endIcon={<ArrowForward />} sx={{
                            borderRadius: '50px',
                            px: 5,
                            py: 1.5,
                            fontSize: '1.1rem',
                            background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                            fontWeight: 'bold',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)'
                            }
                        }}>
                            Create Your Profile
                        </Button>
                    </Link>
                </Box>
            </Container>

            {/* Story Detail Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                fullScreen={isMobile}
            >
                {selectedStory && (
                    <>
                        <DialogTitle sx={{
                            m: 0,
                            p: 2,
                            background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                {selectedStory.coupleName}'s Story
                            </Typography>
                            <IconButton
                                aria-label="close"
                                onClick={handleCloseDialog}
                                sx={{ color: 'white' }}
                            >
                                <Close />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent sx={{ p: 0 }}>
                            <Box sx={{ position: 'relative', height: isMobile ? '200px' : '400px' }}>
                                <CardMedia
                                    component="img"
                                    height={isMobile ? '200' : '400'}
                                    image={selectedStory.image}
                                    alt={selectedStory.coupleName}
                                    sx={{ width: '100%' }}
                                />
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    p: 3
                                }}>
                                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                                        {selectedStory.coupleName}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ p: 3 }}>
                                <Typography variant="body2" sx={{ color: '#880e4f', mb: 2, fontWeight: 500 }}>
                                    {selectedStory.marriageDate}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#37474f', mb: 3, lineHeight: 1.8 }}>
                                    {selectedStory.story}
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                    {selectedStory.tags.map((tag, index) => (
                                        <Chip
                                            key={index}
                                            label={tag}
                                            size="small"
                                            sx={{
                                                background: 'rgba(216, 27, 96, 0.1)',
                                                color: '#d81b60',
                                                fontWeight: 500
                                            }}
                                        />
                                    ))}
                                </Box>
                                {selectedStory.video && (
                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="h6" sx={{ color: '#d81b60', mb: 2, fontWeight: 600 }}>
                                            Watch Their Story
                                        </Typography>
                                        <Box sx={{
                                            position: 'relative',
                                            paddingTop: '56.25%', // 16:9 aspect ratio
                                            borderRadius: '12px',
                                            overflow: 'hidden'
                                        }}>
                                            <iframe
                                                src={selectedStory.video}
                                                title={selectedStory.coupleName}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    border: 'none',
                                                    borderRadius: '12px'
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                )}
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 1 }}>
                                    <IconButton sx={{ color: '#d81b60' }}>
                                        <Facebook />
                                    </IconButton>
                                    <IconButton sx={{ color: '#d81b60' }}>
                                        <Instagram />
                                    </IconButton>
                                    <IconButton sx={{ color: '#d81b60' }}>
                                        <Twitter />
                                    </IconButton>
                                    <IconButton sx={{ color: '#d81b60' }}>
                                        <LinkedIn />
                                    </IconButton>
                                </Box>
                            </Box>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default SuccessStories;