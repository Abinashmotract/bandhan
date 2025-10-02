import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import {
  Check as CheckIcon,
  Star as StarIcon,
  Diamond as DiamondIcon,
  Crown as CrownIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise, STRIPE_CONFIG } from '../utils/stripe';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useDispatch } from 'react-redux';
import { createPaymentIntent, confirmPayment } from '../store/slices/subscriptionSlice';
import toast from 'react-hot-toast';

const PaymentForm = ({ plan, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create payment intent
      const paymentIntentResult = await dispatch(createPaymentIntent(plan._id));
      
      if (paymentIntentResult.payload.success) {
        const { client_secret } = paymentIntentResult.payload.data;
        
        // Confirm payment with Stripe
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: 'BandhanM User',
            },
          }
        });

        if (stripeError) {
          setError(stripeError.message);
        } else if (paymentIntent.status === 'succeeded') {
          // Confirm payment on backend
          const confirmResult = await dispatch(confirmPayment({
            paymentIntentId: paymentIntent.id,
            planId: plan._id
          }));

          if (confirmResult.payload.success) {
            toast.success('Subscription activated successfully!');
            onSuccess();
          } else {
            setError(confirmResult.payload.message || 'Payment confirmation failed');
          }
        }
      } else {
        setError(paymentIntentResult.payload.message || 'Payment intent creation failed');
      }
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#000' }}>
          Payment Information
        </Typography>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!stripe || loading}
          sx={{
            background: 'linear-gradient(135deg, #d81b60 0%, #ad1457 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #ad1457 0%, #880e4f 100%)',
            },
          }}
        >
          {loading ? <CircularProgress size={24} /> : `Pay ₹${plan.price}`}
        </Button>
      </Box>
    </form>
  );
};

