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
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Favorite,
  Person,
  Google,
  Facebook
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const LoginPage = ({ onToggleForm }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login data:', formData);
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
                Sign In
              </Button>

              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" sx={{ color: '#78909c', cursor: 'pointer' }} onClick={() => {/* Add forgot password logic */ }}>
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
                <Link to="/register" style={{ textDecoration: 'none' }}>
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
                </Link>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Fade>
  );
};

export default LoginPage;