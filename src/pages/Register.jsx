import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Autocomplete,
  Grid,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { showSuccess, showError } from "../utils/toast";
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
  AccountBalance,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import axios from "axios";
import axiosInstance from "../utils/axiosInterceptor";

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
  STATE_OPTIONS,
} from "../utils/options/generalOptions";

// Import comprehensive options for dependent dropdowns
import {
  COMPREHENSIVE_INDUSTRY_OPTIONS,
  HEIGHT_OPTIONS,
  BODY_TYPE_OPTIONS,
  COMPLEXION_OPTIONS,
  FITNESS_LEVEL_OPTIONS,
  FATHER_OCCUPATION_OPTIONS,
  MOTHER_OCCUPATION_OPTIONS,
  FAMILY_INCOME_OPTIONS,
  AGE_OPTIONS,
  PARTNER_HEIGHT_OPTIONS,
  getCasteOptions,
  getSubCasteOptions,
  getFieldOfStudyOptions,
  getCityOptions,
} from "../utils/options/comprehensiveOptions";

// Define reasonable options for Autocomplete components
const HOBBIES_OPTIONS = [
  { value: "reading", label: "Reading" },
  { value: "traveling", label: "Traveling" },
  { value: "cooking", label: "Cooking" },
  { value: "photography", label: "Photography" },
  { value: "music", label: "Music" },
  { value: "dancing", label: "Dancing" },
  { value: "painting", label: "Painting" },
  { value: "gardening", label: "Gardening" },
  { value: "sports", label: "Sports" },
  { value: "yoga", label: "Yoga" },
  { value: "writing", label: "Writing" },
  { value: "movies", label: "Movies" },
  { value: "fitness", label: "Fitness" },
  { value: "technology", label: "Technology" },
  { value: "volunteering", label: "Volunteering" },
];

const INTERESTS_OPTIONS = [
  { value: "technology", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "science", label: "Science" },
  { value: "arts", label: "Arts" },
  { value: "culture", label: "Culture" },
  { value: "politics", label: "Politics" },
  { value: "environment", label: "Environment" },
  { value: "health", label: "Health & Wellness" },
  { value: "fashion", label: "Fashion" },
  { value: "food", label: "Food & Cuisine" },
  { value: "history", label: "History" },
  { value: "spirituality", label: "Spirituality" },
  { value: "adventure", label: "Adventure" },
  { value: "education", label: "Education" },
  { value: "entrepreneurship", label: "Entrepreneurship" },
];

const QUALITIES_OPTIONS = [
  { value: "honest", label: "Honest" },
  { value: "caring", label: "Caring" },
  { value: "ambitious", label: "Ambitious" },
  { value: "family_oriented", label: "Family Oriented" },
  { value: "good_sense_of_humor", label: "Good Sense of Humor" },
  { value: "good_listener", label: "Good Listener" },
  { value: "empathetic", label: "Empathetic" },
  { value: "responsible", label: "Responsible" },
  { value: "confident", label: "Confident" },
  { value: "patient", label: "Patient" },
  { value: "understanding", label: "Understanding" },
  { value: "supportive", label: "Supportive" },
  { value: "romantic", label: "Romantic" },
  { value: "intelligent", label: "Intelligent" },
  { value: "independent", label: "Independent" },
];

const DEAL_BREAKERS_OPTIONS = [
  { value: "smoking", label: "Smoking" },
  { value: "excessive_drinking", label: "Excessive Drinking" },
  { value: "drug_use", label: "Drug Use" },
  { value: "financial_irresponsibility", label: "Financial Irresponsibility" },
  { value: "dishonesty", label: "Dishonesty" },
  { value: "temper_issues", label: "Temper Issues" },
  { value: "unwilling_to_work", label: "Unwilling to Work" },
  { value: "different_religion", label: "Different Religion" },
  { value: "different_lifestyle", label: "Different Lifestyle" },
  { value: "no_family_values", label: "No Family Values" },
  { value: "controlling_behavior", label: "Controlling Behavior" },
  { value: "lack_of_ambition", label: "Lack of Ambition" },
  { value: "poor_hygiene", label: "Poor Hygiene" },
  { value: "different_goals", label: "Different Life Goals" },
  { value: "unwilling_to_compromise", label: "Unwilling to Compromise" },
];

const PET_PREFERENCES_OPTIONS = [
  { value: "love_pets", label: "Love Pets" },
  { value: "have_pets", label: "Have Pets" },
  { value: "want_pets", label: "Want Pets in Future" },
  { value: "allergic_to_pets", label: "Allergic to Pets" },
  { value: "prefer_no_pets", label: "Prefer No Pets" },
  { value: "dogs_only", label: "Like Dogs Only" },
  { value: "cats_only", label: "Like Cats Only" },
  { value: "small_pets", label: "Like Small Pets" },
  { value: "no_preference", label: "No Preference" },
];

