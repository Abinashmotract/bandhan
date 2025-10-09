import React, { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Alert,
    CircularProgress,
    Fade,
    TextField
} from '@mui/material';
import { Security, ArrowBack, CheckCircle, Refresh } from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { showSuccess } from '../utils/toast';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || '';

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
                email,
                otp
            });
            if (response.data.success) {
                setIsVerified(true);
                setTimeout(() => {
                    navigate('/reset-password', {
                        state: {
                            email,
                            resetToken: response.data.data?.resetToken
                        }
                    });
                }, 2000);
            } else {
                setError(response.data.message || 'Invalid OTP');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to verify OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setIsResending(true);
        setError('');
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/resend-otp`, { email });
            if (response.data.success) {
                setError('');
                alert('New OTP sent to your email');
            } else {
                setError(response.data.message || 'Failed to resend OTP');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    // Handle OTP input change
    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;

        // Update OTP value
        const newOtp = otp.split('');
        newOtp[index] = element.value;
        setOtp(newOtp.join(''));

        // Focus next input
        if (element.value !== '' && element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    // Handle key events for better UX
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !e.target.value && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    // Handle paste event
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
        if (!isNaN(pastedData)) {
            setOtp(pastedData);

            // Focus the last input after pasting
            const inputs = document.querySelectorAll('.otp-input');
            if (inputs.length > 0) {
                const focusIndex = Math.min(pastedData.length, 5);
                inputs[focusIndex].focus();
            }
        }
    };

    if (isVerified) {
        return (
            <Fade in={true} timeout={800}>
                <Box
                    sx={{
                        minHeight: '100vh',
                        background: 'linear-gradient(135deg, rgba(255,249,251,0.95) 0%, rgba(248,187,208,0.8) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 4
                    }}
                >
                    <Container maxWidth="sm">
                        <Paper
                            elevation={10}
                            sx={{
                                p: 5,
                                borderRadius: '20px',
                                background: 'rgba(255, 255, 255, 0.95)',
                                textAlign: 'center'
                            }}
                        >
                            <CheckCircle sx={{ fontSize: 60, color: '#4caf50', mb: 2 }} />
                            <Typography variant="h5" sx={{ color: '#2e7d32', mb: 2 }}>
                                OTP Verified Successfully!
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#78909c', mb: 3 }}>
                                Redirecting to password reset page...
                            </Typography>
                            <CircularProgress size={24} />
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
                    py: 4
                }}
            >
                <Container maxWidth="sm">
                    <Paper
                        elevation={10}
                        sx={{
                            p: 5,
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography variant="h4" sx={{ color: '#51365F', mb: 1, fontWeight: 600 }}>
                                Verify OTP
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#78909c' }}>
                                Enter the 6-digit OTP sent to {email}
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                                {error}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleVerifyOtp}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mb: 2,
                                    mt: 3,
                                    gap: '8px'
                                }}
                                onPaste={handlePaste}
                            >
                                {[...Array(6)].map((_, index) => (
                                    <TextField
                                        key={index}
                                        className="otp-input"
                                        value={otp[index] || ''}
                                        variant="outlined"
                                        inputProps={{
                                            maxLength: 1,
                                            style: { textAlign: 'center' }
                                        }}
                                        onChange={(e) => handleOtpChange(e.target, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        sx={{
                                            flex: 1,
                                            minWidth: 'auto',
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px',
                                                height: '50px',
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#51365F'
                                                }
                                            }
                                        }}
                                    />
                                ))}
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={isLoading || otp.length !== 6}
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    py: 1.5,
                                    borderRadius: '12px',
                                    background: '#51365F',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)'
                                    },
                                    '&:disabled': {
                                        background: '#ccc'
                                    }
                                }}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Verify OTP'}
                            </Button>

                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Button
                                    onClick={handleResendOtp}
                                    disabled={isResending}
                                    startIcon={<Refresh />}
                                    sx={{
                                        color: '#51365F',
                                        fontWeight: 600,
                                        '&:hover': {
                                            backgroundColor: 'rgba(216, 27, 96, 0.1)'
                                        }
                                    }}
                                >
                                    {isResending ? 'Sending...' : 'Resend OTP'}
                                </Button>
                            </Box>

                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                                    <Button
                                        startIcon={<ArrowBack />}
                                        sx={{
                                            color: '#51365F',
                                            fontWeight: 600,
                                            '&:hover': {
                                                backgroundColor: 'rgba(216, 27, 96, 0.1)'
                                            }
                                        }}
                                    >
                                        Back to Forgot Password
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

export default VerifyOtp;
