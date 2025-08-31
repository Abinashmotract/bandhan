import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
  Fade
} from '@mui/material';
import {
  Email,
  Visibility,
  VisibilityOff,
  Favorite
} from '@mui/icons-material';
import { Google, Facebook } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import Cookies from "js-cookie";
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';

const LoginPage = ({ onToggleForm }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // Clear error when typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(loginStart());
    try {
      const payload = {
        email: formData.email,
        password: formData.password
      };
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        payload,
        { withCredentials: true }
      );
      if (response.data.success) {
        const { accessToken, refreshToken, user } = response.data.data;
        Cookies.set("accessToken", accessToken, { expires: 1 });
        Cookies.set("refreshToken", refreshToken, { expires: 7 });
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(loginSuccess(user));
        setSubmitStatus({
          success: true,
          message: response?.message,
        });
        const redirectPath = location.state?.from?.pathname || "/";
        navigate(redirectPath);
      } else {
        dispatch(loginFailure(response.data.message));
        setSubmitStatus({
          success: false,
          message: response.data.message || "Login failed. Please try again.",
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        "Network error. Please check your connection and try again.";
      dispatch(loginFailure(errorMessage));
      setSubmitStatus({
        success: false,
        message: errorMessage,
      });
    }
  };

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
                  background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body1" sx={{ color: '#78909c' }}>
                Sign in to continue your journey to find your perfect match
              </Typography>
            </Box>

            {submitStatus.message && (
              <Alert
                severity={submitStatus.success ? "success" : "error"}
                sx={{ mb: 3 }}
              >
                {submitStatus.message}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
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
                      <Favorite sx={{ color: '#d81b60' }} />
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={submitStatus.loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(216, 27, 96, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(216, 27, 96, 0.4)',
                    background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)'
                  }
                }}
              >
                {submitStatus.loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" sx={{ color: '#78909c', cursor: 'pointer' }}>
                    Forgot your password?
                  </Typography>
                </Link>
              </Box>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: '#78909c' }}>
                  Or continue with
                </Typography>
              </Divider>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Google />}
                  sx={{
                    py: 1.5,
                    borderRadius: '12px',
                    borderColor: '#ddd',
                    color: '#5f6368',
                    '&:hover': {
                      borderColor: '#d81b60',
                      color: '#d81b60'
                    }
                  }}
                >
                  Google
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Facebook />}
                  sx={{
                    py: 1.5,
                    borderRadius: '12px',
                    borderColor: '#ddd',
                    color: '#1877f2',
                    '&:hover': {
                      borderColor: '#1877f2',
                      backgroundColor: 'rgba(24, 119, 242, 0.04)'
                    }
                  }}
                >
                  Facebook
                </Button>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#78909c' }}>
                  Don't have an account?{' '}
                  <span
                    onClick={onToggleForm}
                    style={{
                      color: '#d81b60',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Sign Up
                  </span>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Fade>
  );
};

export default LoginPage;