const SubscriptionUpgradeModal = () => {
  const {
    upgradeModalOpen,
    closeUpgradeModal,
    plans,
    selectedPlan,
    currentSubscription,
    loading
  } = useSubscription();

  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState(null);

  const getPlanIcon = (planName) => {
    switch (planName) {
      case 'Basic': return <LockIcon sx={{ color: '#9c27b0' }} />;
      case 'Entry': return <StarIcon sx={{ color: '#d81b60' }} />;
      case 'Advanced': return <DiamondIcon sx={{ color: '#ff6f00' }} />;
      case 'Premium': return <CrownIcon sx={{ color: '#4caf50' }} />;
      case 'Elite': return <CrownIcon sx={{ color: '#ff9800' }} />;
      default: return <StarIcon />;
    }
  };

  const getPlanColor = (planName) => {
    switch (planName) {
      case 'Basic': return '#9c27b0';
      case 'Entry': return '#d81b60';
      case 'Advanced': return '#ff6f00';
      case 'Premium': return '#4caf50';
      case 'Elite': return '#ff9800';
      default: return '#d81b60';
    }
  };

  const handleSelectPlan = (plan) => {
    if (plan.planType === 'free') {
      // Handle free plan selection
      toast.info('You already have access to the Basic plan');
      return;
    }

    setSelectedPlanForPayment(plan);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setSelectedPlanForPayment(null);
    closeUpgradeModal();
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setSelectedPlanForPayment(null);
  };

  const isCurrentPlan = (plan) => {
    return currentSubscription && currentSubscription.plan === plan._id;
  };

  const isUpgrade = (plan) => {
    if (!currentSubscription) return true;
    const currentPlan = plans.find(p => p._id === currentSubscription.plan);
    if (!currentPlan) return true;
    
    const planOrder = ['Basic', 'Entry', 'Advanced', 'Premium', 'Elite'];
    const currentIndex = planOrder.indexOf(currentPlan.name);
    const planIndex = planOrder.indexOf(plan.name);
    
    return planIndex > currentIndex;
  };

  if (showPayment && selectedPlanForPayment) {
    return (
      <Dialog open={upgradeModalOpen} onClose={closeUpgradeModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" sx={{ color: '#000', textAlign: 'center' }}>
            Complete Your Subscription
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Elements stripe={stripePromise}>
            <PaymentForm
              plan={selectedPlanForPayment}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </Elements>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={upgradeModalOpen} onClose={closeUpgradeModal} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h4" sx={{ color: '#2f444d', fontWeight: 'bold', textAlign: 'center' }}>
          Choose Your Subscription Plan
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', textAlign: 'center', mt: 1 }}>
          Unlock premium features and connect with more profiles
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {plans.map((plan) => (
              <Grid item xs={12} sm={6} md={4} key={plan._id}>
                <Card
                  sx={{
                    height: '100%',
                    position: 'relative',
                    cursor: isCurrentPlan(plan) ? 'default' : 'pointer',
                    border: isCurrentPlan(plan) 
                      ? `2px solid ${getPlanColor(plan.name)}` 
                      : '2px solid transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': !isCurrentPlan(plan) ? {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    } : {},
                    opacity: isCurrentPlan(plan) ? 0.8 : 1
                  }}
                  onClick={() => !isCurrentPlan(plan) && handleSelectPlan(plan)}
                >
                  {plan.isPopular && (
                    <Chip
                      label="Most Popular"
                      sx={{
                        position: 'absolute',
                        top: -10,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: getPlanColor(plan.name),
                        color: 'white',
                        fontWeight: 'bold',
                        zIndex: 1
                      }}
                    />
                  )}
                  
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      {getPlanIcon(plan.name)}
                    </Box>
                    
                    <Typography variant="h5" sx={{ color: getPlanColor(plan.name), fontWeight: 'bold', mb: 1 }}>
                      {plan.name}
                    </Typography>
                    
                    <Typography variant="h3" sx={{ color: '#000', fontWeight: 'bold', mb: 0.5 }}>
                      {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                      {plan.duration === 'monthly' ? '/month' : '/quarter'}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ color: '#666', mb: 3, minHeight: 40 }}>
                      {plan.description}
                    </Typography>
                    
                    <List dense sx={{ textAlign: 'left', mb: 3 }}>
                      {plan.features.slice(0, 5).map((feature, index) => (
                        <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 24 }}>
                            <CheckIcon sx={{ color: getPlanColor(plan.name), fontSize: 16 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{ 
                              fontSize: '0.9rem',
                              color: '#000'
                            }}
                          />
                        </ListItem>
                      ))}
                      {plan.features.length > 5 && (
                        <ListItem sx={{ py: 0.5, px: 0 }}>
                          <ListItemText
                            primary={`+${plan.features.length - 5} more features`}
                            primaryTypographyProps={{ 
                              fontSize: '0.8rem',
                              color: '#666',
                              fontStyle: 'italic'
                            }}
                          />
                        </ListItem>
                      )}
                    </List>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#000' }}>
                        Profile Views:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#000', fontWeight: 'bold' }}>
                        {plan.profileViews === -1 ? 'Unlimited' : plan.profileViews}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#000' }}>
                        Interests:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#000', fontWeight: 'bold' }}>
                        {plan.interests === -1 ? 'Unlimited' : plan.interests}
                      </Typography>
                    </Box>
                    
                    {isCurrentPlan(plan) ? (
                      <Button
                        variant="contained"
                        disabled
                        sx={{
                          background: getPlanColor(plan.name),
                          color: 'white',
                          width: '100%'
                        }}
                      >
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        sx={{
                          background: isUpgrade(plan) 
                            ? `linear-gradient(135deg, ${getPlanColor(plan.name)} 0%, ${getPlanColor(plan.name)}dd 100%)`
                            : '#666',
                          color: 'white',
                          width: '100%',
                          '&:hover': {
                            background: isUpgrade(plan) 
                              ? `linear-gradient(135deg, ${getPlanColor(plan.name)}dd 0%, ${getPlanColor(plan.name)} 100%)`
                              : '#555',
                          }
                        }}
                      >
                        {isUpgrade(plan) ? 'Upgrade' : 'Downgrade'} Plan
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={closeUpgradeModal} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubscriptionUpgradeModal;
