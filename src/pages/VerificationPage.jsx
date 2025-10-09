import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Alert,
    CircularProgress,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Grid,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    LinearProgress
} from '@mui/material';
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    Badge as BadgeIcon,
    PhotoCamera as PhotoIcon,
    CheckCircle as CheckIcon,
    Error as ErrorIcon,
    Upload as UploadIcon,
    Send as SendIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
    sendEmailVerification,
    confirmEmailVerification,
    sendPhoneVerification,
    confirmPhoneVerification,
    uploadIdVerification,
    uploadVerificationPhotos,
    getVerificationStatus
} from '../store/slices/verificationSlice';
import { showSuccess, showError } from '../utils/toast';

const VerificationPage = () => {
    const dispatch = useDispatch();
    const { 
        verificationStatus, 
        loading, 
        error 
    } = useSelector(state => state.verification);

    const [activeStep, setActiveStep] = useState(0);
    const [otp, setOtp] = useState('');
    const [emailOtp, setEmailOtp] = useState('');
    const [phoneOtp, setPhoneOtp] = useState('');
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [uploadType, setUploadType] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const verificationSteps = [
        {
            label: 'Email Verification',
            icon: <EmailIcon />,
            status: verificationStatus?.email?.verified ? 'completed' : (verificationStatus?.email?.status === 'pending' ? 'pending' : 'not-started')
        },
        {
            label: 'Phone Verification',
            icon: <PhoneIcon />,
            status: verificationStatus?.phone?.verified ? 'completed' : (verificationStatus?.phone?.status === 'pending' ? 'pending' : 'not-started')
        },
        {
            label: 'ID Document Verification',
            icon: <BadgeIcon />,
            status: verificationStatus?.id?.verified ? 'completed' : (verificationStatus?.id?.status === 'pending' ? 'pending' : 'not-started')
        },
        {
            label: 'Photo Verification',
            icon: <PhotoIcon />,
            status: verificationStatus?.photo?.verified ? 'completed' : (verificationStatus?.photo?.status === 'pending' ? 'pending' : 'not-started')
        }
    ];

    useEffect(() => {
        dispatch(getVerificationStatus());
    }, [dispatch]);

    // Move the active step automatically to the first incomplete step
    useEffect(() => {
        if (!verificationStatus) return;
        if (!verificationStatus?.email?.verified) {
            setActiveStep(0);
            return;
        }
        if (!verificationStatus?.phone?.verified) {
            setActiveStep(1);
            return;
        }
        if (!verificationStatus?.id?.verified) {
            setActiveStep(2);
            return;
        }
        setActiveStep(3);
    }, [verificationStatus]);

    const handleSendEmailVerification = async () => {
        try {
            await dispatch(sendEmailVerification()).unwrap();
            showSuccess('Verification email sent! Please check your inbox.');
            setActiveStep(0);
        } catch (error) {
            showError(error || 'Failed to send verification email');
        }
    };

    const handleVerifyEmail = async () => {
        if (!emailOtp.trim()) {
            showError('Please enter the verification code');
            return;
        }
        
        try {
            await dispatch(confirmEmailVerification({ code: emailOtp })).unwrap();
            showSuccess('Email verified successfully!');
            setEmailOtp('');
            setActiveStep(1);
        } catch (error) {
            showError(error || 'Invalid verification code');
        }
    };

    const handleSendPhoneVerification = async () => {
        try {
            await dispatch(sendPhoneVerification()).unwrap();
            showSuccess('Verification SMS sent! Please check your phone.');
            setActiveStep(1);
            dispatch(getVerificationStatus());
        } catch (error) {
            showError(error || 'Failed to send verification SMS');
        }
    };

    const handleVerifyPhone = async () => {
        if (!phoneOtp.trim()) {
            showError('Please enter the verification code');
            return;
        }
        
        try {
            await dispatch(confirmPhoneVerification({ code: phoneOtp })).unwrap();
            showSuccess('Phone verified successfully!');
            setPhoneOtp('');
            setActiveStep(2);
            dispatch(getVerificationStatus());
        } catch (error) {
            showError(error || 'Invalid verification code');
        }
    };

    const handleUploadDocument = (type) => {
        setUploadType(type);
        setUploadDialogOpen(true);
        setSelectedFile(null);
        setPreviewUrl('');
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleUploadSubmit = async () => {
        if (!selectedFile) {
            showError('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        if (uploadType === 'idDocument') {
            // Backend expects frontImage (required) and optional backImage, plus documentType & documentNumber
            formData.append('frontImage', selectedFile);
            formData.append('documentType', 'Aadhaar');
            formData.append('documentNumber', 'TEST1234');
        } else if (uploadType === 'photo') {
            // Backend expects field name "photos" (array)
            formData.append('photos', selectedFile);
        }

        try {
            if (uploadType === 'idDocument') {
                await dispatch(uploadIdVerification(formData)).unwrap();
                showSuccess('ID document uploaded successfully!');
            } else if (uploadType === 'photo') {
                await dispatch(uploadVerificationPhotos(formData)).unwrap();
                showSuccess('Photo uploaded successfully!');
            }
            
            setUploadDialogOpen(false);
            setSelectedFile(null);
            setPreviewUrl('');
            setUploadType('');
            
            // Move to next step if not the last step
            if (activeStep < verificationSteps.length - 1) {
                setActiveStep(activeStep + 1);
            }
        } catch (error) {
            showError(error || 'Failed to upload file');
        }
    };

    const handleResendCode = async (type) => {
        try {
            if (type === 'email') {
                await dispatch(sendEmailVerification()).unwrap();
                showSuccess('Email verification code resent!');
            } else if (type === 'phone') {
                await dispatch(sendPhoneVerification()).unwrap();
                showSuccess('Phone verification code resent!');
            }
        } catch (error) {
            showError(error || 'Failed to resend code');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'failed': return 'error';
            default: return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckIcon />;
            case 'pending': return <CircularProgress size={16} />;
            case 'failed': return <ErrorIcon />;
            default: return null;
        }
    };

    const renderEmailVerification = () => (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Email Verification
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Verify your email address to secure your account and receive important notifications.
            </Typography>
            
            {verificationStatus?.email?.verified ? (
                <Alert severity="success" sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckIcon sx={{ mr: 1 }} />
                        Email verified successfully!
                    </Box>
                </Alert>
            ) : verificationStatus?.email?.pending ? (
                <Box>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Verification email sent! Please check your inbox and enter the code below.
                    </Alert>
                    <TextField
                        fullWidth
                        label="Enter verification code"
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value)}
                        sx={{ mb: 2 }}
                        placeholder="Enter 6-digit code"
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={handleVerifyEmail}
                            disabled={loading}
                            startIcon={<CheckIcon />}
                        >
                            Verify Email
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => handleResendCode('email')}
                            disabled={loading}
                            startIcon={<SendIcon />}
                        >
                            Resend Code
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Button
                    variant="contained"
                    onClick={handleSendEmailVerification}
                    disabled={loading}
                    startIcon={<SendIcon />}
                >
                    Send Verification Email
                </Button>
            )}
        </Box>
    );

    const renderPhoneVerification = () => (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Phone Verification
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Verify your phone number to enable SMS notifications and enhance account security.
            </Typography>
            
            {verificationStatus?.phone?.verified ? (
                <Alert severity="success" sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckIcon sx={{ mr: 1 }} />
                        Phone verified successfully!
                    </Box>
                </Alert>
            ) : verificationStatus?.phone?.status === 'pending' ? (
                <Box>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Verification SMS sent! Please check your phone and enter the code below.
                    </Alert>
                    <TextField
                        fullWidth
                        label="Enter verification code"
                        value={phoneOtp}
                        onChange={(e) => setPhoneOtp(e.target.value)}
                        sx={{ mb: 2 }}
                        placeholder="Enter 6-digit code"
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={handleVerifyPhone}
                            disabled={loading}
                            startIcon={<CheckIcon />}
                        >
                            Verify Phone
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => handleResendCode('phone')}
                            disabled={loading}
                            startIcon={<SendIcon />}
                        >
                            Resend Code
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Button
                    variant="contained"
                    onClick={handleSendPhoneVerification}
                    disabled={loading}
                    startIcon={<SendIcon />}
                >
                    Send Verification SMS
                </Button>
            )}
        </Box>
    );

    const renderIdDocumentVerification = () => (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                ID Document Verification
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload a clear photo of your government-issued ID (Aadhaar, Passport, Driving License, or Voter ID).
            </Typography>
            
            {verificationStatus?.id?.verified ? (
                <Alert severity="success" sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckIcon sx={{ mr: 1 }} />
                        ID document verified successfully!
                    </Box>
                </Alert>
            ) : verificationStatus?.id?.status === 'pending' ? (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={16} sx={{ mr: 1 }} />
                        Your ID document is under review. This may take 1-2 business days.
                    </Box>
                </Alert>
            ) : (
                <Box>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Please ensure your ID document is clearly visible and all text is readable.
                    </Alert>
                    <Button
                        variant="contained"
                        onClick={() => handleUploadDocument('idDocument')}
                        disabled={loading}
                        startIcon={<UploadIcon />}
                    >
                        Upload ID Document
                    </Button>
                </Box>
            )}
        </Box>
    );

    const renderPhotoVerification = () => (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Photo Verification
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload a clear selfie to verify your identity. This helps build trust with other members.
            </Typography>
            
            {verificationStatus?.photo?.verified ? (
                <Alert severity="success" sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckIcon sx={{ mr: 1 }} />
                        Photo verified successfully!
                    </Box>
                </Alert>
            ) : verificationStatus?.photo?.pending ? (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={16} sx={{ mr: 1 }} />
                        Your photo is under review. This may take 1-2 business days.
                    </Box>
                </Alert>
            ) : (
                <Box>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Please ensure your face is clearly visible and well-lit in the photo.
                    </Alert>
                    <Button
                        variant="contained"
                        onClick={() => handleUploadDocument('photo')}
                        disabled={loading}
                        startIcon={<UploadIcon />}
                    >
                        Upload Verification Photo
                    </Button>
                </Box>
            )}
        </Box>
    );

    const renderStepContent = (stepIndex) => {
        switch (stepIndex) {
            case 0: return renderEmailVerification();
            case 1: return renderPhoneVerification();
            case 2: return renderIdDocumentVerification();
            case 3: return renderPhotoVerification();
            default: return null;
        }
    };

    const getCompletedSteps = () => {
        return verificationSteps.filter(step => step.status === 'completed').length;
    };

    const getTotalSteps = () => verificationSteps.length;

    return (
        <Box sx={{ py: 4 }}>
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h4" gutterBottom sx={{ color: '#51365F', fontWeight: 'bold' }}>
                            Account Verification
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                            Complete your profile verification to build trust and unlock premium features
                        </Typography>
                        
                        {/* Progress Bar */}
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Verification Progress
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {getCompletedSteps()} of {getTotalSteps()} completed
                                </Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={(getCompletedSteps() / getTotalSteps()) * 100}
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                        </Box>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Stepper activeStep={activeStep} orientation="vertical">
                        {verificationSteps.map((step, index) => (
                            <Step key={step.label}>
                                <StepLabel
                                    StepIconComponent={() => (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Chip
                                                icon={getStatusIcon(step.status)}
                                                label={step.label}
                                                color={getStatusColor(step.status)}
                                                variant="outlined"
                                                sx={{ minWidth: 200 }}
                                            />
                                        </Box>
                                    )}
                                >
                                    {step.label}
                                </StepLabel>
                                <StepContent>
                                    {renderStepContent(index)}
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>

                    {/* Upload Dialog */}
                    <Dialog
                        open={uploadDialogOpen}
                        onClose={() => setUploadDialogOpen(false)}
                        maxWidth="sm"
                        fullWidth
                    >
                        <DialogTitle>
                            Upload {uploadType === 'idDocument' ? 'ID Document' : 'Verification Photo'}
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ mb: 2 }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    style={{ display: 'none' }}
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload">
                                    <Button
                                        variant="outlined"
                                        component="span"
                                        startIcon={<UploadIcon />}
                                        fullWidth
                                        sx={{ mb: 2 }}
                                    >
                                        Choose File
                                    </Button>
                                </label>
                            </Box>
                            
                            {selectedFile && (
                                <Box>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Selected: {selectedFile.name}
                                    </Typography>
                                    {previewUrl && (
                                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: 200,
                                                    borderRadius: 8
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setUploadDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUploadSubmit}
                                variant="contained"
                                disabled={!selectedFile || loading}
                                startIcon={<UploadIcon />}
                            >
                                {loading ? <CircularProgress size={20} /> : 'Upload'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Paper>
            </Container>
        </Box>
    );
};

export default VerificationPage;
