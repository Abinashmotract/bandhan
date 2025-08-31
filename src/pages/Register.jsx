import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Paper,
    InputAdornment,
    IconButton,
    FormControlLabel,
    Checkbox,
    Divider,
    Stepper,
    Step,
    StepLabel,
    Fade,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Person,
    Email,
    Lock,
    Visibility,
    VisibilityOff,
    Cake,
    Work,
    LocationOn,
    Favorite,
    Phone,
    Google,
    Facebook
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/api';
import axios from 'axios';

const Register = ({ onToggleForm }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        dob: '',
        occupation: '',
        location: '',
        gender: '',
        profileFor: 'self',
        mobile: '',
        agreeToTerms: false
    });
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState({});

    const navigate = useNavigate();

    const steps = ['Account Details', 'Personal Info', 'Complete'];

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 0) {
            if (!formData.name) newErrors.name = 'Name is required';
            if (!formData.email) newErrors.email = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
            if (!formData.password) newErrors.password = 'Password is required';
            else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
            if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
            else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
            if (!formData.mobile) newErrors.mobile = 'Mobile number is required';
        }
        if (step === 1) {
            if (!formData.dob) newErrors.dob = 'Date of birth is required';
            if (!formData.gender) newErrors.gender = 'Gender is required';
            if (!formData.occupation) newErrors.occupation = 'Occupation is required';
            if (!formData.location) newErrors.location = 'Location is required';
            if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (formData.profileFor !== 'self' && formData.profileFor !== 'relative' && formData.profileFor !== 'friend') {
            const autoGender =
                formData.profileFor === 'son' || formData.profileFor === 'brother' ? 'male' :
                    formData.profileFor === 'daughter' || formData.profileFor === 'sister' ? 'female' : '';

            setFormData(prev => ({
                ...prev,
                gender: autoGender
            }));
        }
    }, [formData.profileFor]);

    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep(activeStep)) return;
        setSubmitStatus({ loading: true, message: "" });
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/signup`, formData);
            if (response.data.success) {
                setSubmitStatus({
                    loading: false,
                    success: true,
                    message: response?.message || "Registration successful! Redirecting to login...",
                });
                navigate("/login");
            } else {
                setSubmitStatus({
                    loading: false,
                    success: false,
                    message: response.message || "Registration failed. Please try again.",
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            setSubmitStatus({
                loading: false,
                success: false,
                message: error.response?.data?.message || "Network error. Please check your connection and try again.",
            });
        }
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <>
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            margin="normal"
                            required
                            error={!!errors.name}
                            helperText={errors.name}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person sx={{ color: '#d81b60' }} />
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

                        <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            margin="normal"
                            required
                            error={!!errors.email}
                            helperText={errors.email}
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

                        <TextField
                            fullWidth
                            label="Mobile No."
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            margin="normal"
                            required
                            error={!!errors.mobile}
                            helperText={errors.mobile}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone sx={{ color: '#d81b60' }} />
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

                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            margin="normal"
                            required
                            error={!!errors.password}
                            helperText={errors.password}
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
                        />

                        <TextField
                            fullWidth
                            label="Confirm Password"
                            name="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            margin="normal"
                            required
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: '#d81b60' }} />
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
                    </>
                );
            case 1:
                return (
                    <>
                        <FormControl fullWidth margin="normal" required error={!!errors.profileFor}>
                            <InputLabel>Create Profile For</InputLabel>
                            <Select
                                name="profileFor"
                                value={formData.profileFor}
                                onChange={handleChange}
                                label="Create Profile For"
                                sx={{
                                    borderRadius: '12px',
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#d81b60'
                                    }
                                }}
                            >
                                <MenuItem value="self">Self</MenuItem>
                                <MenuItem value="son">Son</MenuItem>
                                <MenuItem value="daughter">Daughter</MenuItem>
                                <MenuItem value="brother">Brother</MenuItem>
                                <MenuItem value="sister">Sister</MenuItem>
                                <MenuItem value="relative">Relative</MenuItem>
                                <MenuItem value="friend">Friend</MenuItem>
                            </Select>
                            {errors.profileFor && <Typography variant="caption" color="error">{errors.profileFor}</Typography>}
                        </FormControl>

                        {(formData.profileFor === 'self' || formData.profileFor === 'relative' || formData.profileFor === 'friend') && (
                            <FormControl fullWidth margin="normal" required error={!!errors.gender}>
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    label="Gender"
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                                {errors.gender && <Typography variant="caption" color="error">{errors.gender}</Typography>}
                            </FormControl>
                        )}

                        <TextField
                            fullWidth
                            label="Date of Birth"
                            name="dob"
                            type="date"
                            value={formData.dob}
                            onChange={handleChange}
                            margin="normal"
                            required
                            error={!!errors.dob}
                            helperText={errors.dob}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Cake sx={{ color: '#d81b60' }} />
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

                        <TextField
                            fullWidth
                            label="Occupation"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                            margin="normal"
                            required
                            error={!!errors.occupation}
                            helperText={errors.occupation}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Work sx={{ color: '#d81b60' }} />
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

                        <TextField
                            fullWidth
                            label="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            margin="normal"
                            required
                            error={!!errors.location}
                            helperText={errors.location}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LocationOn sx={{ color: '#d81b60' }} />
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

                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                    sx={{
                                        color: '#d81b60',
                                        '&.Mui-checked': {
                                            color: '#d81b60'
                                        }
                                    }}
                                />
                            }
                            label="I agree to the Terms and Conditions"
                            sx={{ mt: 2, color: errors.agreeToTerms ? 'error.main' : '#78909c' }}
                        />
                        {errors.agreeToTerms && <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>{errors.agreeToTerms}</Typography>}
                    </>
                );
            case 2:
                return (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Favorite sx={{ fontSize: 60, color: '#d81b60', mb: 2 }} />
                        <Typography variant="h5" sx={{ color: '#d81b60', mb: 2 }}>
                            Registration Complete!
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#78909c' }}>
                            Thank you for joining Bandhan Nammatch. Your journey to find your perfect partner begins now.
                        </Typography>
                    </Box>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <Fade in={true} timeout={800}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    py: 6,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        width: '100%',
                        opacity: 0.1,
                        zIndex: 0
                    }
                }}
            >
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <Paper
                        elevation={10}
                        sx={{
                            p: 5,
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.5)',
                            overflow: 'hidden',
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
                                Begin Your Journey
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#78909c' }}>
                                Create your account to find your perfect life partner
                            </Typography>
                        </Box>

                        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        {submitStatus.message && (
                            <Alert
                                severity={submitStatus.success ? "success" : "error"}
                                sx={{ mb: 3 }}
                            >
                                {submitStatus.message}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit}>
                            {getStepContent(activeStep)}

                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                {activeStep !== 0 && (
                                    <Button onClick={handleBack} sx={{ mr: 1, color: '#d81b60', borderRadius: '8px', px: 3 }}>
                                        Back
                                    </Button>
                                )}
                                <Box sx={{ flex: '1 1 auto' }} />
                                {activeStep < steps.length - 1 ? (
                                    <Button
                                        onClick={handleNext}
                                        variant="contained"
                                        sx={{
                                            borderRadius: '8px',
                                            px: 4,
                                            background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)'
                                            }
                                        }}
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={submitStatus.loading}
                                        sx={{
                                            borderRadius: '8px',
                                            px: 4,
                                            background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)'
                                            },
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5
                                        }}
                                    >
                                        {submitStatus.loading ? (
                                            <>
                                                <CircularProgress size={20} sx={{ color: 'white' }} />
                                                Processing...
                                            </>
                                        ) : (
                                            'Complete Registration'
                                        )}
                                    </Button>
                                )}
                            </Box>

                            {activeStep === 0 && (
                                <>
                                    <Divider sx={{ my: 3 }}>
                                        <Typography variant="body2" sx={{ color: '#78909c' }}>
                                            Or sign up with
                                        </Typography>
                                    </Divider>

                                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            startIcon={<Google />}
                                            sx={{ py: 1.5, borderRadius: '12px', borderColor: '#ddd', color: '#5f6368', '&:hover': { borderColor: '#d81b60', color: '#d81b60' } }}
                                        >
                                            Google
                                        </Button>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            startIcon={<Facebook />}
                                            sx={{ py: 1.5, borderRadius: '12px', borderColor: '#ddd', color: '#1877f2', '&:hover': { borderColor: '#1877f2', backgroundColor: 'rgba(24, 119, 242, 0.04)' } }}
                                        >
                                            Facebook
                                        </Button>
                                    </Box>

                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="body2" sx={{ color: '#78909c' }}>
                                            Already have an account?{' '}
                                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                                <span onClick={onToggleForm} style={{ color: '#d81b60', cursor: 'pointer', fontWeight: 600 }}>
                                                    Sign In
                                                </span>
                                            </Link>
                                        </Typography>
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </Fade>
    );
};

export default Register;