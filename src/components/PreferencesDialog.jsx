import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Box,
    Typography,
    MenuItem,
    IconButton,
    Tabs,
    Tab,
    Avatar,
    Card,
    CardMedia,
    Chip,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    Checkbox,
    ListItemText,
    FormHelperText
} from '@mui/material';
import {
    Close,
    PhotoCamera,
    Person,
    Favorite,
    Edit,
    Delete
} from '@mui/icons-material';

// Tab panel component for the dialog
function DialogTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`dialog-tabpanel-${index}`}
            aria-labelledby={`dialog-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const PreferencesDialog = ({ open, onClose, currentPreferences, user }) => {
    const [dialogTabValue, setDialogTabValue] = useState(0);
    const [preferences, setPreferences] = useState(currentPreferences || {
        ageRange: { min: 28, max: 35 },
        height: "5'8",
        maritalStatus: "Never Married",
        religion: "Hindu",
        education: "Graduate or above",
        profession: "Employed",
        location: "Any metro city in India",
        diet: "Vegetarian preferred"
    });

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        dob: user?.dob || '',
        location: user?.location || '',
        occupation: user?.occupation || '',
        education: user?.education || '',
        motherTongue: user?.motherTongue || '',
        religion: user?.religion || '',
        caste: user?.caste || '',
        about: user?.about || "I am a cheerful and caring person who values family and relationships. I enjoy traveling, cooking, and reading in my free time. Looking for someone who is honest, caring, and family-oriented.",
        interests: user?.interests || ["Travel", "Cooking", "Reading", "Music", "Dance", "Yoga"]
    });

    const [photos, setPhotos] = useState([
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    ]);

    const interestOptions = [
        "Travel", "Cooking", "Reading", "Music", "Dance", "Yoga", 
        "Sports", "Movies", "Art", "Photography", "Technology", "Fitness",
        "Gardening", "Pets", "Volunteering", "Shopping", "Food", "Writing"
    ];

    const handleDialogTabChange = (event, newValue) => {
        setDialogTabValue(newValue);
    };

    const handleChange = (field, value) => {
        setPreferences(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleProfileChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAgeRangeChange = (type, value) => {
        setPreferences(prev => ({
            ...prev,
            ageRange: {
                ...prev.ageRange,
                [type]: parseInt(value) || 0
            }
        }));
    };

    const handleInterestChange = (event) => {
        const {
            target: { value },
        } = event;
        setProfileData(prev => ({
            ...prev,
            interests: typeof value === 'string' ? value.split(',') : value,
        }));
    };

    const handlePhotoUpload = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newPhotos = [...photos];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                reader.onload = (e) => {
                    newPhotos.push(e.target.result);
                    if (i === files.length - 1) {
                        setPhotos(newPhotos);
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleRemovePhoto = (index) => {
        const newPhotos = [...photos];
        newPhotos.splice(index, 1);
        setPhotos(newPhotos);
    };

    const handleSubmit = () => {
        console.log('Updated profile data:', profileData);
        console.log('Updated preferences:', preferences);
        console.log('Updated photos:', photos);
        onClose();
    };

    const maritalStatusOptions = [
        "Never Married",
        "Divorced",
        "Widowed",
        "Awaiting Divorce"
    ];

    const religionOptions = [
        "Hindu",
        "Muslim",
        "Christian",
        "Sikh",
        "Buddhist",
        "Jain",
        "Other"
    ];

    const dietOptions = [
        "Vegetarian",
        "Non-Vegetarian",
        "Vegan",
        "Jain",
        "Eggetarian"
    ];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #fff9fb 0%, #fff0f5 100%)',
                    minHeight: '600px'
                }
            }}
        >
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Update Profile
                </Typography>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
                <Tabs
                    value={dialogTabValue}
                    onChange={handleDialogTabChange}
                    sx={{
                        '& .MuiTabs-indicator': {
                            height: '100%',
                            background: 'linear-gradient(135deg, rgba(216, 27, 96, 0.08) 0%, rgba(136, 14, 79, 0.05) 100%)',
                            borderRadius: '16px',
                            zIndex: 0,
                        },
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: '#78909c',
                            minHeight: '0px',
                            zIndex: 1,
                            position: 'relative',
                            '&.Mui-selected': {
                                color: '#d81b60',
                                fontWeight: 600,
                            },
                        }
                    }}
                >
                    <Tab
                        icon={<Person sx={{ fontSize: '18px', mb: 0.5 }} />}
                        iconPosition="start"
                        label="Profile Details"
                    />
                    <Tab
                        icon={<Edit sx={{ fontSize: '18px', mb: 0.5 }} />}
                        iconPosition="start"
                        label="About & Interests"
                    />
                    <Tab
                        icon={<PhotoCamera sx={{ fontSize: '18px', mb: 0.5 }} />}
                        iconPosition="start"
                        label="Photos"
                    />
                    <Tab
                        icon={<Favorite sx={{ fontSize: '18px', mb: 0.5 }} />}
                        iconPosition="start"
                        label="Preferences"
                    />
                </Tabs>
            </Box>

            <DialogContent sx={{ py: 4, minHeight: '400px' }}>
                <DialogTabPanel value={dialogTabValue} index={0}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                value={profileData.name}
                                onChange={(e) => handleProfileChange('name', e.target.value)}
                                size="small"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={profileData.email}
                                onChange={(e) => handleProfileChange('email', e.target.value)}
                                size="small"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Date of Birth"
                                type="date"
                                value={profileData.dob}
                                onChange={(e) => handleProfileChange('dob', e.target.value)}
                                size="small"
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                fullWidth
                                label="Location"
                                value={profileData.location}
                                onChange={(e) => handleProfileChange('location', e.target.value)}
                                size="small"
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Occupation"
                                value={profileData.occupation}
                                onChange={(e) => handleProfileChange('occupation', e.target.value)}
                                size="small"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Education"
                                value={profileData.education}
                                onChange={(e) => handleProfileChange('education', e.target.value)}
                                size="small"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Mother Tongue"
                                value={profileData.motherTongue}
                                onChange={(e) => handleProfileChange('motherTongue', e.target.value)}
                                size="small"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Religion"
                                value={profileData.religion}
                                onChange={(e) => handleProfileChange('religion', e.target.value)}
                                size="small"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Caste"
                                value={profileData.caste}
                                onChange={(e) => handleProfileChange('caste', e.target.value)}
                                size="small"
                                margin="normal"
                            />
                        </Grid>
                    </Grid>
                </DialogTabPanel>

                <DialogTabPanel value={dialogTabValue} index={1}>
                    <TextField
                        fullWidth
                        label="About Me"
                        multiline
                        rows={4}
                        value={profileData.about}
                        onChange={(e) => handleProfileChange('about', e.target.value)}
                        margin="normal"
                    />
                    
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Interests</InputLabel>
                        <Select
                            multiple
                            value={profileData.interests}
                            onChange={handleInterestChange}
                            input={<OutlinedInput label="Interests" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} size="small" />
                                    ))}
                                </Box>
                            )}
                        >
                            {interestOptions.map((interest) => (
                                <MenuItem key={interest} value={interest}>
                                    <Checkbox checked={profileData.interests.indexOf(interest) > -1} />
                                    <ListItemText primary={interest} />
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>Select your interests</FormHelperText>
                    </FormControl>
                </DialogTabPanel>

                <DialogTabPanel value={dialogTabValue} index={2}>
                    <Box sx={{ mb: 3 }}>
                        <Button
                            variant="contained"
                            component="label"
                            startIcon={<PhotoCamera />}
                            sx={{
                                background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)'
                                }
                            }}
                        >
                            Upload Photos
                            <input
                                type="file"
                                hidden
                                multiple
                                accept="image/*"
                                onChange={handlePhotoUpload}
                            />
                        </Button>
                    </Box>
                    
                    <Grid container spacing={2}>
                        {photos.map((photo, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{ position: 'relative', borderRadius: '12px' }}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={photo}
                                        alt={`Profile photo ${index + 1}`}
                                    />
                                    <IconButton
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 5,
                                            right: 5,
                                            backgroundColor: 'rgba(255,255,255,0.8)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255,255,255,1)'
                                            }
                                        }}
                                        onClick={() => handleRemovePhoto(index)}
                                    >
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </DialogTabPanel>

                <DialogTabPanel value={dialogTabValue} index={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, color: '#d81b60', fontWeight: 600 }}>
                                    Age Range *
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Min Age"
                                        value={preferences.ageRange.min}
                                        onChange={(e) => handleAgeRangeChange('min', e.target.value)}
                                        InputProps={{ inputProps: { min: 18, max: 100 } }}
                                        size="small"
                                    />
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Max Age"
                                        value={preferences.ageRange.max}
                                        onChange={(e) => handleAgeRangeChange('max', e.target.value)}
                                        InputProps={{ inputProps: { min: 18, max: 100 } }}
                                        size="small"
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, color: '#d81b60', fontWeight: 600 }}>
                                    Height *
                                </Typography>
                                <TextField
                                    fullWidth
                                    value={preferences.height}
                                    onChange={(e) => handleChange('height', e.target.value)}
                                    placeholder="e.g., 5'8&quot;"
                                    size="small"
                                />
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, color: '#d81b60', fontWeight: 600 }}>
                                    Marital Status *
                                </Typography>
                                <TextField
                                    fullWidth
                                    select
                                    value={preferences.maritalStatus}
                                    onChange={(e) => handleChange('maritalStatus', e.target.value)}
                                    size="small"
                                >
                                    {maritalStatusOptions?.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, color: '#d81b60', fontWeight: 600 }}>
                                    Religion *
                                </Typography>
                                <TextField
                                    fullWidth
                                    select
                                    value={preferences.religion}
                                    onChange={(e) => handleChange('religion', e.target.value)}
                                    size="small"
                                >
                                    {religionOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, color: '#d81b60', fontWeight: 600 }}>
                                    Education *
                                </Typography>
                                <TextField
                                    fullWidth
                                    value={preferences.education}
                                    onChange={(e) => handleChange('education', e.target.value)}
                                    placeholder="e.g., Graduate or above"
                                    size="small"
                                />
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, color: '#d81b60', fontWeight: 600 }}>
                                    Profession *
                                </Typography>
                                <TextField
                                    fullWidth
                                    value={preferences.profession}
                                    onChange={(e) => handleChange('profession', e.target.value)}
                                    placeholder="e.g., Employed"
                                    size="small"
                                />
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, color: '#d81b60', fontWeight: 600 }}>
                                    Location *
                                </Typography>
                                <TextField
                                    fullWidth
                                    value={preferences.location}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                    placeholder="e.g., Any metro city in India"
                                    size="small"
                                />
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, color: '#d81b60', fontWeight: 600 }}>
                                    Diet Preference *
                                </Typography>
                                <TextField
                                    fullWidth
                                    select
                                    value={preferences.diet}
                                    onChange={(e) => handleChange('diet', e.target.value)}
                                    size="small"
                                >
                                    {dietOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogTabPanel>
            </DialogContent>

            <DialogActions sx={{ px: 4, py: 3, gap: 2 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        borderRadius: '25px',
                        px: 4,
                        borderColor: '#d81b60',
                        color: '#d81b60',
                        '&:hover': {
                            borderColor: '#880e4f',
                            backgroundColor: 'rgba(216, 27, 96, 0.1)'
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        borderRadius: '25px',
                        px: 4,
                        background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)'
                        }
                    }}
                >
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PreferencesDialog;