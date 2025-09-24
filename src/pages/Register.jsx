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
    CircularProgress,
    Chip,
    Autocomplete
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
    Facebook,
    School,
    Scale,
    FitnessCenter,
    Palette,
    FamilyRestroom,
    AccountBalance
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/api';
import axios from 'axios';

// Import all the options
import {
    PROFILE_FOR_OPTIONS,
    GENDER_OPTIONS,
    RELIGION_OPTIONS,
    MARITAL_STATUS_OPTIONS,
    EDUCATION_OPTIONS,
    OCCUPATION_OPTIONS,
    INDUSTRY_OPTIONS,
    ANNUAL_INCOME_OPTIONS,
    DIET_OPTIONS,
    DRINKING_HABITS_OPTIONS,
    SMOKING_HABITS_OPTIONS,
    FAMILY_TYPE_OPTIONS,
    FAMILY_STATUS_OPTIONS,
    LANGUAGE_OPTIONS,
    STATE_OPTIONS
} from '../utils/options/generalOptions';

const Register = ({ onToggleForm }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        // Basic Info
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobile: '',
        profileFor: 'self',
        gender: '',

        // Personal Details
        dob: '',
        religion: '',
        caste: '',
        subCaste: '',
        motherTongue: [],
        maritalStatus: '',

        // Education & Career
        highestQualification: '',
        fieldOfStudy: '',
        education: '',
        occupation: '',
        industry: '',
        annualIncome: '',

        // Physical Attributes
        height: '',
        weight: '',
        bodyType: '',
        complexion: '',

        // Lifestyle
        diet: '',
        drinkingHabits: '',
        smokingHabits: '',
        fitnessLevel: '',
        hobbies: [],
        interests: [],
        languagesKnown: [],
        petPreferences: '',

        // Family Details
        fatherOccupation: '',
        motherOccupation: '',
        brothers: 0,
        brothersMarried: 0,
        sisters: 0,
        sistersMarried: 0,
        familyType: '',
        familyIncome: '',
        nativePlace: '',
        familyStatus: '',

        // Location
        state: '',
        city: '',
        location: '',

        // Preferences
        preferences: {
            ageRange: { min: 25, max: 30 },
            heightRange: { min: "5ft", max: "6ft" },
            qualities: [],
            dealBreakers: [],
            educationPref: '',
            occupationPref: [],
            annualIncomePref: '',
            lifestyleExpectations: { diet: '', drinking: '', smoking: '' },
            religionCastePref: '',
            locationPref: '',
            relocation: '',
            familyOrientation: '',
            maritalStatusPref: ''
        },

        // Additional Info
        about: '',
        photos: [],
        profileImage: '',

        agreeToTerms: false
    });
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState({});

    const navigate = useNavigate();

    const steps = ['Account Details', 'Personal Info', 'Family & Lifestyle', 'Preferences', 'Complete'];

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

    const handleArrayChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleNestedChange = (parent, field, value) => {
        setFormData({
            ...formData,
            [parent]: {
                ...formData[parent],
                [field]: value
            }
        });
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
            if (!formData.religion) newErrors.religion = 'Religion is required';
            if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
            if (!formData.occupation) newErrors.occupation = 'Occupation is required';
            if (!formData.location) newErrors.location = 'Location is required';
        }
        if (step === 2) {
            if (!formData.familyType) newErrors.familyType = 'Family type is required';
            if (!formData.familyStatus) newErrors.familyStatus = 'Family status is required';
        }
        if (step === 3) {
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
        // if (!validateStep(activeStep)) return;
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
                                    '&.Mui-focused fieldset': { borderColor: '#d81b60' }
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
                                    '&.Mui-focused fieldset': { borderColor: '#d81b60' }
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
                                    '&.Mui-focused fieldset': { borderColor: '#d81b60' }
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
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&.Mui-focused fieldset': { borderColor: '#d81b60' }
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
                                sx={{ borderRadius: '12px', '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#d81b60' } }}
                            >
                                {PROFILE_FOR_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                            {errors.profileFor && <Typography variant="caption" color="error">{errors.profileFor}</Typography>}
                        </FormControl>

                        {(formData.profileFor === 'self' || formData.profileFor === 'relative' || formData.profileFor === 'friend') && (
                            <FormControl fullWidth margin="normal" required error={!!errors.gender}>
                                <InputLabel>Gender</InputLabel>
                                <Select name="gender" value={formData.gender} onChange={handleChange} label="Gender">
                                    {GENDER_OPTIONS.map(option => (
                                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                    ))}
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
                                '& .MuiOutlinedInput-root': { borderRadius: '12px', '&.Mui-focused fieldset': { borderColor: '#d81b60' } }
                            }}
                        />

                        <FormControl fullWidth margin="normal" required error={!!errors.religion}>
                            <InputLabel>Religion</InputLabel>
                            <Select name="religion" value={formData.religion} onChange={handleChange} label="Religion">
                                {RELIGION_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                            {errors.religion && <Typography variant="caption" color="error">{errors.religion}</Typography>}
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Caste"
                            name="caste"
                            value={formData.caste}
                            onChange={handleChange}
                            margin="normal"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FamilyRestroom sx={{ color: '#d81b60' }} />
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
                            label="Sub Caste"
                            name="subCaste"
                            value={formData.subCaste}
                            onChange={handleChange}
                            margin="normal"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FamilyRestroom sx={{ color: '#d81b60' }} />
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

                        <FormControl fullWidth margin="normal" required error={!!errors.maritalStatus}>
                            <InputLabel>Marital Status</InputLabel>
                            <Select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} label="Marital Status">
                                {MARITAL_STATUS_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                            {errors.maritalStatus && <Typography variant="caption" color="error">{errors.maritalStatus}</Typography>}
                        </FormControl>

                        <Autocomplete
                            multiple
                            options={LANGUAGE_OPTIONS}
                            getOptionLabel={(option) => option.label}
                            value={formData.motherTongue.map(lang => LANGUAGE_OPTIONS.find(opt => opt.value === lang) || { value: lang, label: lang })}
                            onChange={(event, newValue) => {
                                handleArrayChange('motherTongue', newValue.map(item => item.value));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Mother Tongue"
                                    margin="normal"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                <InputAdornment position="start">
                                                    <AccountBalance sx={{ color: '#d81b60' }} />
                                                </InputAdornment>
                                                {params.InputProps.startAdornment}
                                            </>
                                        )
                                    }}
                                />
                            )}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        label={option.label}
                                        {...getTagProps({ index })}
                                        sx={{ backgroundColor: '#f8bbd0', color: '#880e4f' }}
                                    />
                                ))
                            }
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#d81b60'
                                    }
                                }
                            }}
                        />

                        <FormControl fullWidth margin="normal" required error={!!errors.occupation}>
                            <InputLabel>Occupation</InputLabel>
                            <Select name="occupation" value={formData.occupation} onChange={handleChange} label="Occupation">
                                {OCCUPATION_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                            {errors.occupation && <Typography variant="caption" color="error">{errors.occupation}</Typography>}
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Industry</InputLabel>
                            <Select name="industry" value={formData.industry} onChange={handleChange} label="Industry">
                                {INDUSTRY_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Annual Income</InputLabel>
                            <Select name="annualIncome" value={formData.annualIncome} onChange={handleChange} label="Annual Income">
                                {ANNUAL_INCOME_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Education"
                            name="education"
                            value={formData.education}
                            onChange={handleChange}
                            margin="normal"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <School sx={{ color: '#d81b60' }} />
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
                            label="Field of Study"
                            name="fieldOfStudy"
                            value={formData.fieldOfStudy}
                            onChange={handleChange}
                            margin="normal"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <School sx={{ color: '#d81b60' }} />
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

                        <FormControl fullWidth margin="normal" required error={!!errors.location}>
                            <InputLabel>State</InputLabel>
                            <Select name="state" value={formData.state} onChange={handleChange} label="State">
                                {STATE_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                            {errors.state && <Typography variant="caption" color="error">{errors.state}</Typography>}
                        </FormControl>

                        <TextField
                            fullWidth
                            label="City"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            margin="normal"
                            required
                            error={!!errors.city}
                            helperText={errors.city}
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
                    </>
                );
            case 2:
                return (
                    <>
                        <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#d81b60' }}>
                            Physical Attributes
                        </Typography>

                        <TextField
                            fullWidth
                            label="Height"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            margin="normal"
                            placeholder="e.g., 5ft 8in"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Scale sx={{ color: '#d81b60' }} />
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
                            label="Weight"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            margin="normal"
                            placeholder="e.g., 70kg"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FitnessCenter sx={{ color: '#d81b60' }} />
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
                            label="Body Type"
                            name="bodyType"
                            value={formData.bodyType}
                            onChange={handleChange}
                            margin="normal"
                            placeholder="e.g., Athletic"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FitnessCenter sx={{ color: '#d81b60' }} />
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
                            label="Complexion"
                            name="complexion"
                            value={formData.complexion}
                            onChange={handleChange}
                            margin="normal"
                            placeholder="e.g., Fair"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Palette sx={{ color: '#d81b60' }} />
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

                        <Typography variant="h6" sx={{ mt: 3, mb: 1, color: '#d81b60' }}>
                            Lifestyle
                        </Typography>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Diet</InputLabel>
                            <Select name="diet" value={formData.diet} onChange={handleChange} label="Diet">
                                {DIET_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Drinking Habits</InputLabel>
                            <Select name="drinkingHabits" value={formData.drinkingHabits} onChange={handleChange} label="Drinking Habits">
                                {DRINKING_HABITS_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Smoking Habits</InputLabel>
                            <Select name="smokingHabits" value={formData.smokingHabits} onChange={handleChange} label="Smoking Habits">
                                {SMOKING_HABITS_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Fitness Level"
                            name="fitnessLevel"
                            value={formData.fitnessLevel}
                            onChange={handleChange}
                            margin="normal"
                            placeholder="e.g., Sports Enthusiast"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FitnessCenter sx={{ color: '#d81b60' }} />
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

                        <Autocomplete
                            multiple
                            freeSolo
                            options={[]}
                            value={formData.hobbies}
                            onChange={(event, newValue) => {
                                handleArrayChange('hobbies', newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Hobbies"
                                    margin="normal"
                                />
                            )}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        label={option}
                                        {...getTagProps({ index })}
                                        sx={{ backgroundColor: '#f8bbd0', color: '#880e4f' }}
                                    />
                                ))
                            }
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#d81b60'
                                    }
                                }
                            }}
                        />

                        <Autocomplete
                            multiple
                            freeSolo
                            options={[]}
                            value={formData.interests}
                            onChange={(event, newValue) => {
                                handleArrayChange('interests', newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Interests"
                                    margin="normal"
                                />
                            )}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        label={option}
                                        {...getTagProps({ index })}
                                        sx={{ backgroundColor: '#f8bbd0', color: '#880e4f' }}
                                    />
                                ))
                            }
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#d81b60'
                                    }
                                }
                            }}
                        />

                        <Autocomplete
                            multiple
                            options={LANGUAGE_OPTIONS}
                            getOptionLabel={(option) => option.label}
                            value={formData.languagesKnown.map(lang => LANGUAGE_OPTIONS.find(opt => opt.value === lang) || { value: lang, label: lang })}
                            onChange={(event, newValue) => {
                                handleArrayChange('languagesKnown', newValue.map(item => item.value));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Languages Known"
                                    margin="normal"
                                />
                            )}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        label={option.label}
                                        {...getTagProps({ index })}
                                        sx={{ backgroundColor: '#f8bbd0', color: '#880e4f' }}
                                    />
                                ))
                            }
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
                            label="Pet Preferences"
                            name="petPreferences"
                            value={formData.petPreferences}
                            onChange={handleChange}
                            margin="normal"
                            placeholder="e.g., Like Pets"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#d81b60'
                                    }
                                }
                            }}
                        />

                        <Typography variant="h6" sx={{ mt: 3, mb: 1, color: '#d81b60' }}>
                            Family Details
                        </Typography>

                        <TextField
                            fullWidth
                            label="Father's Occupation"
                            name="fatherOccupation"
                            value={formData.fatherOccupation}
                            onChange={handleChange}
                            margin="normal"
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
                            label="Mother's Occupation"
                            name="motherOccupation"
                            value={formData.motherOccupation}
                            onChange={handleChange}
                            margin="normal"
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
                            label="Number of Brothers"
                            name="brothers"
                            type="number"
                            value={formData.brothers}
                            onChange={handleChange}
                            margin="normal"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FamilyRestroom sx={{ color: '#d81b60' }} />
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
                            label="Number of Brothers Married"
                            name="brothersMarried"
                            type="number"
                            value={formData.brothersMarried}
                            onChange={handleChange}
                            margin="normal"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FamilyRestroom sx={{ color: '#d81b60' }} />
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
                            label="Number of Sisters"
                            name="sisters"
                            type="number"
                            value={formData.sisters}
                            onChange={handleChange}
                            margin="normal"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FamilyRestroom sx={{ color: '#d81b60' }} />
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
                            label="Number of Sisters Married"
                            name="sistersMarried"
                            type="number"
                            value={formData.sistersMarried}
                            onChange={handleChange}
                            margin="normal"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FamilyRestroom sx={{ color: '#d81b60' }} />
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

                        <FormControl fullWidth margin="normal" required error={!!errors.familyType}>
                            <InputLabel>Family Type</InputLabel>
                            <Select name="familyType" value={formData.familyType} onChange={handleChange} label="Family Type">
                                {FAMILY_TYPE_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                            {errors.familyType && <Typography variant="caption" color="error">{errors.familyType}</Typography>}
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Family Income</InputLabel>
                            <Select name="familyIncome" value={formData.familyIncome} onChange={handleChange} label="Family Income">
                                {ANNUAL_INCOME_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Native Place"
                            name="nativePlace"
                            value={formData.nativePlace}
                            onChange={handleChange}
                            margin="normal"
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

                        <FormControl fullWidth margin="normal" required error={!!errors.familyStatus}>
                            <InputLabel>Family Status</InputLabel>
                            <Select name="familyStatus" value={formData.familyStatus} onChange={handleChange} label="Family Status">
                                {FAMILY_STATUS_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                            {errors.familyStatus && <Typography variant="caption" color="error">{errors.familyStatus}</Typography>}
                        </FormControl>

                        <TextField
                            fullWidth
                            label="About Yourself"
                            name="about"
                            value={formData.about}
                            onChange={handleChange}
                            margin="normal"
                            multiline
                            rows={4}
                            placeholder="Tell us about yourself, your interests, and what you're looking for in a partner..."
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
            case 3:
                return (
                    <>
                        <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#d81b60' }}>
                            Partner Preferences
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Min Age"
                                name="minAge"
                                type="number"
                                value={formData.preferences.ageRange.min}
                                onChange={(e) => handleNestedChange('preferences', 'ageRange', { ...formData.preferences.ageRange, min: parseInt(e.target.value) })}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Max Age"
                                name="maxAge"
                                type="number"
                                value={formData.preferences.ageRange.max}
                                onChange={(e) => handleNestedChange('preferences', 'ageRange', { ...formData.preferences.ageRange, max: parseInt(e.target.value) })}
                                margin="normal"
                            />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <TextField
                                fullWidth
                                label="Min Height"
                                name="minHeight"
                                value={formData.preferences.heightRange.min}
                                onChange={(e) => handleNestedChange('preferences', 'heightRange', { ...formData.preferences.heightRange, min: e.target.value })}
                                margin="normal"
                                placeholder="e.g., 5ft"
                            />
                            <TextField
                                fullWidth
                                label="Max Height"
                                name="maxHeight"
                                value={formData.preferences.heightRange.max}
                                onChange={(e) => handleNestedChange('preferences', 'heightRange', { ...formData.preferences.heightRange, max: e.target.value })}
                                margin="normal"
                                placeholder="e.g., 6ft"
                            />
                        </Box>

                        <Autocomplete
                            multiple
                            freeSolo
                            options={[]}
                            value={formData.preferences.qualities}
                            onChange={(event, newValue) => {
                                handleNestedChange('preferences', 'qualities', newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Desired Qualities"
                                    margin="normal"
                                />
                            )}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        label={option}
                                        {...getTagProps({ index })}
                                        sx={{ backgroundColor: '#f8bbd0', color: '#880e4f' }}
                                    />
                                ))
                            }
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#d81b60'
                                    }
                                }
                            }}
                        />

                        <Autocomplete
                            multiple
                            freeSolo
                            options={[]}
                            value={formData.preferences.dealBreakers}
                            onChange={(event, newValue) => {
                                handleNestedChange('preferences', 'dealBreakers', newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Deal Breakers"
                                    margin="normal"
                                />
                            )}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        label={option}
                                        {...getTagProps({ index })}
                                        sx={{ backgroundColor: '#f8bbd0', color: '#880e4f' }}
                                    />
                                ))
                            }
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#d81b60'
                                    }
                                }
                            }}
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Education Preference</InputLabel>
                            <Select
                                name="educationPref"
                                value={formData.preferences.educationPref}
                                onChange={(e) => handleNestedChange('preferences', 'educationPref', e.target.value)}
                                label="Education Preference"
                            >
                                {EDUCATION_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Autocomplete
                            multiple
                            options={OCCUPATION_OPTIONS}
                            getOptionLabel={(option) => option.label}
                            value={formData.preferences.occupationPref.map(occ => OCCUPATION_OPTIONS.find(opt => opt.value === occ) || { value: occ, label: occ })}
                            onChange={(event, newValue) => {
                                handleNestedChange('preferences', 'occupationPref', newValue.map(item => item.value));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Occupation Preference"
                                    margin="normal"
                                />
                            )}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        label={option.label}
                                        {...getTagProps({ index })}
                                        sx={{ backgroundColor: '#f8bbd0', color: '#880e4f' }}
                                    />
                                ))
                            }
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#d81b60'
                                    }
                                }
                            }}
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Annual Income Preference</InputLabel>
                            <Select
                                name="annualIncomePref"
                                value={formData.preferences.annualIncomePref}
                                onChange={(e) => handleNestedChange('preferences', 'annualIncomePref', e.target.value)}
                                label="Annual Income Preference"
                            >
                                {ANNUAL_INCOME_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, color: '#d81b60' }}>
                            Lifestyle Expectations
                        </Typography>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Diet Preference</InputLabel>
                            <Select
                                name="dietPref"
                                value={formData.preferences.lifestyleExpectations.diet}
                                onChange={(e) => handleNestedChange('preferences', 'lifestyleExpectations', { ...formData.preferences.lifestyleExpectations, diet: e.target.value })}
                                label="Diet Preference"
                            >
                                {DIET_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Drinking Preference</InputLabel>
                            <Select
                                name="drinkingPref"
                                value={formData.preferences.lifestyleExpectations.drinking}
                                onChange={(e) => handleNestedChange('preferences', 'lifestyleExpectations', { ...formData.preferences.lifestyleExpectations, drinking: e.target.value })}
                                label="Drinking Preference"
                            >
                                {DRINKING_HABITS_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Smoking Preference</InputLabel>
                            <Select
                                name="smokingPref"
                                value={formData.preferences.lifestyleExpectations.smoking}
                                onChange={(e) => handleNestedChange('preferences', 'lifestyleExpectations', { ...formData.preferences.lifestyleExpectations, smoking: e.target.value })}
                                label="Smoking Preference"
                            >
                                {SMOKING_HABITS_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Religion/Caste Preference</InputLabel>
                            <Select
                                name="religionCastePref"
                                value={formData.preferences.religionCastePref}
                                onChange={(e) => handleNestedChange('preferences', 'religionCastePref', e.target.value)}
                                label="Religion/Caste Preference"
                            >
                                <MenuItem value="same_religion">Same Religion</MenuItem>
                                <MenuItem value="same_caste">Same Caste</MenuItem>
                                <MenuItem value="doesnt_matter">Doesn't Matter</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Location Preference</InputLabel>
                            <Select
                                name="locationPref"
                                value={formData.preferences.locationPref}
                                onChange={(e) => handleNestedChange('preferences', 'locationPref', e.target.value)}
                                label="Location Preference"
                            >
                                <MenuItem value="same_city">Same City</MenuItem>
                                <MenuItem value="same_state">Same State</MenuItem>
                                <MenuItem value="anywhere_india">Anywhere in India</MenuItem>
                                <MenuItem value="doesnt_matter">Doesn't Matter</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Willing to Relocate</InputLabel>
                            <Select
                                name="relocation"
                                value={formData.preferences.relocation}
                                onChange={(e) => handleNestedChange('preferences', 'relocation', e.target.value)}
                                label="Willing to Relocate"
                            >
                                <MenuItem value="yes">Yes</MenuItem>
                                <MenuItem value="no">No</MenuItem>
                                <MenuItem value="maybe">Maybe</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Family Orientation</InputLabel>
                            <Select
                                name="familyOrientation"
                                value={formData.preferences.familyOrientation}
                                onChange={(e) => handleNestedChange('preferences', 'familyOrientation', e.target.value)}
                                label="Family Orientation"
                            >
                                <MenuItem value="traditional">Traditional</MenuItem>
                                <MenuItem value="modern">Modern</MenuItem>
                                <MenuItem value="flexible">Flexible</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Marital Status Preference</InputLabel>
                            <Select
                                name="maritalStatusPref"
                                value={formData.preferences.maritalStatusPref}
                                onChange={(e) => handleNestedChange('preferences', 'maritalStatusPref', e.target.value)}
                                label="Marital Status Preference"
                            >
                                {MARITAL_STATUS_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                    sx={{ color: '#d81b60', '&.Mui-checked': { color: '#d81b60' } }}
                                />
                            }
                            label="I agree to the Terms and Conditions"
                            sx={{ mt: 2, color: errors.agreeToTerms ? 'error.main' : '#78909c' }}
                        />
                        {errors.agreeToTerms && <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>{errors.agreeToTerms}</Typography>}
                    </>
                );
            case 4:
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
                            <Typography variant="h3" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: '#C8A2C8', fontStyle: 'italic', mb: 1 }}>
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
                                    <Button
                                        onClick={handleBack}
                                        sx={{ mr: 1, color: '#d81b60', borderRadius: '8px', px: 3 }}
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
                                                background:
                                                    'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)',
                                            },
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
                                                background:
                                                    'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)',
                                            },
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
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