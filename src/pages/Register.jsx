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
  Divider,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Favorite,
  Person,
  Lock,
  Google,
  Facebook,
  Cake,
  Work,
  LocationOn
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

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
    agreeToTerms: false
  });

  const steps = ['Account Details', 'Personal Info', 'Complete'];

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Registration data:', formData);
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
            <TextField
              fullWidth
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              margin="normal"
              required
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
              sx={{ mt: 2, color: '#78909c' }}
            />
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
              Thank you for joining bandhanmatch. Your journey to find your perfect partner begins now.
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
          // minHeight: '100vh',
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
            background: 'url("https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80") center/cover no-repeat',
            opacity: 0.1,
            zIndex: 0
          }
        }}
      >
        <Container maxWidth="md">
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

            <Box component="form" onSubmit={handleSubmit}>
              {getStepContent(activeStep)}

              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                {activeStep !== 0 && (
                  <Button
                    onClick={handleBack}
                    sx={{
                      mr: 1,
                      color: '#d81b60',
                      borderRadius: '8px',
                      px: 3
                    }}
                  >
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
                    sx={{
                      borderRadius: '8px',
                      px: 4,
                      background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)'
                      }
                    }}
                  >
                    Complete Registration
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
                      Already have an account?{' '}
                      <Link to="/login" style={{ textDecoration: 'none' }}>
                        <span
                          onClick={onToggleForm}
                          style={{
                            color: '#d81b60',
                            cursor: 'pointer',
                            fontWeight: 600
                          }}
                        >
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