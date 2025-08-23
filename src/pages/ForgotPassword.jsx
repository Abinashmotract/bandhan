import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    InputAdornment,
    Fade,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Email,
    ArrowBack,
    CheckCircle
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ForgotPassword = ({ onBackToLogin, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate success
            setIsSuccess(true);

            // If you want to automatically go back to login after success
            // setTimeout(() => {
            //   onBackToLogin();
            // }, 3000);
        } catch (err) {
            setError('Failed to send reset instructions. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <Fade in={true} timeout={800}>
                <Box
                    sx={{
                        minHeight: '100vh',
                        background: 'linear-gradient(135deg, rgba(255,249,251,0.95) 0%, rgba(248,187,208,0.8) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 4,
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Container maxWidth="sm">
                        <Paper
                            elevation={10}
                            sx={{
                                p: 5,
                                borderRadius: '20px',
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                                textAlign: 'center',
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '5px',
                                    background: 'linear-gradient(90deg, #4caf50, #2e7d32)',
                                    borderRadius: '10px 10px 0 0'
                                }
                            }}
                        >
                            <CheckCircle sx={{ fontSize: 60, color: '#4caf50', mb: 2 }} />

                            <Typography variant="h4" sx={{
                                color: '#2e7d32',
                                mb: 2,
                                fontFamily: '"Playfair Display", serif'
                            }}>
                                Check Your Email
                            </Typography>

                            <Typography variant="body1" sx={{ color: '#78909c', mb: 3 }}>
                                We've sent password reset instructions to your email address.
                            </Typography>

                            <Typography variant="body2" sx={{ color: '#78909c', mb: 4 }}>
                                Didn't receive the email? Check your spam folder or{' '}
                                <span
                                    onClick={handleSubmit}
                                    style={{
                                        color: '#d81b60',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    try again
                                </span>
                            </Typography>
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={onBackToLogin}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)'
                                        }
                                    }}
                                >
                                    Back to Login
                                </Button>
                            </Link>
                        </Paper>
                    </Container>
                </Box>
            </Fade>
        );
    }

    return (
        <Fade in={true} timeout={800}>
            <Box
                sx={{
                  minHeight: '100vh',
                        background: 'linear-gradient(135deg, rgba(255,249,251,0.95) 0%, rgba(248,187,208,0.8) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            background: 'url("https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80") center/cover no-repeat',
                            opacity: 0.1,
                            zIndex: 0
                        }
                }}
            >
                <Container maxWidth="sm">
                    <Paper
                        elevation={10}
                        sx={{
                            p: 5,
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '5px',
                                background: 'linear-gradient(90deg, #d81b60, #880e4f)',
                                borderRadius: '10px 10px 0 0'
                            }
                        }}
                    >
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontFamily: '"Playfair Display", serif',
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1
                                }}
                            >
                                Reset Your Password
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#78909c' }}>
                                Enter your email and we'll send you instructions to reset your password
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                                {error}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                margin="normal"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ color: '#d81b60' }} />
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#d81b60'
                                        }
                                    }
                                }}
                            />
                            <Link to="/reset-password" style={{ textDecoration: 'none' }}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={isLoading}
                                    sx={{
                                        mt: 3,
                                        mb: 2,
                                        py: 1.5,
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        boxShadow: '0 4px 15px rgba(216, 27, 96, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)'
                                        },
                                        '&:disabled': {
                                            background: '#ccc'
                                        }
                                    }}
                                >
                                    {isLoading ? <CircularProgress size={24} /> : 'Send Reset Instructions'}
                                </Button>
                            </Link>

                            <Box sx={{ textAlign: 'center' }}>
                                <Link to="/login" style={{ textDecoration: 'none' }}>
                                    <Button
                                        onClick={onBackToLogin}
                                        startIcon={<ArrowBack />}
                                        sx={{
                                            color: '#d81b60',
                                            fontWeight: 600,
                                            '&:hover': {
                                                backgroundColor: 'rgba(216, 27, 96, 0.1)'
                                            }
                                        }}
                                    >
                                        Back to Login
                                    </Button>
                                </Link>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </Fade>
    );
};

export default ForgotPassword;