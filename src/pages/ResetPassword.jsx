import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    InputAdornment,
    IconButton,
    Fade,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Lock,
    ArrowBack,
    CheckCircle
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ResetPassword = ({ onBackToLogin, token }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password strength
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate success
            setIsSuccess(true);
        } catch (err) {
            setError('Failed to reset password. Please try again.');
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
                                Password Reset
                            </Typography>

                            <Typography variant="body1" sx={{ color: '#78909c', mb: 4 }}>
                                Your password has been successfully reset. You can now login with your new password.
                            </Typography>

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
                                Continue to Login
                            </Button>
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
                                Create New Password
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#78909c' }}>
                                Please enter your new password below
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
                                label="New Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                margin="normal"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: '#d81b60' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
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
                                helperText="Must be at least 8 characters long"
                            />

                            <TextField
                                fullWidth
                                label="Confirm New Password"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                margin="normal"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: '#d81b60' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
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
                            <Link to="/login" style={{ textDecoration: 'none' }}>
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
                                    {isLoading ? <CircularProgress size={24} /> : 'Reset Password'}
                                </Button>
                            </Link>
                            <Box sx={{ textAlign: 'center' }}>
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
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </Fade>
    );
};

export default ResetPassword;