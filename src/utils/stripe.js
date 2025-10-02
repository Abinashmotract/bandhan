import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
export const stripePromise = loadStripe('pk_test_51SCHBXKg4JvCYZiYbBJ8uG0Ume46gChQLKyH7acubD1JasAo3KPPrbQxXFm6jIU5wf4WClZOfFgKczhkJqevyYwa00sMLiJDQm');

// Stripe configuration
export const STRIPE_CONFIG = {
  publishableKey: 'pk_test_51SCHBXKg4JvCYZiYbBJ8uG0Ume46gChQLKyH7acubD1JasAo3KPPrbQxXFm6jIU5wf4WClZOfFgKczhkJqevyYwa00sMLiJDQm',
  secretKey: 'sk_test_51SCHBXKg4JvCYZiYHDfFOKGn9SIiEUlmHkXskrqVEQgLQcfUQyT6AW8TnLDCi2OoSEyG0n06WkJ3sRyhunCB7Tuu003ov7Xh70',
  currency: 'INR',
  country: 'IN'
};