const FAMILY_MEMBER_COUNT_OPTIONS = [
  { value: 0, label: "0" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
  { value: 9, label: "9" },
  { value: 10, label: "10+" },
];

const Register = ({ onToggleForm }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  // Static test data - uncomment to use for testing
  const staticTestData = {
    // Basic Info
    name: "Rahul Sharma",
    email: "rahul.sharma@yopmail.com",
    password: "Test@12345",
    confirmPassword: "Test@12345",
    mobile: "9876412345",
    profileFor: "self",
    gender: "male",

    // Personal Details
    dob: "1990-05-15",
    religion: "hindu",
    caste: "brahmin",
    subCaste: "kashyap",
    motherTongue: ["hindi"],
    maritalStatus: "never_married",

    // Education & Career
    highestQualification: "masters",
    fieldOfStudy: "computer_science",
    education: "masters",
    occupation: "software_engineer",
    industry: "information_technology",
    annualIncome: "10_15_lakhs",

    // Physical Attributes
    height: "5ft_9in",
    weight: "72",
    bodyType: "slim",
    complexion: "fair",

    // Lifestyle
    diet: "vegetarian",
    drinkingHabits: "never",
    smokingHabits: "never",
    fitnessLevel: "active",
    hobbies: ["reading", "traveling", "music"],
    interests: ["technology", "business", "science"],
    languagesKnown: ["hindi", "english"],
    petPreferences: "love_pets",

    // Family Details
    fatherOccupation: "government_employee",
    motherOccupation: "teacher",
    brothers: 1,
    brothersMarried: 1,
    sisters: 1,
    sistersMarried: 0,
    familyType: "nuclear",
    familyIncome: "15_25_lakhs",
    nativePlace: "Delhi",
    familyStatus: "upper_middle_class",

    // Location
    state: "delhi",
    city: "new_delhi",
    location: "South Delhi",

    // Preferences
    preferences: {
      ageRange: { min: 25, max: 30 },
      heightRange: { min: "5ft_2in", max: "5ft_8in" },
      qualities: ["honest", "caring", "family_oriented"],
      dealBreakers: ["smoking", "excessive_drinking"],
      educationPref: "graduate",
      occupationPref: ["software_engineer", "doctor", "teacher"],
      annualIncomePref: "5_10_lakhs",
      lifestyleExpectations: {
        diet: "vegetarian",
        drinking: "never",
        smoking: "never",
      },
      religionCastePref: "same_religion",
      locationPref: "same_city",
      relocation: "maybe",
      familyOrientation: "traditional",
      maritalStatusPref: "never_married",
    },

    // Additional Info
    about:
      "I am a software engineer working in a multinational company. I enjoy reading, traveling, and spending time with family. Looking for a life partner who is understanding, caring, and family-oriented.",
    photos: [],
    profileImage: "",

    agreeToTerms: true,
  };

  // To use this static data, replace your useState initialization with:
  /*
const [formData, setFormData] = useState(staticTestData);
*/

  // Or temporarily set it after component mount for testing:

  useEffect(() => {
    setFormData(staticTestData);
  }, []);

  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    profileFor: "self",
    gender: "",

    // Personal Details
    dob: "",
    religion: "",
    caste: "",
    subCaste: "",
    motherTongue: [],
    maritalStatus: "",

    // Education & Career
    highestQualification: "",
    fieldOfStudy: "",
    education: "",
    occupation: "",
    industry: "",
    annualIncome: "",

    // Physical Attributes
    height: "",
    weight: "30",
    bodyType: "",
    complexion: "",

    // Lifestyle
    diet: "",
    drinkingHabits: "",
    smokingHabits: "",
    fitnessLevel: "",
    hobbies: [],
    interests: [],
    languagesKnown: [],
    petPreferences: "",

    // Family Details
    fatherOccupation: "",
    motherOccupation: "",
    brothers: 0,
    brothersMarried: 0,
    sisters: 0,
    sistersMarried: 0,
    familyType: "",
    familyIncome: "",
    nativePlace: "",
    familyStatus: "",

    // Location
    state: "",
    city: "",
    location: "",

    // Preferences
    preferences: {
      ageRange: { min: 25, max: 30 },
      heightRange: { min: "5ft", max: "6ft" },
      qualities: [],
      dealBreakers: [],
      educationPref: "",
      occupationPref: [],
      annualIncomePref: "",
      lifestyleExpectations: { diet: "", drinking: "", smoking: "" },
      religionCastePref: "",
      locationPref: "",
      relocation: "",
      familyOrientation: "",
      maritalStatusPref: "",
    },

    // Additional Info
    about: "",
    photos: [],
    profileImage: "",

    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({});

  const steps = [
    "Account Details",
    "Personal Info",
    "Family & Lifestyle",
    "Preferences",
    "Complete",
  ];

  const handleChange = (e) => {
    let value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    // Convert specific fields to numbers
    if (
      ["brothers", "brothersMarried", "sisters", "sistersMarried"].includes(
        e.target.name
      )
    ) {
      value = Number(value);
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const handleArrayChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData({
      ...formData,
      [parent]: {
        ...formData[parent],
        [field]: value,
      },
    });
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email is invalid";
      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 8)
        newErrors.password = "Password must be at least 8 characters";
      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Please confirm your password";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
      if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    }
    if (step === 1) {
      if (!formData.dob) newErrors.dob = "Date of birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.religion) newErrors.religion = "Religion is required";
      if (!formData.maritalStatus)
        newErrors.maritalStatus = "Marital status is required";
      if (!formData.occupation) newErrors.occupation = "Occupation is required";
      if (!formData.location) newErrors.location = "Location is required";
    }
    if (step === 2) {
      if (!formData.familyType)
        newErrors.familyType = "Family type is required";
      if (!formData.familyStatus)
        newErrors.familyStatus = "Family status is required";
    }
    if (step === 3) {
      if (!formData.agreeToTerms)
        newErrors.agreeToTerms = "You must agree to the terms";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (
      formData.profileFor !== "self" &&
      formData.profileFor !== "relative" &&
      formData.profileFor !== "friend"
    ) {
      const autoGender =
        formData.profileFor === "son" || formData.profileFor === "brother"
          ? "male"
          : formData.profileFor === "daughter" ||
            formData.profileFor === "sister"
          ? "female"
          : "";

      setFormData((prev) => ({
        ...prev,
        gender: autoGender,
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
  console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(activeStep)) return;

    if (activeStep !== steps.length - 1) {
      handleNext();
      return;
    }

    try {
      setSubmitStatus({ loading: true });
      const response = await axiosInstance.post("/auth/signup", formData);
      if (response.data.success) {
        setEmailSent(true);
        showSuccess("Verification code sent to your email!");
        setSubmitStatus({
          loading: false,
          success: true,
          message:
            "Registration successful! Please check your email for verification code.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        loading: false,
        success: false,
        message: error.response?.data?.message || "Registration failed",
      });
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationCode) {
      setVerificationError("Please enter the verification code");
      return;
    }

    try {
      setIsVerifying(true);
      const response = await axiosInstance.post("/auth/verify-email", {
        email: formData.email,
        code: verificationCode,
      });

      if (response.data.success) {
        showSuccess("Email verified successfully!");
        navigate("/login");
      }
    } catch (error) {
      setVerificationError(
        error.response?.data?.message || "Verification failed"
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsVerifying(true);
      const response = await axiosInstance.post("/auth/resend-verification-otp", {
        email: formData.email,
      });

      if (response.data.success) {
        showSuccess("New verification code sent!");
      }
    } catch (error) {
      setVerificationError(
        error.response?.data?.message || "Failed to resend code"
      );
    } finally {
      setIsVerifying(false);
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
                    <Person sx={{ color: "#51365F" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": { borderColor: "#51365F" },
                },
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
                    <Email sx={{ color: "#51365F" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": { borderColor: "#51365F" },
                },
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
                    <Phone sx={{ color: "#51365F" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": { borderColor: "#51365F" },
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#51365F" }} />
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
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": { borderColor: "#51365F" },
                },
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#51365F" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#51365F",
                  },
                },
              }}
            />
          </>
        );
      case 1:
        return (
          <>
            <FormControl
              fullWidth
              margin="normal"
              required
              error={!!errors.profileFor}
            >
              <InputLabel>Create Profile For</InputLabel>
              <Select
                name="profileFor"
                value={formData.profileFor}
                onChange={handleChange}
                label="Create Profile For"
                sx={{
                  borderRadius: "12px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#51365F",
                  },
                }}
              >
                {PROFILE_FOR_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.profileFor && (
                <Typography variant="caption" color="error">
                  {errors.profileFor}
                </Typography>
              )}
            </FormControl>

            {(formData.profileFor === "self" ||
              formData.profileFor === "relative" ||
              formData.profileFor === "friend") && (
              <FormControl
                fullWidth
                margin="normal"
                required
                error={!!errors.gender}
              >
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  label="Gender"
                >
                  {GENDER_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.gender && (
                  <Typography variant="caption" color="error">
                    {errors.gender}
                  </Typography>
                )}
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
                    <Cake sx={{ color: "#51365F" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": { borderColor: "#51365F" },
                },
              }}
            />

            <FormControl
              fullWidth
              margin="normal"
              required
              error={!!errors.religion}
            >
              <InputLabel>Religion</InputLabel>
              <Select
                name="religion"
                value={formData.religion}
                onChange={(e) => {
                  handleChange(e);
                  // Reset caste and subcaste when religion changes
                  setFormData((prev) => ({
                    ...prev,
                    religion: e.target.value,
                    caste: "",
                    subCaste: "",
                  }));
                }}
                label="Religion"
              >
                {RELIGION_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.religion && (
                <Typography variant="caption" color="error">
                  {errors.religion}
                </Typography>
              )}
            </FormControl>

            <FormControl
              fullWidth
              margin="normal"
              required
              error={!!errors.caste}
            >
              <InputLabel>Caste</InputLabel>
              <Select
                name="caste"
                value={formData.caste}
                onChange={(e) => {
                  handleChange(e);
                  // Reset subcaste when caste changes
                  setFormData((prev) => ({
                    ...prev,
                    caste: e.target.value,
                    subCaste: "",
                  }));
                }}
                label="Caste"
                disabled={!formData.religion}
              >
                {getCasteOptions(formData.religion).map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.caste && (
                <Typography variant="caption" color="error">
                  {errors.caste}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Sub-Caste</InputLabel>
              <Select
                name="subCaste"
                value={formData.subCaste}
                onChange={handleChange}
                label="Sub-Caste"
                disabled={!formData.caste}
              >
                {getSubCasteOptions(formData.religion, formData.caste).map(
                  (option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              margin="normal"
              required
              error={!!errors.maritalStatus}
            >
              <InputLabel>Marital Status</InputLabel>
              <Select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                label="Marital Status"
              >
                {MARITAL_STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.maritalStatus && (
                <Typography variant="caption" color="error">
                  {errors.maritalStatus}
                </Typography>
              )}
            </FormControl>

            <Autocomplete
              multiple
              options={LANGUAGE_OPTIONS}
              getOptionLabel={(option) => option.label}
              value={formData.motherTongue.map(
                (lang) =>
                  LANGUAGE_OPTIONS.find((opt) => opt.value === lang) || {
                    value: lang,
                    label: lang,
                  }
              )}
              onChange={(event, newValue) => {
                handleArrayChange(
                  "motherTongue",
                  newValue.map((item) => item.value)
                );
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
                          <AccountBalance sx={{ color: "#51365F" }} />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.label}
                    {...getTagProps({ index })}
                    sx={{ backgroundColor: "#f8bbd0", color: "#880e4f" }}
                  />
                ))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#51365F",
                  },
                },
              }}
            />

            <FormControl
              fullWidth
              margin="normal"
              required
              error={!!errors.occupation}
            >
              <InputLabel>Occupation</InputLabel>
              <Select
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                label="Occupation"
              >
                {OCCUPATION_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.occupation && (
                <Typography variant="caption" color="error">
                  {errors.occupation}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Industry</InputLabel>
              <Select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                label="Industry"
              >
                {COMPREHENSIVE_INDUSTRY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Annual Income</InputLabel>
              <Select
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleChange}
                label="Annual Income"
              >
                {ANNUAL_INCOME_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              margin="normal"
              required
              error={!!errors.education}
            >
              <InputLabel>Education</InputLabel>
              <Select
                name="education"
                value={formData.education}
                onChange={(e) => {
                  handleChange(e);
                  // Reset field of study when education changes
                  setFormData((prev) => ({
                    ...prev,
                    education: e.target.value,
                    fieldOfStudy: "",
                  }));
                }}
                label="Education"
              >
                {EDUCATION_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.education && (
                <Typography variant="caption" color="error">
                  {errors.education}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Field of Study</InputLabel>
              <Select
                name="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={handleChange}
                label="Field of Study"
                disabled={!formData.education}
              >
                {getFieldOfStudyOptions(formData.education).map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              margin="normal"
              required
              error={!!errors.state}
            >
              <InputLabel>State</InputLabel>
              <Select
                name="state"
                value={formData.state}
                onChange={(e) => {
                  handleChange(e);
                  // Reset city when state changes
                  setFormData((prev) => ({
                    ...prev,
                    state: e.target.value,
                    city: "",
                  }));
                }}
                label="State"
              >
                {STATE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.state && (
                <Typography variant="caption" color="error">
                  {errors.state}
                </Typography>
              )}
            </FormControl>

            <FormControl
              fullWidth
              margin="normal"
              required
              error={!!errors.city}
            >
              <InputLabel>City</InputLabel>
              <Select
                name="city"
                value={formData.city}
                onChange={handleChange}
                label="City"
                disabled={!formData.state}
              >
                {getCityOptions(formData.state).map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.city && (
                <Typography variant="caption" color="error">
                  {errors.city}
                </Typography>
              )}
            </FormControl>

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
                    <LocationOn sx={{ color: "#51365F" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#51365F",
                  },
                },
              }}
            />
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="h6" sx={{ mt: 2, mb: 1, color: "#51365F" }}>
              Physical Attributes
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>Height</InputLabel>
              <Select
                name="height"
                value={formData.height}
                onChange={handleChange}
                label="Height"
              >
                {HEIGHT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
                    <FitnessCenter sx={{ color: "#51365F" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#51365F",
                  },
                },
              }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Body Type</InputLabel>
              <Select
                name="bodyType"
                value={formData.bodyType}
                onChange={handleChange}
                label="Body Type"
              >
                {BODY_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Complexion</InputLabel>
              <Select
                name="complexion"
                value={formData.complexion}
                onChange={handleChange}
                label="Complexion"
              >
                {COMPLEXION_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="h6" sx={{ mt: 3, mb: 1, color: "#51365F" }}>
              Lifestyle
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>Diet</InputLabel>
              <Select
                name="diet"
                value={formData.diet}
                onChange={handleChange}
                label="Diet"
              >
                {DIET_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Drinking Habits</InputLabel>
              <Select
                name="drinkingHabits"
                value={formData.drinkingHabits}
                onChange={handleChange}
                label="Drinking Habits"
              >
                {DRINKING_HABITS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Smoking Habits</InputLabel>
              <Select
                name="smokingHabits"
                value={formData.smokingHabits}
                onChange={handleChange}
                label="Smoking Habits"
              >
                {SMOKING_HABITS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Fitness Level</InputLabel>
              <Select
                name="fitnessLevel"
                value={formData.fitnessLevel}
                onChange={handleChange}
                label="Fitness Level"
              >
                {FITNESS_LEVEL_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Autocomplete
              multiple
              options={HOBBIES_OPTIONS}
              getOptionLabel={(option) => option.label}
              value={formData.hobbies.map(
                (hobby) =>
                  HOBBIES_OPTIONS.find((opt) => opt.value === hobby) || {
                    value: hobby,
                    label: hobby,
                  }
              )}
              onChange={(event, newValue) => {
                handleArrayChange(
                  "hobbies",
                  newValue.map((item) => item.value)
                );
              }}
              renderInput={(params) => (
                <TextField {...params} label="Hobbies" margin="normal" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.label}
                    {...getTagProps({ index })}
                    sx={{ backgroundColor: "#f8bbd0", color: "#880e4f" }}
                  />
                ))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#51365F",
                  },
                },
              }}
            />

            <Autocomplete
              multiple
              options={INTERESTS_OPTIONS}
              getOptionLabel={(option) => option.label}
              value={formData.interests.map(
                (interest) =>
                  INTERESTS_OPTIONS.find((opt) => opt.value === interest) || {
                    value: interest,
                    label: interest,
                  }
              )}
              onChange={(event, newValue) => {
                handleArrayChange(
                  "interests",
                  newValue.map((item) => item.value)
                );
              }}
              renderInput={(params) => (
                <TextField {...params} label="Interests" margin="normal" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.label}
                    {...getTagProps({ index })}
                    sx={{ backgroundColor: "#f8bbd0", color: "#880e4f" }}
                  />
                ))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#51365F",
                  },
                },
              }}
            />

            <Autocomplete
              multiple
              options={LANGUAGE_OPTIONS}
              getOptionLabel={(option) => option.label}
              value={formData.languagesKnown.map(
                (lang) =>
                  LANGUAGE_OPTIONS.find((opt) => opt.value === lang) || {
                    value: lang,
                    label: lang,
                  }
              )}
              onChange={(event, newValue) => {
                handleArrayChange(
                  "languagesKnown",
                  newValue.map((item) => item.value)
                );
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
                    sx={{ backgroundColor: "#f8bbd0", color: "#880e4f" }}
                  />
                ))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#51365F",
                  },
                },
              }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Pet Preferences</InputLabel>
              <Select
                name="petPreferences"
                value={formData.petPreferences}
                onChange={handleChange}
                label="Pet Preferences"
              >
                {PET_PREFERENCES_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="h6" sx={{ mt: 3, mb: 1, color: "#51365F" }}>
              Family Details
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>Father's Occupation</InputLabel>
              <Select
                name="fatherOccupation"
                value={formData.fatherOccupation}
                onChange={handleChange}
                label="Father's Occupation"
              >
                {FATHER_OCCUPATION_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Mother's Occupation</InputLabel>
              <Select
                name="motherOccupation"
                value={formData.motherOccupation}
                onChange={handleChange}
                label="Mother's Occupation"
              >
                {MOTHER_OCCUPATION_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Number of Brothers</InputLabel>
              <Select
                name="brothers"
                value={formData.brothers}
                onChange={handleChange}
                label="Number of Brothers"
              >
                {FAMILY_MEMBER_COUNT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Number of Brothers Married</InputLabel>
              <Select
                name="brothersMarried"
                value={formData.brothersMarried}
                onChange={handleChange}
                label="Number of Brothers Married"
                disabled={formData.brothers === 0}
              >
                {FAMILY_MEMBER_COUNT_OPTIONS.filter(
                  (option) => option.value <= formData.brothers
                ).map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Number of Sisters</InputLabel>
              <Select
                name="sisters"
                value={formData.sisters}
                onChange={handleChange}
                label="Number of Sisters"
              >
                {FAMILY_MEMBER_COUNT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Number of Sisters Married</InputLabel>
              <Select
                name="sistersMarried"
                value={formData.sistersMarried}
                onChange={handleChange}
                label="Number of Sisters Married"
                disabled={formData.sisters === 0}
              >
                {FAMILY_MEMBER_COUNT_OPTIONS.filter(
                  (option) => option.value <= formData.sisters
                ).map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              margin="normal"
              required
              error={!!errors.familyType}
            >
              <InputLabel>Family Type</InputLabel>
              <Select
                name="familyType"
                value={formData.familyType}
                onChange={handleChange}
                label="Family Type"
              >
                {FAMILY_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.familyType && (
                <Typography variant="caption" color="error">
                  {errors.familyType}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Family Income</InputLabel>
              <Select
                name="familyIncome"
                value={formData.familyIncome}
                onChange={handleChange}
                label="Family Income"
              >
                {FAMILY_INCOME_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
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
                    <LocationOn sx={{ color: "#51365F" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#51365F",
                  },
                },
              }}
            />

            <FormControl
              fullWidth
              margin="normal"
              required
              error={!!errors.familyStatus}
            >
              <InputLabel>Family Status</InputLabel>
              <Select
                name="familyStatus"
                value={formData.familyStatus}
                onChange={handleChange}
                label="Family Status"
              >
                {FAMILY_STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.familyStatus && (
                <Typography variant="caption" color="error">
                  {errors.familyStatus}
                </Typography>
              )}
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
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#51365F",
                  },
                },
              }}
            />
          </>
        );
      case 3:
        return (
          <>
            <Typography variant="h6" sx={{ mt: 2, mb: 1, color: "#51365F" }}>
              Partner Preferences
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Min Age</InputLabel>
                <Select
                  name="minAge"
                  value={formData.preferences.ageRange.min}
                  onChange={(e) =>
                    handleNestedChange("preferences", "ageRange", {
                      ...formData.preferences.ageRange,
                      min: e.target.value,
                    })
                  }
                  label="Min Age"
                >
                  {AGE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Max Age</InputLabel>
                <Select
                  name="maxAge"
                  value={formData.preferences.ageRange.max}
                  onChange={(e) =>
                    handleNestedChange("preferences", "ageRange", {
                      ...formData.preferences.ageRange,
                      max: e.target.value,
                    })
                  }
                  label="Max Age"
                >
                  {AGE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Min Height</InputLabel>
                <Select
                  name="minHeight"
                  value={formData.preferences.heightRange.min}
                  onChange={(e) =>
                    handleNestedChange("preferences", "heightRange", {
                      ...formData.preferences.heightRange,
                      min: e.target.value,
                    })
                  }
                  label="Min Height"
                >
                  {PARTNER_HEIGHT_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Max Height</InputLabel>
                <Select
                  name="maxHeight"
                  value={formData.preferences.heightRange.max}
                  onChange={(e) =>
                    handleNestedChange("preferences", "heightRange", {
                      ...formData.preferences.heightRange,
                      max: e.target.value,
                    })
                  }
                  label="Max Height"
                >
                  {PARTNER_HEIGHT_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Autocomplete
              multiple
              options={QUALITIES_OPTIONS}
              getOptionLabel={(option) => option.label}
              value={formData.preferences.qualities.map(
                (quality) =>
                  QUALITIES_OPTIONS.find((opt) => opt.value === quality) || {
                    value: quality,
                    label: quality,
                  }
              )}
              onChange={(event, newValue) => {
                handleNestedChange(
                  "preferences",
                  "qualities",
                  newValue.map((item) => item.value)
                );
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
                    label={option.label}
                    {...getTagProps({ index })}
                    sx={{ backgroundColor: "#f8bbd0", color: "#880e4f" }}
                  />
                ))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#51365F",
                  },
                },
              }}
            />

            <Autocomplete
              multiple
              options={DEAL_BREAKERS_OPTIONS}
              getOptionLabel={(option) => option.label}
              value={formData.preferences.dealBreakers.map(
                (breaker) =>
                  DEAL_BREAKERS_OPTIONS.find(
                    (opt) => opt.value === breaker
                  ) || { value: breaker, label: breaker }
              )}
              onChange={(event, newValue) => {
                handleNestedChange(
                  "preferences",
                  "dealBreakers",
                  newValue.map((item) => item.value)
                );
              }}
              renderInput={(params) => (
                <TextField {...params} label="Deal Breakers" margin="normal" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.label}
                    {...getTagProps({ index })}
                    sx={{ backgroundColor: "#f8bbd0", color: "#880e4f" }}
                  />
                ))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#51365F",
                  },
                },
              }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Education Preference</InputLabel>
              <Select
                name="educationPref"
                value={formData.preferences.educationPref}
                onChange={(e) =>
                  handleNestedChange(
                    "preferences",
                    "educationPref",
                    e.target.value
                  )
                }
                label="Education Preference"
              >
                {EDUCATION_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Autocomplete
              multiple
              options={OCCUPATION_OPTIONS}
              getOptionLabel={(option) => option.label}
              value={formData.preferences.occupationPref.map(
                (occ) =>
                  OCCUPATION_OPTIONS.find((opt) => opt.value === occ) || {
                    value: occ,
                    label: occ,
                  }
              )}
              onChange={(event, newValue) => {
                handleNestedChange(
                  "preferences",
                  "occupationPref",
                  newValue.map((item) => item.value)
                );
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
                    sx={{ backgroundColor: "#f8bbd0", color: "#880e4f" }}
                  />
                ))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#51365F",
                  },
                },
              }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Annual Income Preference</InputLabel>
              <Select
                name="annualIncomePref"
                value={formData.preferences.annualIncomePref}
                onChange={(e) =>
                  handleNestedChange(
                    "preferences",
                    "annualIncomePref",
                    e.target.value
                  )
                }
                label="Annual Income Preference"
              >
                {ANNUAL_INCOME_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography
              variant="subtitle1"
              sx={{ mt: 3, mb: 1, color: "#51365F" }}
            >
              Lifestyle Expectations
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>Diet Preference</InputLabel>
              <Select
                name="dietPref"
                value={formData.preferences.lifestyleExpectations.diet}
                onChange={(e) =>
                  handleNestedChange("preferences", "lifestyleExpectations", {
                    ...formData.preferences.lifestyleExpectations,
                    diet: e.target.value,
                  })
                }
                label="Diet Preference"
              >
                {DIET_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Drinking Preference</InputLabel>
              <Select
                name="drinkingPref"
                value={formData.preferences.lifestyleExpectations.drinking}
                onChange={(e) =>
                  handleNestedChange("preferences", "lifestyleExpectations", {
                    ...formData.preferences.lifestyleExpectations,
                    drinking: e.target.value,
                  })
                }
                label="Drinking Preference"
              >
                {DRINKING_HABITS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Smoking Preference</InputLabel>
              <Select
                name="smokingPref"
                value={formData.preferences.lifestyleExpectations.smoking}
                onChange={(e) =>
                  handleNestedChange("preferences", "lifestyleExpectations", {
                    ...formData.preferences.lifestyleExpectations,
                    smoking: e.target.value,
                  })
                }
                label="Smoking Preference"
              >
                {SMOKING_HABITS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Religion/Caste Preference</InputLabel>
              <Select
                name="religionCastePref"
                value={formData.preferences.religionCastePref}
                onChange={(e) =>
                  handleNestedChange(
                    "preferences",
                    "religionCastePref",
                    e.target.value
                  )
                }
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
                onChange={(e) =>
                  handleNestedChange(
                    "preferences",
                    "locationPref",
                    e.target.value
                  )
                }
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
                onChange={(e) =>
                  handleNestedChange(
                    "preferences",
                    "relocation",
                    e.target.value
                  )
                }
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
                onChange={(e) =>
                  handleNestedChange(
                    "preferences",
                    "familyOrientation",
                    e.target.value
                  )
                }
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
                onChange={(e) =>
                  handleNestedChange(
                    "preferences",
                    "maritalStatusPref",
                    e.target.value
                  )
                }
                label="Marital Status Preference"
              >
                {MARITAL_STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  sx={{
                    color: "#51365F",
                    "&.Mui-checked": { color: "#51365F" },
                  }}
                />
              }
              label="I agree to the Terms and Conditions"
              sx={{
                mt: 2,
                color: errors.agreeToTerms ? "error.main" : "#78909c",
              }}
            />
            {errors.agreeToTerms && (
              <Typography
                variant="caption"
                color="error"
                sx={{ display: "block", mt: 1 }}
              >
                {errors.agreeToTerms}
              </Typography>
            )}
          </>
        );
      case 4:
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Favorite sx={{ fontSize: 60, color: "#51365F", mb: 2 }} />
            <Typography variant="h5" sx={{ color: "#51365F", mb: 2 }}>
              Registration Complete!
            </Typography>
            <Typography variant="body1" sx={{ color: "#78909c", mb: 2 }}>
              Thank you for joining Bandhan Nammatch. Your journey to find your
              perfect partner begins now.
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#51365F", fontWeight: "bold" }}
            >
              Selected Plan: {formData.selectedPlan}
            </Typography>
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Fade in={true} timeout={800}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          py: 6,
          "&::before": {
            content: '""',
            position: "absolute",
            width: "100%",
            opacity: 0.1,
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Paper
            elevation={10}
            sx={{
              p: 5,
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              overflow: "hidden",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "5px",
                background: "linear-gradient(90deg, #51365F, #880e4f)",
                borderRadius: "10px 10px 0 0",
              },
            }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  color: "#51365F",
                  fontStyle: "italic",
                  mb: 1,
                }}
              >
                Begin Your Journey
              </Typography>
              <Typography variant="body1" sx={{ color: "#78909c" }}>
                Create your account to find your perfect life partner
              </Typography>
            </Box>
            {!emailSent && (
              <>
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

                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    {activeStep !== 0 && (
                      <Button
                        onClick={handleBack}
                        sx={{
                          mr: 1,
                          color: "#51365F",
                          borderRadius: "8px",
                          px: 3,
                        }}
                      >
                        Back
                      </Button>
                    )}
                    <Box sx={{ flex: "1 1 auto" }} />
                    {activeStep < steps.length - 1 ? (
                      <Button
                        onClick={handleNext}
                        variant="contained"
                        sx={{
                          borderRadius: "8px",
                          px: 4,
                          background: "#51365F",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)",
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
                          borderRadius: "8px",
                          px: 4,
                          background: "#51365F",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)",
                          },
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                        }}
                      >
                        {submitStatus.loading ? (
                          <>
                            <CircularProgress
                              size={20}
                              sx={{ color: "white" }}
                            />
                            Processing...
                          </>
                        ) : (
                          "Complete Registration"
                        )}
                      </Button>
                    )}
                  </Box>

                  {activeStep === 0 && (
                    <>
                      <Divider sx={{ my: 3 }}>
                        <Typography variant="body2" sx={{ color: "#78909c" }}>
                          Or sign up with
                        </Typography>
                      </Divider>

                      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<Google />}
                          sx={{
                            py: 1.5,
                            borderRadius: "12px",
                            borderColor: "#ddd",
                            color: "#5f6368",
                            "&:hover": {
                              borderColor: "#51365F",
                              color: "#51365F",
                            },
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
                            borderRadius: "12px",
                            borderColor: "#ddd",
                            color: "#1877f2",
                            "&:hover": {
                              borderColor: "#1877f2",
                              backgroundColor: "rgba(24, 119, 242, 0.04)",
                            },
                          }}
                        >
                          Facebook
                        </Button>
                      </Box>

                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="body2" sx={{ color: "#78909c" }}>
                          Already have an account?{" "}
                          <Link to="/login" style={{ textDecoration: "none" }}>
                            <span
                              onClick={onToggleForm}
                              style={{
                                color: "#51365F",
                                cursor: "pointer",
                                fontWeight: 600,
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
              </>
            )}

            {emailSent && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 2, textAlign: "center" }}>
                  Please enter the verification code sent to your email
                </Typography>
                <TextField
                  fullWidth
                  label="Verification Code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  margin="normal"
                  error={!!verificationError}
                  helperText={verificationError}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      "&.Mui-focused fieldset": { borderColor: "#51365F" },
                    },
                  }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleVerifyEmail}
                  disabled={isVerifying || !verificationCode}
                  startIcon={
                    isVerifying && (
                      <CircularProgress size={20} color="inherit" />
                    )
                  }
                  sx={{
                    mt: 2,
                    py: 1.5,
                    backgroundColor: "#51365F",
                    borderRadius: "12px",
                    "&:hover": { backgroundColor: "#422c4e" },
                  }}
                >
                  Verify Email
                </Button>
                <Button
                  fullWidth
                  variant="text"
                  onClick={handleResendCode}
                  disabled={isVerifying}
                  sx={{
                    mt: 1,
                    color: "#51365F",
                    "&:hover": { backgroundColor: "rgba(81, 54, 95, 0.04)" },
                  }}
                >
                  Resend Code
                </Button>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </Fade>
  );
};
export default Register;
