// Razorpay configuration
// Support both naming conventions
const getRazorpayKeyId = () => {
  return import.meta.env.VITE_RAZORPAY_KEY_ID || 
         import.meta.env.VITE_RAZORPAY_API_KEY || 
         '';
};

export const RAZORPAY_CONFIG = {
  keyId: getRazorpayKeyId(),
  currency: 'INR',
  name: 'Bandhan Match',
  description: 'Subscription Payment',
  prefill: {
    email: '',
    contact: ''
  },
  theme: {
    color: '#51365F'
  }
};

// Initialize Razorpay payment
export const initializeRazorpayPayment = (orderData, options, onSuccess, onError) => {
  if (!window.Razorpay) {
    console.error('Razorpay SDK not loaded');
    onError('Razorpay SDK not loaded');
    return;
  }

  const razorpayOptions = {
    key: orderData.keyId || RAZORPAY_CONFIG.keyId,
    amount: orderData.amount,
    currency: orderData.currency || RAZORPAY_CONFIG.currency,
    name: RAZORPAY_CONFIG.name,
    description: options.description || RAZORPAY_CONFIG.description,
    order_id: orderData.orderId,
    handler: function (response) {
      onSuccess(response);
    },
    prefill: {
      email: options.email || RAZORPAY_CONFIG.prefill.email,
      contact: options.contact || RAZORPAY_CONFIG.prefill.contact,
      name: options.name || ''
    },
    theme: {
      color: RAZORPAY_CONFIG.theme.color
    },
    // Explicitly enable all payment methods - UPI, Cards, Netbanking, Wallets
    // This ensures all payment options are available to users
    method: {
      upi: true,
      card: true,
      netbanking: true,
      wallet: true,
      emi: false // Disable EMI for one-time payments
    },
    notes: {
      description: options.description || RAZORPAY_CONFIG.description
    },
    // Configure to show all payment options
    // The payment methods are controlled by Razorpay account settings
    // This configuration ensures proper display
    modal: {
      ondismiss: function() {
        onError('Payment cancelled by user');
      }
    },
    // Enable retry for failed payments
    retry: {
      enabled: true,
      max_count: 4
    },
    // Enable OTP auto-read for better UX
    readonly: {
      email: !!options.email,
      contact: !!options.contact,
      name: !!options.name
    }
  };

  const razorpay = new window.Razorpay(razorpayOptions);
  razorpay.open();
  
  return razorpay;
};

