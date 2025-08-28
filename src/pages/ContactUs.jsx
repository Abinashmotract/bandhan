import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    TextField,
    Button,
    Paper,
    Card,
    CardContent,
    Divider,
    Chip,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Phone as PhoneIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    Schedule as ScheduleIcon,
    Send as SendIcon,
    Facebook as FacebookIcon,
    Instagram as InstagramIcon,
    Twitter as TwitterIcon,
    LinkedIn as LinkedInIcon
} from '@mui/icons-material';

const ContactUs = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log(formData);
        // Reset form
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
    };

    const contactMethods = [
        {
            icon: <PhoneIcon sx={{ fontSize: 40, color: '#d81b60' }} />,
            title: 'Call Us',
            details: '+91 98765 43210',
            subtitle: 'Mon to Fri: 9am to 6pm'
        },
        {
            icon: <EmailIcon sx={{ fontSize: 40, color: '#d81b60' }} />,
            title: 'Email Us',
            details: 'support@bandhanmatch.com',
            subtitle: 'We respond within 24 hours'
        },
        {
            icon: <LocationIcon sx={{ fontSize: 40, color: '#d81b60' }} />,
            title: 'Visit Us',
            details: '123 Matchmaking Lane, Mumbai',
            subtitle: 'Maharashtra, India - 400001'
        },
        {
            icon: <ScheduleIcon sx={{ fontSize: 40, color: '#d81b60' }} />,
            title: 'Business Hours',
            details: 'Monday - Friday: 9AM - 6PM',
            subtitle: 'Saturday: 10AM - 4PM'
        }
    ];

    const faqs = [
        {
            question: 'How do I create an account on Bandhan Match?',
            answer: 'Click on the "Sign Up" button on the top right corner, fill in your details, verify your email, and you\'re ready to start your journey to find your perfect match.'
        },
        {
            question: 'Is my personal information secure?',
            answer: 'Yes, we take privacy seriously. All your data is encrypted and we never share your information with third parties without your consent.'
        },
        {
            question: 'How does the matching algorithm work?',
            answer: 'Our algorithm considers your preferences, interests, background, and compatibility factors to suggest the most suitable matches for you.'
        }
    ];

    return (
        <Box sx={{
            py: 8,
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8bbd0 0%, #fce4ec 30%, #ffffff 100%)'
        }}>
            <Container maxWidth="lg">
                {/* Header Section */}
                <Box textAlign="center" mb={6}>
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
                        Get In Touch
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#555', maxWidth: '600px', margin: '0 auto' }}>
                        We're here to help you on your journey to find your perfect life partner. Reach out to us with any questions.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {/* Contact Information */}
                    <Grid item xs={12} md={5}>
                        <Box>
                            <Typography variant="h4" gutterBottom sx={{ color: '#d81b60', fontWeight: 700, mb: 3 }}>
                                Contact Information
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#555', mb: 4 }}>
                                Have questions about our services or need assistance with your account?
                                Our team is here to help you every step of the way in your matchmaking journey.
                            </Typography>

                            {/* Contact Methods */}
                            <Box sx={{ mb: 4 }}>
                                {contactMethods.map((method, index) => (
                                    <Box key={index} sx={{ display: 'flex', mb: 3 }}>
                                        <Box sx={{ mr: 2 }}>
                                            {method.icon}
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ color: '#37474f', fontWeight: 600 }}>
                                                {method.title}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: '#d81b60', fontWeight: 500 }}>
                                                {method.details}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#78909c' }}>
                                                {method.subtitle}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>

                            {/* Social Media */}
                            <Box>
                                <Typography variant="h6" sx={{ color: '#37474f', fontWeight: 600, mb: 2 }}>
                                    Follow Us
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            borderRadius: '50%',
                                            minWidth: 'auto',
                                            width: '50px',
                                            height: '50px',
                                            borderColor: '#3b5998',
                                            color: '#3b5998',
                                            '&:hover': {
                                                borderColor: '#3b5998',
                                                background: 'rgba(59, 89, 152, 0.1)'
                                            }
                                        }}
                                    >
                                        <FacebookIcon />
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            borderRadius: '50%',
                                            minWidth: 'auto',
                                            width: '50px',
                                            height: '50px',
                                            borderColor: '#E1306C',
                                            color: '#E1306C',
                                            '&:hover': {
                                                borderColor: '#E1306C',
                                                background: 'rgba(225, 48, 108, 0.1)'
                                            }
                                        }}
                                    >
                                        <InstagramIcon />
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            borderRadius: '50%',
                                            minWidth: 'auto',
                                            width: '50px',
                                            height: '50px',
                                            borderColor: '#1DA1F2',
                                            color: '#1DA1F2',
                                            '&:hover': {
                                                borderColor: '#1DA1F2',
                                                background: 'rgba(29, 161, 242, 0.1)'
                                            }
                                        }}
                                    >
                                        <TwitterIcon />
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            borderRadius: '50%',
                                            minWidth: 'auto',
                                            width: '50px',
                                            height: '50px',
                                            borderColor: '#0077B5',
                                            color: '#0077B5',
                                            '&:hover': {
                                                borderColor: '#0077B5',
                                                background: 'rgba(0, 119, 181, 0.1)'
                                            }
                                        }}
                                    >
                                        <LinkedInIcon />
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Contact Form */}
                    <Grid item xs={12} md={7}>
                        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                            <Typography variant="h4" gutterBottom sx={{ color: '#d81b60', fontWeight: 700, mb: 3 }}>
                                Send Us a Message
                            </Typography>

                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Your Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
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
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Email Address"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
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
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
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
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Your Message"
                                            name="message"
                                            multiline
                                            rows={4}
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
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
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            endIcon={<SendIcon />}
                                            sx={{
                                                py: 1.5,
                                                px: 4,
                                                borderRadius: 2,
                                                background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                                fontWeight: 'bold',
                                                fontSize: '1.1rem',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)',
                                                }
                                            }}
                                        >
                                            Send Message
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>

                {/* FAQ Section */}
                <Box sx={{ mt: 10 }}>
                    <Typography variant="h3" align="center" gutterBottom sx={{ color: '#d81b60', mb: 1, fontWeight: 700 }}>
                        Frequently Asked Questions
                    </Typography>
                    <Typography variant="h6" align="center" sx={{ color: '#555', maxWidth: '700px', margin: '0 auto', mb: 5 }}>
                        Find quick answers to common questions about Bandhan Match
                    </Typography>

                    <Grid container spacing={3}>
                        {faqs.map((faq, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        borderRadius: 3,
                                        boxShadow: 3,
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: 6
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" gutterBottom sx={{ color: '#d81b60', fontWeight: 600 }}>
                                            {faq.question}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#78909c' }}>
                                            {faq.answer}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Map Section */}
                <Box sx={{ mt: 10, borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.7594279868085!2d72.8282142759977!3d19.027307082188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cee1c9eb2f5d%3A0x5bdeb3dd7f14d5f1!2sBandra%20Kurla%20Complex%2C%20Bandra%20East%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1695123456789!5m2!1sen!2sin"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Bandhan Match Office Location"
                    ></iframe>
                </Box>
            </Container>
        </Box>
    );
};

export default ContactUs;