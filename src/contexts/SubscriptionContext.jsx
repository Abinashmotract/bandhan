import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubscriptionPlans, getSubscriptionStatus, createSubscription, cancelSubscription } from '../store/slices/subscriptionSlice';
import toast from 'react-hot-toast';

const SubscriptionContext = createContext();

const subscriptionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PLANS':
      return { ...state, plans: action.payload };
    case 'SET_CURRENT_SUBSCRIPTION':
      return { ...state, currentSubscription: action.payload };
    case 'SET_PAYMENT_LOADING':
      return { ...state, paymentLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_UPGRADE_MODAL_OPEN':
      return { ...state, upgradeModalOpen: action.payload };
    case 'SET_SELECTED_PLAN':
      return { ...state, selectedPlan: action.payload };
    default:
      return state;
  }
};

const initialState = {
  plans: [],
  currentSubscription: null,
  loading: false,
  paymentLoading: false,
  error: null,
  upgradeModalOpen: false,
  selectedPlan: null
};

export const SubscriptionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(subscriptionReducer, initialState);
  const reduxDispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Load subscription plans and current subscription
  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await Promise.all([
        reduxDispatch(getSubscriptionPlans({ duration: 'quarterly' })),
        reduxDispatch(getSubscriptionStatus())
      ]);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const checkProfileAccess = (profile) => {
    if (!user || !state.currentSubscription) {
      return false;
    }

    const currentPlan = state.plans.find(plan => plan._id === state.currentSubscription.plan);
    
    if (!currentPlan) {
      return false;
    }

    // Check if profile requires subscription
    if (profile.requiresSubscription) {
      return currentPlan.planType === 'paid';
    }

    // Check profile views limit
    if (currentPlan.profileViews !== -1) {
      return state.currentSubscription.profileViewsUsed < currentPlan.profileViews;
    }

    return true;
  };

  const canSendInterest = () => {
    if (!user || !state.currentSubscription) {
      return false;
    }

    const currentPlan = state.plans.find(plan => plan._id === state.currentSubscription.plan);
    
    if (!currentPlan) {
      return false;
    }

    if (currentPlan.interests === -1) {
      return true; // Unlimited
    }

    return state.currentSubscription.interestsUsed < currentPlan.interests;
  };

  const getRemainingInterests = () => {
    if (!user || !state.currentSubscription) {
      return 0;
    }

    const currentPlan = state.plans.find(plan => plan._id === state.currentSubscription.plan);
    
    if (!currentPlan) {
      return 0;
    }

    if (currentPlan.interests === -1) {
      return -1; // Unlimited
    }

    return Math.max(0, currentPlan.interests - state.currentSubscription.interestsUsed);
  };

  const getInterestLimit = () => {
    if (!user || !state.currentSubscription) {
      return 0;
    }

    const currentPlan = state.plans.find(plan => plan._id === state.currentSubscription.plan);
    
    if (!currentPlan) {
      return 0;
    }

    return currentPlan.interests === -1 ? -1 : currentPlan.interests;
  };

  const canSendMessage = () => {
    if (!user || !state.currentSubscription) {
      return false;
    }

    const currentPlan = state.plans.find(plan => plan._id === state.currentSubscription.plan);
    
    if (!currentPlan) {
      return false;
    }

    // Check if plan includes messaging
    return currentPlan.features.some(feature => 
      feature.toLowerCase().includes('messaging') || 
      feature.toLowerCase().includes('message')
    );
  };

  const openUpgradeModal = (plan = null) => {
    dispatch({ type: 'SET_SELECTED_PLAN', payload: plan });
    dispatch({ type: 'SET_UPGRADE_MODAL_OPEN', payload: true });
  };

  const closeUpgradeModal = () => {
    dispatch({ type: 'SET_UPGRADE_MODAL_OPEN', payload: false });
    dispatch({ type: 'SET_SELECTED_PLAN', payload: null });
  };

  const handleSubscription = async (planId, paymentMethodId) => {
    try {
      dispatch({ type: 'SET_PAYMENT_LOADING', payload: true });
      
      const result = await reduxDispatch(createSubscription({
        planId,
        paymentMethodId
      }));

      if (result.payload.success) {
        toast.success('Subscription activated successfully!');
        closeUpgradeModal();
        loadSubscriptionData();
      } else {
        throw new Error(result.payload.message || 'Subscription failed');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error(error.message || 'Subscription failed');
    } finally {
      dispatch({ type: 'SET_PAYMENT_LOADING', payload: false });
    }
  };

  const handleCancelSubscription = async () => {
    try {
      dispatch({ type: 'SET_PAYMENT_LOADING', payload: true });
      
      const result = await reduxDispatch(cancelSubscription());
      
      if (result.payload.success) {
        toast.success('Subscription cancelled successfully');
        loadSubscriptionData();
      } else {
        throw new Error(result.payload.message || 'Cancellation failed');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error(error.message || 'Cancellation failed');
    } finally {
      dispatch({ type: 'SET_PAYMENT_LOADING', payload: false });
    }
  };

  const value = {
    ...state,
    checkProfileAccess,
    canSendInterest,
    canSendMessage,
    getRemainingInterests,
    getInterestLimit,
    openUpgradeModal,
    closeUpgradeModal,
    handleSubscription,
    handleCancelSubscription,
    loadSubscriptionData
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
