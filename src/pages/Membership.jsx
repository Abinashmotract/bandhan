import React, { useState } from 'react';
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
    useMediaQuery
} from '@mui/material';
import {
    CheckCircle as CheckIcon,
    Favorite as FavoriteIcon,
    Star as StarIcon,
    EmojiEvents as TrophyIcon,
    Security as SecurityIcon,
    Chat as ChatIcon,
    Visibility as VisibilityIcon,
    PersonSearch as SearchIcon
} from '@mui/icons-material';

const Membership = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [yearlyBilling, setYearlyBilling] = useState(true);

    const plans = [
        {
            name: 'Basic',
            price: yearlyBilling ? '₹999/year' : '₹99/month',
            description: 'For those starting their journey to find a life partner',
            popular: false,
            features: [
                'Create a detailed profile',
                'Browse limited profiles',
                'Send 5 interests per month',
                'Basic match suggestions',
                'Standard customer support'
            ],
            buttonText: 'Get Started',
            color: '#9c27b0'
        },
        {
            name: 'Premium',
            price: yearlyBilling ? '₹2,999/year' : '₹299/month',
            description: 'Our most popular plan for serious seekers',
            popular: true,
            features: [
                'All Basic features',
                'Unlimited profile browsing',
                'Unlimited interests',
                'Priority listing in search',
                'Advanced matchmaking algorithm',
                'See who viewed your profile',
                'Priority customer support',
                'Verified profile badge'
            ],
            buttonText: 'Choose Premium',
            color: '#d81b60'
        },
        {
            name: 'Elite',
            price: yearlyBilling ? '₹4,999/year' : '₹499/month',
            description: 'For those seeking exclusive matchmaking services',
            popular: false,
            features: [
                'All Premium features',
                'Personalized matchmaking assistant',
                'Profile highlighting',
                'Direct contact details access',
                'Background verification included',
                'Compatibility analysis report',
                'Dedicated relationship manager',
                'Exclusive events access'
            ],
            buttonText: 'Go Elite',
            color: '#ff6f00'
        }
    ];

    const features = [
        {
            icon: <SearchIcon sx={{ color: '#d81b60' }} />,
            title: 'Advanced Search',
            description: 'Filter matches by education, profession, interests, and more'
        },
        {
            icon: <SecurityIcon sx={{ color: '#d81b60' }} />,
            title: 'Privacy Control',
            description: 'Control who sees your photos and contact information'
        },
        {
            icon: <ChatIcon sx={{ color: '#d81b60' }} />,
            title: 'Unlimited Messaging',
            description: 'Connect directly with your matches without restrictions'
        },
        {
            icon: <VisibilityIcon sx={{ color: '#d81b60' }} />,
            title: 'Profile Visibility',
            description: 'Get featured in search results and increase your chances'
        },
        {
            icon: <TrophyIcon sx={{ color: '#d81b60' }} />,
            title: 'Priority Support',
            description: 'Get dedicated assistance for your matchmaking journey'
        },
        {
            icon: <FavoriteIcon sx={{ color: '#d81b60' }} />,
            title: 'Smart Matching',
            description: 'Our algorithm suggests highly compatible matches daily'
        }
    ];

    return (
        <Box sx={{ py: 8 }}>
            <Container maxWidth="xl">
                {/* Header Section */}
                <Box textAlign="center" mb={6}>
                    <Typography
                        variant="h2"
                        component="h1"
                        gutterBottom
                        sx={{
                            color: '#d81b60',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 2
                        }}
                    >
                        Find Your Perfect Match
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'white', maxWidth: '600px', margin: '0 auto', mb: 3 }}>
                        Choose the membership plan that works best for your journey to finding a life partner
                    </Typography>

                    {/* Billing Toggle */}
                    <Paper elevation={2} sx={{ display: 'inline-flex', alignItems: 'center', p: 1, borderRadius: 4 }}>
                        <Typography sx={{ color: yearlyBilling ? '#888' : '#d81b60', fontWeight: yearlyBilling ? 400 : 600 }}>
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
                                            color: '#d81b60',
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
                            <Typography sx={{ color: yearlyBilling ? '#d81b60' : '#888', fontWeight: yearlyBilling ? 600 : 400 }}>
                                Yearly
                            </Typography>
                            <Box
                                sx={{
                                    ml: 1,
                                    background: '#4caf50',
                                    color: 'white',
                                    fontSize: '12px',
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 2
                                }}
                            >
                                Save 20%
                            </Box>
                        </Box>
                    </Paper>
                </Box>

                {/* Pricing Plans */}
                <Grid container spacing={3} justifyContent="center" sx={{ mb: 10 }}>
                    {plans.map((plan, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card
                                elevation={plan.popular ? 8 : 3}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    overflow: 'visible',
                                    border: plan.popular ? `2px solid ${plan.color}` : '2px solid transparent',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: 6
                                    }
                                }}
                            >
                                {plan.popular && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: -15,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            background: plan.color,
                                            color: 'white',
                                            px: 3,
                                            py: 0.5,
                                            borderRadius: 2,
                                            fontSize: '14px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        MOST POPULAR
                                    </Box>
                                )}

                                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="h5" component="h2" gutterBottom sx={{ color: plan.color, fontWeight: 700 }}>
                                        {plan.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                                        <Typography variant="h4" component="div" sx={{ fontWeight: 800, color: '#37474f' }}>
                                            {plan.price.split('/')[0]}
                                        </Typography>
                                        <Typography variant="h6" component="div" sx={{ color: 'text.secondary', ml: 1 }}>
                                            /{plan.price.split('/')[1]}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        {plan.description}
                                    </Typography>

                                    <List dense sx={{ mb: 2, flexGrow: 1 }}>
                                        {plan.features.map((feature, idx) => (
                                            <ListItem key={idx} sx={{ px: 0 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <CheckIcon sx={{ color: plan.color }} />
                                                </ListItemIcon>
                                                <ListItemText primary={feature} />
                                            </ListItem>
                                        ))}
                                    </List>

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        sx={{
                                            mt: 'auto',
                                            py: 1.5,
                                            borderRadius: 2,
                                            background: `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}80 100%)`,
                                            fontWeight: 'bold',
                                            fontSize: '1.1rem',
                                            '&:hover': {
                                                background: `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}60 100%)`,
                                            }
                                        }}
                                    >
                                        {plan.buttonText}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Features Section */}
                <Box sx={{ mb: 10 }}>
                    <Typography variant="h3" align="center" gutterBottom sx={{ color: '#d81b60', mb: 1, fontWeight: 700 }}>
                        Premium Features
                    </Typography>
                    <Typography variant="h6" align="center" sx={{ color: 'white', maxWidth: '700px', margin: '0 auto', mb: 5 }}>
                        Our membership plans include powerful features to help you find your perfect match
                    </Typography>

                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card
                                    sx={{
                                        p: 3,
                                        width: '250px',
                                        height: '100%',
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
                    <Typography variant="h3" align="center" gutterBottom sx={{ color: '#d81b60', mb: 1, fontWeight: 700 }}>
                        Frequently Asked Questions
                    </Typography>
                    <Typography variant="h6" align="center" sx={{ color: '#555', maxWidth: '700px', margin: '0 auto', mb: 5 }}>
                        Everything you need to know about our membership plans
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#d81b60' }}>
                                Can I change my plan later?
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#78909c', mb: 3 }}>
                                Yes, you can upgrade or downgrade your plan at any time. When upgrading, the new rate will be applied immediately. When downgrading, the change will take effect at the end of your current billing cycle.
                            </Typography>

                            <Typography variant="h6" gutterBottom sx={{ color: '#d81b60' }}>
                                Is my payment information secure?
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#78909c', mb: 3 }}>
                                Absolutely. We use industry-standard encryption to protect your payment information. We don't store your credit card details on our servers.
                            </Typography>

                            <Typography variant="h6" gutterBottom sx={{ color: '#d81b60' }}>
                                How do I cancel my subscription?
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#78909c' }}>
                                You can cancel your subscription at any time from your account settings. After cancellation, you'll still have access to premium features until the end of your billing period.
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#d81b60' }}>
                                What payment methods do you accept?
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#78909c', mb: 3 }}>
                                We accept all major credit cards, debit cards, UPI payments, and net banking. All payments are processed through secure payment gateways.
                            </Typography>

                            <Typography variant="h6" gutterBottom sx={{ color: '#d81b60' }}>
                                Do you offer refunds?
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#78909c', mb: 3 }}>
                                We offer a 7-day money-back guarantee for all annual plans. If you're not satisfied with our service, you can request a full refund within 7 days of purchase.
                            </Typography>

                            <Typography variant="h6" gutterBottom sx={{ color: '#d81b60' }}>
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
                    <Typography variant="h4" gutterBottom sx={{ color: '#d81b60', fontWeight: 700 }}>
                        Ready to Find Your Life Partner?
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#555', maxWidth: '600px', margin: '0 auto', mb: 4 }}>
                        Join thousands of successful couples who found their perfect match through Bandhan Match
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            px: 5,
                            py: 1.5,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
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
        </Box>
    );
};

export default Membership;