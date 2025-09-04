import React, { useState, useEffect } from 'react';
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
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { showSuccess } from '../utils/toast';
import { API_BASE_URL } from '../utils/api';

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [email, setEmail] = useState('');
    const [resetToken, setResetToken] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.email && location.state?.resetToken) {
            setEmail(location.state.email);
            setResetToken(location.state.resetToken);
        } else {
            const savedEmail = sessionStorage.getItem('resetEmail');
            const savedToken = sessionStorage.getItem('resetToken');

            if (savedEmail && savedToken) {
                setEmail(savedEmail);
                setResetToken(savedToken);
            } else {
                navigate('/login');
            }
        }
    }, [location, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setError('Password must be at least 8 characters and include one uppercase letter, one lowercase letter, one number, and one special character.');
            return;
        }
        setIsLoading(true);
        try {
            const { data } = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
                email: email,
                newPassword: formData.password,
                confirmPassword: formData.confirmPassword,
                resetToken: resetToken
            });

            if (data.success) {
                showSuccess('Password reset successfully!');
                setIsSuccess(true);
                sessionStorage.removeItem('resetEmail');
                sessionStorage.removeItem('resetToken');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
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
                                Password Reset Successful!
                            </Typography>

                            <Typography variant="body1" sx={{ color: '#78909c', mb: 4 }}>
                                Your password has been successfully reset. You will be redirected to login page shortly.
                            </Typography>

                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleBackToLogin}
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
                                    color: '#C8A2C8',
                                    fontStyle: 'italic',
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
                                helperText="Must be at least 8 characters with uppercase, lowercase, number, and special character"
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

                            <Box sx={{ textAlign: 'center' }}>
                                <Button
                                    onClick={handleBackToLogin}
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