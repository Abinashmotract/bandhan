import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { CheckCircle, ArrowForward, Download } from '@mui/icons-material';

const PaymentSuccessPage = () => {
  const gradientStyle = {
    background: 'linear-gradient(135deg, rgb(216, 27, 96) 0%, rgb(136, 14, 79) 100%)',
  };

  // Mock payment data
  const paymentData = {
    amount: '$149.99',
    transactionId: 'TXN-789456123',
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    product: 'Premium Subscription',
  };

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
                    {paymentData.amount}
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
                >
                  Download Receipt
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
                >
                  Continue Shopping
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