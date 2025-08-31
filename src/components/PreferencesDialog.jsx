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
    IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';

const PreferencesDialog = ({ open, onClose, currentPreferences }) => {
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

    const handleChange = (field, value) => {
        setPreferences(prev => ({
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

    const handleSubmit = () => {
        console.log('Updated preferences:', preferences);
        // Here you would typically make an API call to save preferences
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
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #fff9fb 0%, #fff0f5 100%)'
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
                    Update Partner Preferences
                </Typography>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ py: 4 }}>
                <Grid container spacing={4} py={2}>
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

                        {/* Height */}
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

                        {/* Marital Status */}
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
                                {maritalStatusOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        {/* Religion */}
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
                        {/* Education */}
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

                        {/* Profession */}
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

                        {/* Location */}
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

                        {/* Diet */}
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
                    Save Preferences
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PreferencesDialog;