import React from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Avatar
} from '@mui/material';
import {
  KeyboardArrowRight as KeyboardArrowRightIcon,
  CameraAlt as CameraAltIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const ProfileEdit = ({ 
  editingProfile, 
  onBackToMatches, 
  onSaveProfile, 
  onCancelEdit,
  onProfileFieldChange,
  onProfileImageChange,
  onRemoveProfileImage
}) => {
  return (
    <>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<KeyboardArrowRightIcon sx={{ transform: 'rotate(180deg)' }} />}
          onClick={onCancelEdit}
          sx={{
            color: '#51365F',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: 'rgba(233, 30, 99, 0.1)'
            }
          }}
        >
          Back to Matches
        </Button>
      </Box>

      {/* Profile Edit Form */}
      <Card sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>
            Edit Your Profile
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={onCancelEdit}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={onSaveProfile}
              sx={{
                backgroundColor: '#51365F',
                '&:hover': { backgroundColor: '#c2185b' },
                textTransform: 'none'
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>

        {/* Profile Image Upload Section */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
            Profile Picture
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 2
          }}>
            <Avatar
              src={editingProfile.profileImage?.startsWith('http') ? editingProfile.profileImage : editingProfile.profileImage ? `http://localhost:3000/uploads/${editingProfile.profileImage}` : null}
              sx={{ 
                width: 120, 
                height: 120, 
                border: '3px solid #51365F',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CameraAltIcon />}
                sx={{
                  borderColor: '#51365F',
                  color: '#51365F',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(233, 30, 99, 0.1)',
                    borderColor: '#51365F'
                  }
                }}
              >
                Change Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={onProfileImageChange}
                />
              </Button>
              {editingProfile.profileImage && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CloseIcon />}
                  onClick={onRemoveProfileImage}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Remove
                </Button>
              )}
            </Box>
            <Typography variant="caption" sx={{ color: '#666', textAlign: 'center' }}>
              Upload a clear photo of yourself. JPG, PNG or GIF format. Max 5MB.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
              Basic Information
            </Typography>
            <TextField 
              fullWidth 
              label="Full Name" 
              value={editingProfile.name || ''} 
              onChange={(e) => onProfileFieldChange('name', e.target.value)} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Email" 
              value={editingProfile.email || ''} 
              disabled 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Phone Number" 
              value={editingProfile.phoneNumber || ''} 
              onChange={(e) => onProfileFieldChange('phoneNumber', e.target.value)} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Date of Birth" 
              type="date" 
              value={editingProfile.dob ? editingProfile.dob.split('T')[0] : ''} 
              onChange={(e) => onProfileFieldChange('dob', e.target.value)} 
              InputLabelProps={{ shrink: true }} 
              sx={{ mb: 2 }} 
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Gender</InputLabel>
              <Select 
                value={editingProfile.gender || ''} 
                onChange={(e) => onProfileFieldChange('gender', e.target.value)} 
                label="Gender"
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Location & Professional */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
              Location & Professional
            </Typography>
            <TextField 
              fullWidth 
              label="City" 
              value={editingProfile.city || ''} 
              onChange={(e) => onProfileFieldChange('city', e.target.value)} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="State" 
              value={editingProfile.state || ''} 
              onChange={(e) => onProfileFieldChange('state', e.target.value)} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Occupation" 
              value={editingProfile.occupation || ''} 
              onChange={(e) => onProfileFieldChange('occupation', e.target.value)} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Education" 
              value={editingProfile.education || ''} 
              onChange={(e) => onProfileFieldChange('education', e.target.value)} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Height" 
              value={editingProfile.height || ''} 
              onChange={(e) => onProfileFieldChange('height', e.target.value)} 
              placeholder="e.g., 5'8 inches" 
              sx={{ mb: 2 }} 
            />
          </Grid>

          {/* Religious & Cultural */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
              Religious & Cultural
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Religion</InputLabel>
              <Select 
                value={editingProfile.religion || ''} 
                onChange={(e) => onProfileFieldChange('religion', e.target.value)} 
                label="Religion"
              >
                <MenuItem value="Hindu">Hindu</MenuItem>
                <MenuItem value="Muslim">Muslim</MenuItem>
                <MenuItem value="Christian">Christian</MenuItem>
                <MenuItem value="Sikh">Sikh</MenuItem>
                <MenuItem value="Buddhist">Buddhist</MenuItem>
                <MenuItem value="Jain">Jain</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField 
              fullWidth 
              label="Caste" 
              value={editingProfile.caste || ''} 
              onChange={(e) => onProfileFieldChange('caste', e.target.value)} 
              sx={{ mb: 2 }} 
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Marital Status</InputLabel>
              <Select 
                value={editingProfile.maritalStatus || ''} 
                onChange={(e) => onProfileFieldChange('maritalStatus', e.target.value)} 
                label="Marital Status"
              >
                <MenuItem value="never_married">Never Married</MenuItem>
                <MenuItem value="divorced">Divorced</MenuItem>
                <MenuItem value="widow">Widow</MenuItem>
                <MenuItem value="widower">Widower</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Personal Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
              Personal Details
            </Typography>
            <TextField 
              fullWidth 
              label="About Me" 
              multiline 
              rows={4} 
              value={editingProfile.about || ''} 
              onChange={(e) => onProfileFieldChange('about', e.target.value)} 
              placeholder="Tell us about yourself..." 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Hobbies" 
              value={Array.isArray(editingProfile.hobbies) ? editingProfile.hobbies.join(', ') : editingProfile.hobbies || ''} 
              onChange={(e) => onProfileFieldChange('hobbies', e.target.value.split(',').map(h => h.trim()))} 
              placeholder="e.g., Reading, Traveling, Cooking" 
              sx={{ mb: 2 }} 
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Diet</InputLabel>
              <Select 
                value={editingProfile.diet || ''} 
                onChange={(e) => onProfileFieldChange('diet', e.target.value)} 
                label="Diet"
              >
                <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                <MenuItem value="Non-Vegetarian">Non-Vegetarian</MenuItem>
                <MenuItem value="Vegan">Vegan</MenuItem>
                <MenuItem value="Jain">Jain</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default ProfileEdit;
