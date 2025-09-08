import React, {useState, useEffect} from "react";
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
    Card,
    CardMedia,
    Chip,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    Checkbox,
    ListItemText,
    FormHelperText,
    Snackbar,
    Alert,
} from "@mui/material";
import {Close, PhotoCamera, Person, Favorite, Edit, Delete} from "@mui/icons-material";
import axios from "axios";
import {API_BASE_URL} from "../utils/api";
import Cookies from "js-cookie";

// Tab panel component for the dialog
function DialogTabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`dialog-tabpanel-${index}`}
            aria-labelledby={`dialog-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{py: 3}}>{children}</Box>}
        </div>
    );
}

const PreferencesDialog = ({open, onClose, currentPreferences, user, onUpdateSuccess}) => {
    const [dialogTabValue, setDialogTabValue] = useState(0);
    const [dobError, setDobError] = useState("");
    const [preferences, setPreferences] = useState({
        ageRange: {min: 28, max: 35},
        height: "",
        maritalStatus: "",
        religion: "",
        education: "",
        profession: "",
        location: "",
        diet: "",
    });

    const accessToken = Cookies.get("accessToken");

    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        dob: "",
        location: "",
        occupation: "",
        education: "",
        motherTongue: "",
        religion: "",
        caste: "",
        about: "",
        interests: [],
    });

    const [photos, setPhotos] = useState([]);
    const [newPhotos, setNewPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const interestOptions = [
        "Travel",
        "Cooking",
        "Reading",
        "Music",
        "Dance",
        "Yoga",
        "Sports",
        "Movies",
        "Art",
        "Photography",
        "Technology",
        "Fitness",
        "Gardening",
        "Pets",
        "Volunteering",
        "Shopping",
        "Food",
        "Writing",
    ];

    const heightOptions = [];
    for (let feet = 4; feet <= 7; feet++) {
        for (let inches = 0; inches < 12; inches++) {
            heightOptions.push(`${feet}'${inches}"`);
        }
    }

    useEffect(() => {
        if (open && user) {
            const formatDateForInput = (dateString) => {
                if (!dateString) return "";
                const date = new Date(dateString);
                return date.toISOString().split("T")[0];
            };
            const userPrefs = user?.preferences || {};
            const safePreferences = {};
            Object.keys(userPrefs).forEach((key) => {
                if (typeof userPrefs[key] === "string" || typeof userPrefs[key] === "number") {
                    safePreferences[key] = userPrefs[key];
                }
            });
            if (userPrefs.ageRange && typeof userPrefs.ageRange === "object") {
                safePreferences.ageRange = {
                    min: userPrefs.ageRange.min || 25,
                    max: userPrefs.ageRange.max || 35,
                };
            }
            setProfileData({
                name: user?.name || "",
                email: user?.email || "",
                dob: formatDateForInput(user?.dob) || "",
                location: user?.location || "",
                occupation: user?.occupation || "",
                education: user?.education || "",
                motherTongue: user?.motherTongue || "",
                religion: user?.religion || "",
                caste: user?.caste || "",
                about: user?.about || "",
                interests: user?.interests || [],
            });
            setPreferences(safePreferences);
            setPhotos(user?.photos || []);
        }
    }, [open, user, currentPreferences]);

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({open: true, message, severity});
    };

    const handleDialogTabChange = (event, newValue) => {
        setDialogTabValue(newValue);
    };

    const handleChange = (field, value) => {
        setPreferences((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleProfileChange = (field, value) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAgeRangeChange = (type, value) => {
        setPreferences((prev) => ({
            ...prev,
            ageRange: {
                ...prev.ageRange,
                [type]: parseInt(value) || 0,
            },
        }));
    };

    const handleInterestChange = (event) => {
        const {
            target: {value},
        } = event;
        setProfileData((prev) => ({
            ...prev,
            interests: typeof value === "string" ? value.split(",") : value,
        }));
    };

    const handlePhotoUpload = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const uploadedPhotos = [...newPhotos];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                uploadedPhotos.push(file);
            }
            setNewPhotos(uploadedPhotos);
            const newPreviewPhotos = [...photos];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                reader.onload = (e) => {
                    newPreviewPhotos.push(e.target.result);
                    if (i === files.length - 1) {
                        setPhotos(newPreviewPhotos);
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleRemovePhoto = (index) => {
        const newPhotosList = [...photos];
        newPhotosList.splice(index, 1);
        setPhotos(newPhotosList);
        if (index >= (user?.photos?.length || 0)) {
            const newUploads = [...newPhotos];
            newUploads.splice(index - (user?.photos?.length || 0), 1);
            setNewPhotos(newUploads);
        }
    };

    const validateDob = (dob) => {
        if (!dob) {
            setDobError("Date of Birth is required");
            return false;
        }
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) {
            setDobError("You must be at least 18 years old");
            return false;
        }
        setDobError("");
        return true;
    };

    const handleSubmit = async () => {
        if (!validateDob(profileData.dob)) {
            return;
        }
        setLoading(true);
        try {
            if (!accessToken) {
                showSnackbar("Authentication required. Please login again.", "error");
                setLoading(false);
                return;
            }
            const formData = new FormData();
            Object.keys(profileData).forEach((key) => {
                if (key === "interests") {
                    formData.append(key, JSON.stringify(profileData[key]));
                } else if (profileData[key] !== null && profileData[key] !== undefined) {
                    formData.append(key, profileData[key]);
                }
            });
            formData.append("preferences", JSON.stringify(preferences));
            newPhotos.forEach((photo) => {
                formData.append("photos", photo);
            });
            const response = await axios.put(`${API_BASE_URL}/auth/user/update`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log("Update response:", response.data);
            if (response.data.success) {
                showSnackbar("Profile updated successfully!");
                if (onUpdateSuccess) {
                    onUpdateSuccess(response.data.data);
                }
                onClose();
            } else {
                showSnackbar(response.data.message || "Failed to update profile", "error");
            }
        } catch (error) {
            console.error("Update error:", error);
            showSnackbar(error.response?.data?.message || "Error updating profile. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const maritalStatusOptions = ["Never Married", "Divorced", "Widowed", "Awaiting Divorce"];

    const religionOptions = ["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Other"];

    const dietOptions = ["Vegetarian", "Non-Vegetarian", "Vegan", "Jain", "Eggetarian"];

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    sx: {
                        borderRadius: "16px",
                        background: "linear-gradient(135deg, #fff9fb 0%, #fff0f5 100%)",
                        minHeight: "600px",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        background: "linear-gradient(135deg, #d81b60 0%, #880e4f 100%)",
                        color: "white",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h6" component="span" sx={{fontWeight: 600}}>
                        Update Profile
                    </Typography>
                    <IconButton onClick={onClose} sx={{color: "white"}}>
                        <Close />
                    </IconButton>
                </DialogTitle>

                <Box sx={{borderBottom: 1, borderColor: "divider", px: 3}}>
                    <Tabs
                        value={dialogTabValue}
                        onChange={handleDialogTabChange}
                        sx={{
                            "& .MuiTabs-indicator": {
                                height: "100%",
                                background:
                                    "linear-gradient(135deg, rgba(216, 27, 96, 0.08) 0%, rgba(136, 14, 79, 0.05) 100%)",
                                borderRadius: "16px",
                                zIndex: 0,
                            },
                            "& .MuiTab-root": {
                                textTransform: "none",
                                fontSize: "0.9rem",
                                fontWeight: 500,
                                color: "#78909c",
                                minHeight: "0px",
                                zIndex: 1,
                                position: "relative",
                                "&.Mui-selected": {
                                    color: "#d81b60",
                                    fontWeight: 600,
                                },
                            },
                        }}
                    >
                        <Tab
                            icon={<Person sx={{fontSize: "18px", mb: 0.5}} />}
                            iconPosition="start"
                            label="Profile Details"
                        />
                        <Tab
                            icon={<Edit sx={{fontSize: "18px", mb: 0.5}} />}
                            iconPosition="start"
                            label="About & Interests"
                        />
                        <Tab
                            icon={<PhotoCamera sx={{fontSize: "18px", mb: 0.5}} />}
                            iconPosition="start"
                            label="Photos"
                        />
                        <Tab
                            icon={<Favorite sx={{fontSize: "18px", mb: 0.5}} />}
                            iconPosition="start"
                            label="Preferences"
                        />
                    </Tabs>
                </Box>

                <DialogContent sx={{py: 4, minHeight: "400px"}}>
                    <DialogTabPanel value={dialogTabValue} index={0}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    value={profileData.name}
                                    onChange={(e) => handleProfileChange("name", e.target.value)}
                                    size="small"
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Date of Birth"
                                    type="date"
                                    value={profileData.dob}
                                    onChange={(e) => handleProfileChange("dob", e.target.value)}
                                    size="small"
                                    margin="normal"
                                    InputLabelProps={{shrink: true}}
                                    error={Boolean(dobError)}
                                    helperText={dobError}
                                />
                                <TextField
                                    fullWidth
                                    label="Location"
                                    value={profileData.location}
                                    onChange={(e) => handleProfileChange("location", e.target.value)}
                                    size="small"
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Occupation"
                                    value={profileData.occupation}
                                    onChange={(e) => handleProfileChange("occupation", e.target.value)}
                                    size="small"
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Education"
                                    value={profileData.education}
                                    onChange={(e) => handleProfileChange("education", e.target.value)}
                                    size="small"
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Mother Tongue"
                                    value={profileData.motherTongue}
                                    onChange={(e) => handleProfileChange("motherTongue", e.target.value)}
                                    size="small"
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Religion"
                                    value={profileData.religion}
                                    onChange={(e) => handleProfileChange("religion", e.target.value)}
                                    size="small"
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Caste"
                                    value={profileData.caste}
                                    onChange={(e) => handleProfileChange("caste", e.target.value)}
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
                            onChange={(e) => handleProfileChange("about", e.target.value)}
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
                                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
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
                        <Box sx={{mb: 3}}>
                            <Button
                                variant="contained"
                                component="label"
                                startIcon={<PhotoCamera />}
                                sx={{
                                    background: "linear-gradient(135deg, #d81b60 0%, #880e4f 100%)",
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)",
                                    },
                                }}
                            >
                                Upload Photos
                                <input type="file" hidden multiple accept="image/*" onChange={handlePhotoUpload} />
                            </Button>
                        </Box>

                        <Grid container spacing={2}>
                            {photos.map((photo, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card sx={{position: "relative", borderRadius: "12px"}}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={photo}
                                            alt={`Profile photo ${index + 1}`}
                                        />
                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: "absolute",
                                                top: 5,
                                                right: 5,
                                                backgroundColor: "rgba(255,255,255,0.8)",
                                                "&:hover": {
                                                    backgroundColor: "rgba(255,255,255,1)",
                                                },
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
                                <Box sx={{mb: 3}}>
                                    <Typography variant="subtitle2" sx={{mb: 1, color: "#d81b60", fontWeight: 600}}>
                                        Age Range *
                                    </Typography>
                                    <Box sx={{display: "flex", gap: 2}}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Min Age"
                                            value={preferences.ageRange?.min || 28}
                                            onChange={(e) => handleAgeRangeChange("min", e.target.value)}
                                            InputProps={{inputProps: {min: 18, max: 100}}}
                                            size="small"
                                        />
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Max Age"
                                            value={preferences.ageRange?.max || 35}
                                            onChange={(e) => handleAgeRangeChange("max", e.target.value)}
                                            InputProps={{inputProps: {min: 18, max: 100}}}
                                            size="small"
                                        />
                                    </Box>
                                </Box>

                                <Box sx={{mb: 3}}>
                                    <Typography variant="subtitle2" sx={{mb: 1, color: "#d81b60", fontWeight: 600}}>
                                        Height *
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        select
                                        value={preferences.height || ""}
                                        onChange={(e) => handleChange("height", e.target.value)}
                                        size="small"
                                        displayEmpty
                                        SelectProps={{
                                            displayEmpty: true,
                                            renderValue: (selected) => {
                                                if (!selected) {
                                                    return (
                                                        <Typography sx={{color: "text.disabled"}}>
                                                            Select your height
                                                        </Typography>
                                                    );
                                                }
                                                return selected;
                                            },
                                        }}
                                    >
                                        <MenuItem disabled value="">
                                            <Typography sx={{color: "text.disabled"}}>Select your height</Typography>
                                        </MenuItem>
                                        {heightOptions.map((height) => (
                                            <MenuItem key={height} value={height}>
                                                {height}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>

                                <Box sx={{mb: 3}}>
                                    <Typography variant="subtitle2" sx={{mb: 1, color: "#d81b60", fontWeight: 600}}>
                                        Marital Status *
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        select
                                        value={preferences.maritalStatus || ""}
                                        onChange={(e) => handleChange("maritalStatus", e.target.value)}
                                        size="small"
                                    >
                                        {maritalStatusOptions?.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>

                                <Box sx={{mb: 3}}>
                                    <Typography variant="subtitle2" sx={{mb: 1, color: "#d81b60", fontWeight: 600}}>
                                        Religion *
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        select
                                        value={preferences.religion || ""}
                                        onChange={(e) => handleChange("religion", e.target.value)}
                                        size="small"
                                    >
                                        {religionOptions?.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={{mb: 3}}>
                                    <Typography variant="subtitle2" sx={{mb: 1, color: "#d81b60", fontWeight: 600}}>
                                        Education *
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        value={preferences.education || ""}
                                        onChange={(e) => handleChange("education", e.target.value)}
                                        placeholder="e.g., Graduate or above"
                                        size="small"
                                    />
                                </Box>

                                <Box sx={{mb: 3}}>
                                    <Typography variant="subtitle2" sx={{mb: 1, color: "#d81b60", fontWeight: 600}}>
                                        Profession *
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        value={preferences.profession || ""}
                                        onChange={(e) => handleChange("profession", e.target.value)}
                                        placeholder="e.g., Employed"
                                        size="small"
                                    />
                                </Box>

                                <Box sx={{mb: 3}}>
                                    <Typography variant="subtitle2" sx={{mb: 1, color: "#d81b60", fontWeight: 600}}>
                                        Location *
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        value={preferences.location || ""}
                                        onChange={(e) => handleChange("location", e.target.value)}
                                        placeholder="e.g., Any metro city in India"
                                        size="small"
                                    />
                                </Box>

                                <Box sx={{mb: 3}}>
                                    <Typography variant="subtitle2" sx={{mb: 1, color: "#d81b60", fontWeight: 600}}>
                                        Diet Preference *
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        select
                                        value={preferences.diet || ""}
                                        onChange={(e) => handleChange("diet", e.target.value)}
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

                <DialogActions sx={{px: 4, py: 3, gap: 2}}>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{
                            borderRadius: "25px",
                            px: 4,
                            borderColor: "#d81b60",
                            color: "#d81b60",
                            "&:hover": {
                                borderColor: "#880e4f",
                                backgroundColor: "rgba(216, 27, 96, 0.1)",
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading}
                        sx={{
                            borderRadius: "25px",
                            px: 4,
                            background: "linear-gradient(135deg, #d81b60 0%, #880e4f 100%)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)",
                            },
                        }}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({...snackbar, open: false})}
                anchorOrigin={{vertical: "top", horizontal: "center"}}
            >
                <Alert
                    onClose={() => setSnackbar({...snackbar, open: false})}
                    severity={snackbar.severity}
                    sx={{width: "100%"}}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};
export default PreferencesDialog;
