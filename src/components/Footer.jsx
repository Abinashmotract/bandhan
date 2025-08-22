import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, IconButton, TextField, Button, Divider, Fade } from '@mui/material';
import {
    Facebook as FacebookIcon,
    Instagram as InstagramIcon,
    Twitter as TwitterIcon,
    YouTube as YouTubeIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Favorite as FavoriteIcon,
    ArrowUpward as ArrowUpwardIcon
} from '@mui/icons-material';

const Footer = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        // Trigger entrance animation
        setTimeout(() => setIsVisible(true), 100);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            <Fade in={isVisible} timeout={1000}>
                <Box
                    component="footer"
                    sx={{
                        background: 'linear-gradient(135deg, #1a0610 0%, #2c0b1a 100%)',
                        color: 'white',
                        pt: 8,
                        pb: 4,
                        mt: 8,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '2px',
                            background: 'linear-gradient(90deg, transparent, #d81b60, transparent)',
                            animation: 'shine 3s infinite',
                            '@keyframes shine': {
                                '0%': { backgroundPosition: '-200% 0' },
                                '100%': { backgroundPosition: '200% 0' }
                            }
                        }
                    }}
                >
                    {/* Animated background elements */}
                    <Box sx={{
                        position: 'absolute',
                        top: '20%',
                        left: '10%',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(216, 27, 96, 0.15) 0%, transparent 70%)',
                        animation: 'float 8s ease-in-out infinite',
                        '@keyframes float': {
                            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                            '50%': { transform: 'translateY(-20px) rotate(180deg)' }
                        }
                    }} />

                    <Box sx={{
                        position: 'absolute',
                        bottom: '30%',
                        right: '15%',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(248, 187, 208, 0.1) 0%, transparent 70%)',
                        animation: 'float 6s ease-in-out infinite 2s',
                        '@keyframes float': {
                            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                            '50%': { transform: 'translateY(-15px) rotate(180deg)' }
                        }
                    }} />

                    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                        <Grid container spacing={6}>
                            {/* Company Info */}
                            <Grid item xs={12} md={4}>
                                <Box sx={{
                                    animation: 'slideInLeft 0.8s ease-out',
                                    '@keyframes slideInLeft': {
                                        '0%': { transform: 'translateX(-30px)', opacity: 0 },
                                        '100%': { transform: 'translateX(0)', opacity: 1 }
                                    }
                                }}>
                                    <Typography
                                        variant="h4"
                                        component="div"
                                        sx={{
                                            fontFamily: '"Playfair Display", serif',
                                            fontWeight: 700,
                                            color: '#f8bbd0',
                                            mb: 2,
                                            background: 'linear-gradient(135deg, #f8bbd0 0%, #d81b60 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}
                                    >
                                        Bandhnam<span style={{ color: '#d81b60' }}>Match</span>
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        mb: 3,
                                        color: '#e1bee7',
                                        lineHeight: 1.8,
                                        fontSize: '1rem'
                                    }}>
                                        Connecting hearts since 2010. We are dedicated to helping you find your perfect life partner with trust, safety, and authenticity.
                                    </Typography>

                                    {/* Social Media */}
                                    <Box sx={{ mt: 4 }}>
                                        <Typography variant="h6" sx={{
                                            fontSize: '1.1rem',
                                            mb: 2,
                                            color: '#f8bbd0',
                                            fontWeight: 600
                                        }}>
                                            Follow Our Journey
                                        </Typography>
                                        <Box>
                                            {[
                                                { icon: <FacebookIcon />, color: '#4267B2' },
                                                { icon: <InstagramIcon />, color: '#E1306C' },
                                                { icon: <TwitterIcon />, color: '#1DA1F2' },
                                                { icon: <YouTubeIcon />, color: '#FF0000' }
                                            ].map((social, index) => (
                                                <IconButton
                                                    key={index}
                                                    sx={{
                                                        color: '#f8bbd0',
                                                        mr: 1,
                                                        mb: 1,
                                                        background: 'rgba(255, 255, 255, 0.1)',
                                                        backdropFilter: 'blur(10px)',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            color: 'white',
                                                            background: social.color,
                                                            transform: 'translateY(-3px)',
                                                            boxShadow: `0 5px 15px ${social.color}80`
                                                        }
                                                    }}
                                                >
                                                    {social.icon}
                                                </IconButton>
                                            ))}
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>

                            {/* Quick Links */}
                            <Grid item xs={12} sm={6} md={2}>
                                <Box sx={{
                                    animation: 'slideInUp 0.8s ease-out 0.2s both',
                                    '@keyframes slideInUp': {
                                        '0%': { transform: 'translateY(30px)', opacity: 0 },
                                        '100%': { transform: 'translateY(0)', opacity: 1 }
                                    }
                                }}>
                                    <Typography variant="h6" sx={{
                                        fontSize: '1.2rem',
                                        mb: 3,
                                        color: '#f8bbd0',
                                        fontWeight: 600,
                                        position: 'relative',
                                        display: 'inline-block',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: '-8px',
                                            left: 0,
                                            width: '40px',
                                            height: '2px',
                                            background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                            borderRadius: '2px'
                                        }
                                    }}>
                                        Quick Links
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        {['About Us', 'Success Stories', 'Blog', 'Careers', 'Contact Us'].map((item, index) => (
                                            <Typography
                                                key={item}
                                                variant="body2"
                                                sx={{
                                                    mb: 2,
                                                    color: '#e1bee7',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    position: 'relative',
                                                    pl: 2,
                                                    '&::before': {
                                                        content: '"❤"',
                                                        position: 'absolute',
                                                        left: 0,
                                                        opacity: 0,
                                                        transition: 'all 0.3s ease'
                                                    },
                                                    '&:hover': {
                                                        color: '#d81b60',
                                                        transform: 'translateX(8px)',
                                                        '&::before': {
                                                            opacity: 1,
                                                            left: '-5px'
                                                        }
                                                    }
                                                }}
                                            >
                                                {item}
                                            </Typography>
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>

                            {/* Help & Support */}
                            <Grid item xs={12} sm={6} md={2}>
                                <Box sx={{
                                    animation: 'slideInUp 0.8s ease-out 0.4s both',
                                    '@keyframes slideInUp': {
                                        '0%': { transform: 'translateY(30px)', opacity: 0 },
                                        '100%': { transform: 'translateY(0)', opacity: 1 }
                                    }
                                }}>
                                    <Typography variant="h6" sx={{
                                        fontSize: '1.2rem',
                                        mb: 3,
                                        color: '#f8bbd0',
                                        fontWeight: 600,
                                        position: 'relative',
                                        display: 'inline-block',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: '-8px',
                                            left: 0,
                                            width: '40px',
                                            height: '2px',
                                            background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                            borderRadius: '2px'
                                        }
                                    }}>
                                        Support
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        {['FAQ', 'Safety Tips', 'Membership', 'Report Misuse', 'Feedback'].map((item) => (
                                            <Typography
                                                key={item}
                                                variant="body2"
                                                sx={{
                                                    mb: 2,
                                                    color: '#e1bee7',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    position: 'relative',
                                                    pl: 2,
                                                    '&::before': {
                                                        content: '"❤"',
                                                        position: 'absolute',
                                                        left: 0,
                                                        opacity: 0,
                                                        transition: 'all 0.3s ease'
                                                    },
                                                    '&:hover': {
                                                        color: '#d81b60',
                                                        transform: 'translateX(8px)',
                                                        '&::before': {
                                                            opacity: 1,
                                                            left: '-5px'
                                                        }
                                                    }
                                                }}
                                            >
                                                {item}
                                            </Typography>
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>

                            {/* Newsletter Subscription */}
                            <Grid item xs={12} md={4}>
                                <Box sx={{
                                    animation: 'slideInRight 0.8s ease-out 0.6s both',
                                    '@keyframes slideInRight': {
                                        '0%': { transform: 'translateX(30px)', opacity: 0 },
                                        '100%': { transform: 'translateX(0)', opacity: 1 }
                                    }
                                }}>
                                    <Typography variant="h6" sx={{
                                        fontSize: '1.2rem',
                                        mb: 2,
                                        color: '#f8bbd0',
                                        fontWeight: 600,
                                        position: 'relative',
                                        display: 'inline-block',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: '-8px',
                                            left: 0,
                                            width: '40px',
                                            height: '2px',
                                            background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                            borderRadius: '2px'
                                        }
                                    }}>
                                        Stay Updated
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        mb: 3,
                                        color: '#e1bee7',
                                        lineHeight: 1.6
                                    }}>
                                        Get the latest success stories and matrimony tips delivered to your inbox.
                                    </Typography>

                                    <Box sx={{ display: 'flex', mt: 2, mb: 4 }}>
                                        <TextField
                                            placeholder="Your email address"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            sx={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                borderRadius: '8px 0 0 8px',
                                                '& .MuiOutlinedInput-root': {
                                                    color: 'white',
                                                    '& fieldset': {
                                                        borderColor: 'rgba(255, 255, 255, 0.1)',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'rgba(255, 255, 255, 0.2)',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#d81b60',
                                                    },
                                                },
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            sx={{
                                                borderRadius: '0 8px 8px 0',
                                                background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                                minWidth: 'auto',
                                                px: 3,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 5px 15px rgba(216, 27, 96, 0.4)'
                                                }
                                            }}
                                        >
                                            Subscribe
                                        </Button>
                                    </Box>

                                    {/* Contact Info */}
                                    <Box sx={{ mt: 3 }}>
                                        {[
                                            { icon: <PhoneIcon />, text: '+1 (800) 123-4567' },
                                            { icon: <EmailIcon />, text: 'info@bandhnammatch.com' },
                                            { icon: <LocationIcon />, text: '123 Love Street, Relationship City' }
                                        ].map((item, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mb: 2,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateX(5px)'
                                                    }
                                                }}
                                            >
                                                <Box sx={{
                                                    color: '#d81b60',
                                                    mr: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '30px',
                                                    height: '30px',
                                                    borderRadius: '50%',
                                                    background: 'rgba(216, 27, 96, 0.1)'
                                                }}>
                                                    {item.icon}
                                                </Box>
                                                <Typography variant="body2" sx={{ color: '#e1bee7' }}>
                                                    {item.text}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        <Divider sx={{
                            my: 6,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            animation: 'fadeIn 1s ease-out 0.8s both',
                            '@keyframes fadeIn': {
                                '0%': { opacity: 0 },
                                '100%': { opacity: 1 }
                            }
                        }} />

                        {/* Copyright and Bottom Links */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            animation: 'fadeIn 1s ease-out 1s both'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 0 } }}>
                                <Typography variant="body2" sx={{ color: '#e1bee7', display: 'flex', alignItems: 'center' }}>
                                    Made with <FavoriteIcon sx={{ color: '#d81b60', mx: 0.5, fontSize: '1rem' }} /> for your happiness
                                </Typography>
                            </Box>

                            <Typography variant="body2" sx={{ color: '#e1bee7', mb: { xs: 2, sm: 0 } }}>
                                © 2023 BhandhanMatch. All rights reserved.
                            </Typography>

                            <Box sx={{ display: 'flex' }}>
                                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                                    <Typography
                                        key={item}
                                        variant="body2"
                                        sx={{
                                            ml: 3,
                                            color: '#e1bee7',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: '-2px',
                                                left: 0,
                                                width: 0,
                                                height: '1px',
                                                background: '#d81b60',
                                                transition: 'width 0.3s ease'
                                            },
                                            '&:hover': {
                                                color: '#d81b60',
                                                '&::after': {
                                                    width: '100%'
                                                }
                                            }
                                        }}
                                    >
                                        {item}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                    </Container>

                    {/* Scroll to Top Button */}
                    {showScrollTop && (
                        <IconButton
                            onClick={scrollToTop}
                            sx={{
                                position: 'fixed',
                                bottom: '30px',
                                right: '30px',
                                backgroundColor: '#d81b60',
                                color: 'white',
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                boxShadow: '0 4px 20px rgba(216, 27, 96, 0.3)',
                                animation: 'bounce 2s infinite',
                                zIndex: 1000,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: '#880e4f',
                                    transform: 'scale(1.1)',
                                    boxShadow: '0 6px 25px rgba(216, 27, 96, 0.5)'
                                },
                                '@keyframes bounce': {
                                    '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                                    '40%': { transform: 'translateY(-10px)' },
                                    '60%': { transform: 'translateY(-5px)' }
                                }
                            }}
                        >
                            <ArrowUpwardIcon />
                        </IconButton>
                    )}
                </Box>
            </Fade>
        </>
    );
};

export default Footer;