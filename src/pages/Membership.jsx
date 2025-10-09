import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Divider,
    Switch,
    FormControlLabel,
    useTheme,
    useMediaQuery,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Alert
} from '@mui/material';
import {
    CheckCircle as CheckIcon,
    Favorite as FavoriteIcon,
    Star as StarIcon,
    EmojiEvents as TrophyIcon,
    Security as SecurityIcon,
    Chat as ChatIcon,
    Visibility as VisibilityIcon,
    PersonSearch as SearchIcon,
    Cancel as CancelIcon,
    CheckCircleOutline as ActiveIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    getSubscriptionPlans,
    createSubscription,
    getSubscriptionStatus,
    cancelSubscription,
    createPaymentIntent,
    confirmPayment
} from '../store/slices/subscriptionSlice';
import { showSuccess, showError } from '../utils/toast';
// Removed Stripe Elements imports as we're using hosted checkout

const Membership = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [yearlyBilling, setYearlyBilling] = useState(true);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedPlanForCancel, setSelectedPlanForCancel] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const navigate = useNavigate();

    const { 
        plans, 
        currentSubscription, 
        loading, 
        error,
        subscriptionStatus 
    } = useSelector(state => state.subscription);

    console.log('Membership component - plans:', plans);
    console.log('Membership component - loading:', loading);
    console.log('Membership component - error:', error);

    const features = [
        {
            icon: <SearchIcon sx={{ color: '#51365F' }} />,
            title: 'Advanced Search',
            description: 'Filter matches by education, profession, interests, and more'
        },
        {
            icon: <SecurityIcon sx={{ color: '#51365F' }} />,
            title: 'Privacy Control',
            description: 'Control who sees your photos and contact information'
        },
        {
            icon: <ChatIcon sx={{ color: '#51365F' }} />,
            title: 'Unlimited Messaging',
            description: 'Connect directly with your matches without restrictions'
        },
        {
            icon: <VisibilityIcon sx={{ color: '#51365F' }} />,
            title: 'Profile Visibility',
            description: 'Get featured in search results and increase your chances'
        },
        {
            icon: <TrophyIcon sx={{ color: '#51365F' }} />,
            title: 'Priority Support',
            description: 'Get dedicated assistance for your matchmaking journey'
        },
        {
            icon: <FavoriteIcon sx={{ color: '#51365F' }} />,
            title: 'Smart Matching',
            description: 'Our algorithm suggests highly compatible matches daily'
        }
    ];

    useEffect(() => {
        console.log('Fetching subscription plans with duration:', yearlyBilling ? "yearly" : "monthly");
        dispatch(getSubscriptionPlans({ duration: yearlyBilling ? "yearly" : "monthly" }));
        dispatch(getSubscriptionStatus());
    }, [dispatch, yearlyBilling]);

    const handleChoosePlan = async (plan) => {
        if (plan.planType === 'free') {
            // Handle free plan directly
            handleFreePlan(plan._id);
        } else {
            // Redirect to Stripe checkout for paid plans
            handlePaidPlan(plan);
        }
    };

    const handleFreePlan = async (planId) => {
        try {
            await dispatch(createSubscription({ planId })).unwrap();
            showSuccess('Free plan activated successfully!');
            dispatch(getSubscriptionStatus()); // Refresh status
        } catch (error) {
            showError(error || 'Failed to activate free plan');
        }
    };

    const handlePaidPlan = async (plan) => {
        try {
            setPaymentLoading(true);
            const result = await dispatch(createSubscription({ planId: plan._id })).unwrap();
            
            if (result.url) {
                // Redirect to Stripe checkout page
                window.location.href = result.url;
            } else {
                showError('Failed to create checkout session');
            }
        } catch (error) {
            showError(error || 'Failed to initiate payment');
            setPaymentLoading(false);
        }
    };

    const handleCancelSubscription = async () => {
        if (!selectedPlanForCancel) return;
        
        try {
            await dispatch(cancelSubscription()).unwrap();
            showSuccess('Subscription cancelled successfully');
            setCancelDialogOpen(false);
            setSelectedPlanForCancel(null);
            dispatch(getSubscriptionStatus()); // Refresh status
        } catch (error) {
            showError(error || 'Failed to cancel subscription');
        }
    };

    const openCancelDialog = (subscription) => {
        setSelectedPlanForCancel(subscription);
        setCancelDialogOpen(true);
    };

    const getButtonText = (plan) => {
        if (currentSubscription && currentSubscription.planId === plan._id) {
            return currentSubscription.status === 'active' ? 'Current Plan' : 'Expired';
        }
        const buttonTextMap = { Basic: "Get Started", Premium: "Choose Premium", Elite: "Go Elite" };
        return buttonTextMap[plan?.name] || "Subscribe";
    };

    const getButtonColor = (plan) => {
        if (currentSubscription && currentSubscription.planId === plan._id) {
            return currentSubscription.status === 'active' ? '#4caf50' : '#ff9800';
        }
        const colorMap = { Basic: "#9c27b0", Premium: "#51365F", Elite: "#ff6f00" };
        return colorMap[plan?.name] || "#37474f";
    };

    const isCurrentPlan = (plan) => {
        return currentSubscription && currentSubscription.planId === plan._id && currentSubscription.status === 'active';
    };

    const canCancel = (plan) => {
        return currentSubscription && currentSubscription.planId === plan._id && 
               currentSubscription.status === 'active' && 
               currentSubscription.autoRenew === true;
    };

    // No payment form needed - using Stripe hosted checkout


    return (
        <Box sx={{ py: 8 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Container maxWidth="xl">
                    <Box textAlign="center" mb={6}>
                        <Typography variant="h2" component="h1" gutterBottom sx={{ color: '#51365F', fontStyle: 'italic', fontWeight: 800, mb: 2 }}>
                            Find Your Perfect Match
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'black', maxWidth: '600px', margin: '0 auto', mb: 3 }}>
                            Choose the membership plan that works best for your journey to finding a life partner
                        </Typography>

                        {/* Billing Toggle */}
                        <Paper elevation={2} sx={{ display: 'inline-flex', alignItems: 'center', p: 1, borderRadius: 4 }}>
                            <Typography sx={{ color: yearlyBilling ? '#888' : '#51365F', fontWeight: yearlyBilling ? 400 : 600 }}>
                                Monthly
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={yearlyBilling}
                                        onChange={() => setYearlyBilling(!yearlyBilling)}
                                        sx={{
                                            m: 1,
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#51365F',
                                            },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: '#ff80ab',
                                            },
                                        }}
                                    />
                                }
                                label=""
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ color: yearlyBilling ? '#51365F' : '#888', fontWeight: yearlyBilling ? 600 : 400 }}>
                                    Yearly
                                </Typography>
                                <Box sx={{ ml: 1, background: '#4caf50', color: 'white', fontSize: '12px', px: 1, py: 0.5, borderRadius: 2 }}>
                                    Save 20%
                                </Box>
                            </Box>
                        </Paper>
                    </Box>

                    {/* Current Subscription Status */}
                    {currentSubscription && (
                        <Box sx={{ mb: 4 }}>
                            <Alert 
                                severity={currentSubscription.status === 'active' ? 'success' : 'warning'} 
                                sx={{ mb: 2 }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            Current Plan: {plans?.find(p => p._id === currentSubscription.planId)?.name || 'Unknown'}
                                        </Typography>
                                        <Typography variant="body2">
                                            Status: {currentSubscription.status} | 
                                            Expires: {new Date(currentSubscription.endDate).toLocaleDateString()} |
                                            Auto-renewal: {currentSubscription.autoRenew ? 'Enabled' : 'Disabled'}
                                        </Typography>
                                    </Box>
                                    {canCancel(currentSubscription) && (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<CancelIcon />}
                                            onClick={() => openCancelDialog(currentSubscription)}
                                        >
                                            Cancel Subscription
                                        </Button>
                                    )}
                                </Box>
                            </Alert>
                        </Box>
                    )}

                    {/* Pricing Plans */}
                    {plans?.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h5" sx={{ color: '#51365F', mb: 2 }}>
                                No plans available for {yearlyBilling ? 'yearly' : 'monthly'} billing
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'gray' }}>
                                Please try switching to {yearlyBilling ? 'monthly' : 'yearly'} billing or contact support.
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3} justifyContent="center" sx={{ mb: 10 }}>
                            {plans?.map((plan, index) => {
                            const colorMap = { Basic: "#9c27b0", Premium: "#51365F", Elite: "#ff6f00" };
                            const planColor = colorMap[plan?.name] || "#37474f";
                            const buttonColor = getButtonColor(plan);
                            const buttonText = getButtonText(plan);
                            const isCurrent = isCurrentPlan(plan);
                            
                            return (
                                <Grid item xs={12} md={4} key={index}>
                                    <Card
                                        elevation={plan?.popular ? 8 : 3}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            position: 'relative',
                                            overflow: 'visible',
                                            border: isCurrent ? '2px solid #4caf50' : plan?.popular ? `2px solid ${planColor}` : '2px solid transparent',
                                            transition: 'transform 0.3s, box-shadow 0.3s',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: 6
                                            }
                                        }}
                                    >
                                        {plan?.popular && !isCurrent && (
                                            <Box sx={{ position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)', background: planColor, color: 'white', px: 3, py: 0.5, borderRadius: 2, fontSize: '14px', fontWeight: 'bold' }}>
                                                MOST POPULAR
                                            </Box>
                                        )}
                                        
                                        {isCurrent && (
                                            <Box sx={{ position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)', background: '#4caf50', color: 'white', px: 3, py: 0.5, borderRadius: 2, fontSize: '14px', fontWeight: 'bold' }}>
                                                <ActiveIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                CURRENT
                                            </Box>
                                        )}

                                        <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="h5" component="h2" sx={{ color: planColor, fontWeight: 700 }}>
                                                    {plan?.name}
                                                </Typography>
                                                {isCurrent && (
                                                    <Chip 
                                                        label="Active" 
                                                        color="success" 
                                                        size="small" 
                                                        icon={<ActiveIcon />}
                                                    />
                                                )}
                                            </Box>
                                            
                                            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                                                <Typography variant="h4" component="div" sx={{ fontWeight: 800, color: '#37474f' }}>
                                                    ₹{plan?.price}
                                                </Typography>
                                                <Typography variant="h6" component="div" sx={{ color: 'text.secondary', ml: 1 }}>
                                                    /{plan?.duration}
                                                </Typography>
                                            </Box>
                                            
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                                {plan?.description}
                                            </Typography>

                                            <List dense sx={{ mb: 2, flexGrow: 1 }}>
                                                {plan?.features.map((feature, idx) => (
                                                    <ListItem key={idx} sx={{ px: 0 }}>
                                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                                            <CheckIcon sx={{ color: planColor }} />
                                                        </ListItemIcon>
                                                        <ListItemText primary={feature} />
                                                    </ListItem>
                                                ))}
                                            </List>

                                            <Button
                                                variant="contained"
                                                fullWidth
                                                size="large"
                                                disabled={isCurrent || paymentLoading}
                                                sx={{
                                                    mt: 'auto',
                                                    py: 1.5,
                                                    borderRadius: 2,
                                                    background: `linear-gradient(135deg, ${buttonColor} 0%, ${buttonColor}80 100%)`,
                                                    fontWeight: 'bold',
                                                    fontSize: '1.1rem',
                                                    '&:hover': {
                                                        background: `linear-gradient(135deg, ${buttonColor} 0%, ${buttonColor}60 100%)`,
                                                    },
                                                    '&:disabled': {
                                                        background: '#e0e0e0',
                                                        color: '#9e9e9e'
                                                    }
                                                }}
                                                onClick={() => !isCurrent && handleChoosePlan(plan)}
                                            >
                                                {buttonText}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                        </Grid>
                    )}

                    {/* Features Section */}
                    <Box sx={{ mb: 10 }}>
                        <Typography variant="h3" align="center" gutterBottom sx={{ color: '#51365F', fontStyle: 'italic', mb: 1, fontWeight: 700 }}>
                            Premium Features
                        </Typography>
                        <Typography variant="h6" align="center" sx={{ color: 'black', maxWidth: '700px', margin: '0 auto', mb: 5 }}>
                            Our membership plans include powerful features to help you find your perfect match
                        </Typography>
                        <Typography variant="body2" align="center" sx={{ color: 'gray', mb: 2 }}>
                            Debug: Found {plans?.length || 0} plans for {yearlyBilling ? 'yearly' : 'monthly'} billing
                        </Typography>

                        <Grid container spacing={4} justifyContent="center">
                            {features?.map((feature, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Card
                                        sx={{
                                            p: 3,
                                            width: '280px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            borderRadius: 3,
                                            background: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                                            transition: 'all 0.3s ease',
                                            border: '1px solid rgba(216, 27, 96, 0.1)',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                boxShadow: '0 15px 35px rgba(216, 27, 96, 0.15)'
                                            }
                                        }}
                                    >
                                        <Box sx={{
                                            fontSize: 50,
                                            mb: 4,
                                            width: 80,
                                            height: 80,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, rgba(216, 27, 96, 0.1) 0%, rgba(136, 14, 79, 0.05) 100%)'
                                        }}>
                                            {feature.icon}
                                        </Box>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#37474f', mb: 2 }}>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#78909c', lineHeight: 1.6 }}>
                                            {feature.description}
                                        </Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* FAQ Section */}
                    <Box sx={{ background: 'white', borderRadius: 4, p: 5, boxShadow: 3 }}>
                        <Typography variant="h3" align="center" gutterBottom sx={{
                            color: '#51365F',
                            fontStyle: 'italic', mb: 1, fontWeight: 700
                        }}>
                            Frequently Asked Questions
                        </Typography>
                        <Typography variant="h6" align="center" sx={{ color: '#555', maxWidth: '700px', margin: '0 auto', mb: 5 }}>
                            Everything you need to know about our membership plans
                        </Typography>

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom sx={{ color: '#51365F' }}>
                                    Can I change my plan later?
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#78909c', mb: 3 }}>
                                    Yes, you can upgrade or downgrade your plan at any time. When upgrading, the new rate will be applied immediately. When downgrading, the change will take effect at the end of your current billing cycle.
                                </Typography>

                                <Typography variant="h6" gutterBottom sx={{ color: '#51365F' }}>
                                    Is my payment information secure?
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#78909c', mb: 3 }}>
                                    Absolutely. We use industry-standard encryption to protect your payment information. We don't store your credit card details on our servers.
                                </Typography>

                                <Typography variant="h6" gutterBottom sx={{ color: '#51365F' }}>
                                    How do I cancel my subscription?
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#78909c' }}>
                                    You can cancel your subscription at any time from your account settings. After cancellation, you'll still have access to premium features until the end of your billing period.
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom sx={{ color: '#51365F' }}>
                                    What payment methods do you accept?
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#78909c', mb: 3 }}>
                                    We accept all major credit cards, debit cards, UPI payments, and net banking. All payments are processed through secure payment gateways.
                                </Typography>

                                <Typography variant="h6" gutterBottom sx={{ color: '#51365F' }}>
                                    Do you offer refunds?
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#78909c', mb: 3 }}>
                                    We offer a 7-day money-back guarantee for all annual plans. If you're not satisfied with our service, you can request a full refund within 7 days of purchase.
                                </Typography>

                                <Typography variant="h6" gutterBottom sx={{ color: '#51365F' }}>
                                    Are there any hidden fees?
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#78909c' }}>
                                    No, there are no hidden fees. The price you see is what you pay. All taxes are included in the displayed price.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Final CTA */}
                    <Box textAlign="center" sx={{ mt: 8 }}>
                        <Typography variant="h4" gutterBottom sx={{
                            color: '#51365F',
                            fontStyle: 'italic', fontWeight: 700
                        }}>
                            Ready to Find Your Life Partner?
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'black', maxWidth: '600px', margin: '0 auto', mb: 4 }}>
                            Join thousands of successful couples who found their perfect match through Bandhan Match
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                px: 5,
                                py: 1.5,
                                borderRadius: 3,
                                background: '#51365F',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)',
                                }
                            }}
                        >
                            Get Started Today
                        </Button>
                    </Box>
                </Container>
            )}

            {/* Cancel Subscription Dialog */}
            <Dialog 
                open={cancelDialogOpen} 
                onClose={() => setCancelDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ color: '#51365F', fontWeight: 'bold' }}>
                    Cancel Subscription
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Are you sure you want to cancel your subscription to{' '}
                        <strong>{plans?.find(p => p._id === selectedPlanForCancel?.planId)?.name || 'this plan'}</strong>?
                    </Typography>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                            • Your subscription will remain active until {new Date(selectedPlanForCancel?.endDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                            • You'll lose access to premium features after the current billing period
                        </Typography>
                        <Typography variant="body2">
                            • You can reactivate your subscription anytime before it expires
                        </Typography>
                    </Alert>
                    <Typography variant="body2" color="text.secondary">
                        This action cannot be undone. Are you sure you want to proceed?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button 
                        onClick={() => setCancelDialogOpen(false)}
                        variant="outlined"
                        sx={{ mr: 1 }}
                    >
                        Keep Subscription
                    </Button>
                    <Button 
                        onClick={handleCancelSubscription}
                        variant="contained"
                        color="error"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={20} /> : 'Yes, Cancel Subscription'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* No payment dialog needed - using Stripe hosted checkout */}
        </Box>
    );
};

export default Membership;