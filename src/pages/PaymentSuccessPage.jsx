import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { Box, Typography, Button, Container, Paper, CircularProgress, Alert } from '@mui/material';
import { CheckCircle, ArrowForward, Download } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { getSubscriptionStatus, getSubscriptionPlans } from '../store/slices/subscriptionSlice';
import { subscriptionAPI } from '../services/apiService';
import { useSubscription } from '../hooks/useSubscription';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentSubscription, plans, loading } = useSelector(state => state.subscription);
  const { loadSubscriptionData } = useSubscription();
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const gradientStyle = {
    background: 'linear-gradient(135deg, rgb(216, 27, 96) 0%, rgb(136, 14, 79) 100%)',
  };

  useEffect(() => {
    const fetchPaymentData = async () => {
      // Get subscription status to fetch latest data
      dispatch(getSubscriptionStatus());
      
      // Get payment data from URL params or state
      const urlParams = new URLSearchParams(location.search);
      const sessionId = urlParams.get('session_id');
      const paymentIntentId = urlParams.get('payment_intent') || location.state?.paymentIntentId;
      const planId = urlParams.get('plan_id') || location.state?.planId;
      
      if (sessionId) {
        // Payment completed via Stripe checkout - fetch session details
        try {
          const response = await subscriptionAPI.getCheckoutSessionDetails(sessionId);
          if (response.data.success) {
            const sessionData = response.data.data;
            
            // Extract amount from session or transaction
            let paymentAmount = sessionData.amount;
            if (!paymentAmount || paymentAmount === 0) {
              // Try to get from transaction
              if (sessionData.transaction?.amount) {
                paymentAmount = sessionData.transaction.amount;
              } else if (sessionData.plan?.price) {
                paymentAmount = sessionData.plan.price;
              }
            }
            
            // Get payment date from transaction or session
            let paymentDate = new Date();
            let paymentTime = new Date();
            if (sessionData.transaction?.createdAt) {
              paymentDate = new Date(sessionData.transaction.createdAt);
              paymentTime = new Date(sessionData.transaction.createdAt);
            }
            
            // If payment is completed but no transaction exists, try to process it
            if (sessionData.paymentStatus === 'paid' && !sessionData.transaction) {
              try {
                console.log('Payment completed but not processed, attempting to process...');
                await subscriptionAPI.processPaymentManually(sessionId);
                // Refetch session details after processing
                const updatedResponse = await subscriptionAPI.getCheckoutSessionDetails(sessionId);
                if (updatedResponse.data.success) {
                  const updatedSessionData = updatedResponse.data.data;
                  
                  // Extract amount again after processing
                  let updatedAmount = updatedSessionData.amount;
                  if (!updatedAmount || updatedAmount === 0) {
                    if (updatedSessionData.transaction?.amount) {
                      updatedAmount = updatedSessionData.transaction.amount;
                    } else if (updatedSessionData.plan?.price) {
                      updatedAmount = updatedSessionData.plan.price;
                    }
                  }
                  
                  // Get payment date from transaction
                  let updatedDate = new Date();
                  let updatedTime = new Date();
                  if (updatedSessionData.transaction?.createdAt) {
                    updatedDate = new Date(updatedSessionData.transaction.createdAt);
                    updatedTime = new Date(updatedSessionData.transaction.createdAt);
                  }
                  
                  setPaymentData({
                    amount: updatedAmount || paymentAmount || 0,
                    transactionId: sessionId,
                    date: updatedDate.toLocaleDateString(),
                    time: updatedTime.toLocaleTimeString(),
                    product: `${updatedSessionData.plan?.name || 'Subscription'} Plan`,
                    plan: updatedSessionData.plan,
                    receiptUrl: updatedSessionData.receiptUrl,
                    paymentStatus: updatedSessionData.paymentStatus
                  });
                  
                  // Refresh subscription status after payment
                  dispatch(getSubscriptionStatus());
                  dispatch(getSubscriptionPlans({ duration: "quarterly" }));
                  // Also refresh subscription context
                  if (loadSubscriptionData) {
                    loadSubscriptionData();
                  }
                } else {
                  throw new Error('Failed to process payment');
                }
              } catch (processError) {
                console.error('Error processing payment:', processError);
                // Still show the session data even if processing failed
                setPaymentData({
                  amount: paymentAmount || 0,
                  transactionId: sessionId,
                  date: paymentDate.toLocaleDateString(),
                  time: paymentTime.toLocaleTimeString(),
                  product: `${sessionData.plan?.name || 'Subscription'} Plan`,
                  plan: sessionData.plan,
                  receiptUrl: sessionData.receiptUrl,
                  paymentStatus: sessionData.paymentStatus
                });
              }
            } else {
              // Payment data is ready
              setPaymentData({
                amount: paymentAmount || 0,
                transactionId: sessionId,
                date: paymentDate.toLocaleDateString(),
                time: paymentTime.toLocaleTimeString(),
                product: `${sessionData.plan?.name || 'Subscription'} Plan`,
                plan: sessionData.plan,
                receiptUrl: sessionData.receiptUrl,
                paymentStatus: sessionData.paymentStatus
              });
              
              // Refresh subscription status after payment
              dispatch(getSubscriptionStatus());
              dispatch(getSubscriptionPlans({ duration: "quarterly" }));
              // Also refresh subscription context
              if (loadSubscriptionData) {
                loadSubscriptionData();
              }
            }
          } else {
            // Fallback if session details not found
            setPaymentData({
              amount: 0,
              transactionId: sessionId,
              date: new Date().toLocaleDateString(),
              time: new Date().toLocaleTimeString(),
              product: 'Subscription Plan',
              plan: null
            });
          }
        } catch (error) {
          console.error('Error fetching checkout session details:', error);
          console.error('Error details:', error.response?.data);
          // Fallback - try to get from plan if available
          const fallbackAmount = plans?.find(p => p._id === location.state?.planId)?.price || 0;
          setPaymentData({
            amount: fallbackAmount,
            transactionId: sessionId,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            product: 'Subscription Plan',
            plan: plans?.find(p => p._id === location.state?.planId) || null
          });
        }
      } else if (paymentIntentId && planId) {
        // Create dynamic payment data
        const currentPlan = plans?.find(plan => plan._id === planId);
        setPaymentData({
          amount: currentPlan?.price || 0,
          transactionId: paymentIntentId,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          product: `${currentPlan?.name || 'Subscription'} Plan`,
          plan: currentPlan
        });
      } else {
        // Fallback to current subscription data
        if (currentSubscription) {
          const currentPlan = plans?.find(plan => plan._id === currentSubscription.plan);
          setPaymentData({
            amount: currentPlan?.price || 0,
            transactionId: currentSubscription.paymentIntentId || 'TXN-' + Date.now(),
            date: new Date(currentSubscription.startDate).toLocaleDateString(),
            time: new Date(currentSubscription.startDate).toLocaleTimeString(),
            product: `${currentPlan?.name || 'Subscription'} Plan`,
            plan: currentPlan
          });
        }
      }
      
      setIsLoading(false);
    };

    fetchPaymentData();
  }, [dispatch, location, currentSubscription, plans]);

  const handleDownload = () => {
    if (!paymentData) return;
    
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Payment Receipt', 20, 20);
    doc.setFontSize(12);
    doc.text(`Product: ${paymentData.product}`, 20, 40);
    doc.text(`Amount: ₹${paymentData.amount ? paymentData.amount.toLocaleString('en-IN') : '0'}`, 20, 50);
    doc.text(`Transaction ID: ${paymentData.transactionId}`, 20, 60);
    doc.text(`Date: ${paymentData.date}`, 20, 70);
    doc.text(`Time: ${paymentData.time}`, 20, 80);
    
    // Generate a safe filename (remove special characters)
    const safeTransactionId = paymentData.transactionId.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `receipt-${safeTransactionId.substring(0, 20)}.pdf`;
    doc.save(fileName);
  };

  const handleContinue = () => {
    navigate('/profile');
  };

  if (isLoading || loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!paymentData) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">
          No payment data found. Please try again.
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/membership')}
          sx={{ mt: 2 }}
        >
          Back to Membership
        </Button>
      </Container>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
        py: 4
      }}
    >
      <Container maxWidth="md">
        {/* Success Card */}
        <Paper 
          elevation={8}
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            mb: 4
          }}
        >
          {/* Header with gradient */}
          <Box sx={{ ...gradientStyle, py: 4, textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 80, color: 'white', mb: 2 }} />
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                color: 'white', 
                fontWeight: 'bold',
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Payment Successful!
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ color: 'white', opacity: 0.9, mt: 1 }}
            >
              Thank you for your purchase
            </Typography>
          </Box>

          {/* Content Section */}
          <Box sx={{ p: 4 }}>
            {/* Success Message */}
            <Typography 
              variant="h6" 
              sx={{ 
                textAlign: 'center', 
                mb: 4,
                color: 'text.secondary'
              }}
            >
              Your payment has been processed successfully. You will receive a confirmation email shortly.
            </Typography>

            {/* Payment Details */}
            <Box 
              className="bg-light rounded-3 p-4 mb-4"
              sx={{ backgroundColor: '#f8f9fa' }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 'bold',
                  color: 'rgb(136, 14, 79)'
                }}
              >
                Payment Details
              </Typography>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <Typography variant="subtitle2" color="text.secondary">
                    Amount Paid
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    ₹{paymentData.amount ? paymentData.amount.toLocaleString('en-IN') : '0'}
                  </Typography>
                </div>
                <div className="col-md-6 mb-3">
                  <Typography variant="subtitle2" color="text.secondary">
                    Transaction ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                    {paymentData.transactionId}
                  </Typography>
                </div>
                <div className="col-md-6 mb-3">
                  <Typography variant="subtitle2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body1">
                    {paymentData.date}
                  </Typography>
                </div>
                <div className="col-md-6 mb-3">
                  <Typography variant="subtitle2" color="text.secondary">
                    Time
                  </Typography>
                  <Typography variant="body1">
                    {paymentData.time}
                  </Typography>
                </div>
                <div className="col-12">
                  <Typography variant="subtitle2" color="text.secondary">
                    Product/Service
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {paymentData.product}
                  </Typography>
                </div>
              </div>
            </Box>

            {/* Action Buttons */}
            <div className="row g-3">
              <div className="col-md-6">
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<Download />}
                  sx={{
                    borderColor: 'rgb(216, 27, 96)',
                    color: 'rgb(216, 27, 96)',
                    '&:hover': {
                      borderColor: 'rgb(136, 14, 79)',
                      backgroundColor: 'rgba(216, 27, 96, 0.04)'
                    },
                    py: 1.5
                  }}
                onClick={handleDownload}>
                  Download Receipt (PDF)
                </Button>
              </div>
              <div className="col-md-6">
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    background: 'linear-gradient(135deg, rgb(216, 27, 96) 0%, rgb(136, 14, 79) 100%)',
                    py: 1.5,
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgb(196, 17, 76) 0%, rgb(116, 4, 59) 100%)',
                    }
                  }}
                  onClick={handleContinue}
                >
                  Continue to Dashboard
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <Box 
              className="mt-4 p-3 rounded"
              sx={{ 
                backgroundColor: 'rgba(216, 27, 96, 0.05)',
                borderLeft: '4px solid rgb(216, 27, 96)'
              }}
            >
              <Typography variant="body2" sx={{ color: 'rgb(136, 14, 79)' }}>
                <strong>Note:</strong> Your order is being processed. You will receive tracking information 
                within 24 hours via email.
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Support Section */}
        <Paper 
          elevation={2} 
          sx={{ 
            borderRadius: 2,
            p: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, color: 'rgb(136, 14, 79)' }}>
            Need Help?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Contact our support team for any questions about your order
          </Typography>
          <Button 
            variant="text" 
            sx={{ 
              color: 'rgb(216, 27, 96)',
              '&:hover': {
                backgroundColor: 'rgba(216, 27, 96, 0.1)'
              }
            }}
          >
            Contact Support
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default PaymentSuccessPage;