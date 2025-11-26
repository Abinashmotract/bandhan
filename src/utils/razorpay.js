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
    modal: {
      ondismiss: function() {
        onError('Payment cancelled by user');
      }
    }
  };

  const razorpay = new window.Razorpay(razorpayOptions);
  razorpay.open();
  
  return razorpay;
};

