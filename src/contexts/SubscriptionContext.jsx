import React, { useReducer, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSubscriptionPlans,
  getSubscriptionStatus,
  createSubscription,
  cancelSubscription,
} from "../store/slices/subscriptionSlice";
import toast from "react-hot-toast";
import { SubscriptionContext } from "./SubsContext";

const subscriptionReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_PLANS":
      return { ...state, plans: action.payload };
    case "SET_CURRENT_SUBSCRIPTION":
      return { ...state, currentSubscription: action.payload };
    case "SET_PAYMENT_LOADING":
      return { ...state, paymentLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_UPGRADE_MODAL_OPEN":
      return { ...state, upgradeModalOpen: action.payload };
    case "SET_SELECTED_PLAN":
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
  selectedPlan: null,
};

export const SubscriptionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(subscriptionReducer, initialState);
  const reduxDispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const reduxSubscription = useSelector((state) => state.subscription);

  // Load subscription plans and current subscription
  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await Promise.all([
        reduxDispatch(getSubscriptionPlans({ duration: "quarterly" })),
        reduxDispatch(getSubscriptionStatus()),
      ]);
      
      // Sync Redux state to local state
      dispatch({ type: "SET_PLANS", payload: reduxSubscription.plans || [] });
      dispatch({ type: "SET_CURRENT_SUBSCRIPTION", payload: reduxSubscription.currentSubscription || null });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Sync Redux subscription state to context when it changes
  useEffect(() => {
    if (reduxSubscription.plans && reduxSubscription.plans.length > 0) {
      dispatch({ type: "SET_PLANS", payload: reduxSubscription.plans });
    }
    if (reduxSubscription.currentSubscription !== undefined) {
      dispatch({ type: "SET_CURRENT_SUBSCRIPTION", payload: reduxSubscription.currentSubscription });
    }
  }, [reduxSubscription.plans, reduxSubscription.currentSubscription]);

  const checkProfileAccess = (profile) => {
    // Use Redux state if available, fallback to context state
    const currentSubscription = reduxSubscription.currentSubscription || state.currentSubscription;
    const plans = reduxSubscription.plans.length > 0 ? reduxSubscription.plans : state.plans;
    
    if (!user || !currentSubscription) {
      return true; // Allow access if no subscription info (free users)
    }

    const currentPlan = plans.find(
      (plan) => plan._id === currentSubscription.plan
    );

    if (!currentPlan) {
      return true; // Default to allowing access
    }

    // Check if profile requires subscription
    if (profile && profile.requiresSubscription) {
      return currentPlan.planType === "paid";
    }

    // Check profile views limit (if plan has limits)
    if (currentPlan.profileViews !== undefined && currentPlan.profileViews !== -1) {
      const viewsUsed = currentSubscription.profileViewsUsed || 0;
      return viewsUsed < currentPlan.profileViews;
    }

    return true; // Default to allowing access
  };

  const canSendInterest = () => {
    // Use Redux state if available, fallback to context state
    const currentSubscription = reduxSubscription.currentSubscription || state.currentSubscription;
    const plans = reduxSubscription.plans.length > 0 ? reduxSubscription.plans : state.plans;
    
    if (!user || !currentSubscription) {
      return true; // Default to allowing (free users have limits enforced by API)
    }

    const currentPlan = plans.find(
      (plan) => plan._id === currentSubscription.plan
    );

    if (!currentPlan) {
      return true; // Default to allowing
    }

    if (currentPlan.interests === -1) {
      return true; // Unlimited
    }

    const interestsUsed = currentSubscription.interestsUsed || 0;
    return interestsUsed < currentPlan.interests;
  };

  const getRemainingInterests = () => {
    // Use Redux state if available, fallback to context state
    const currentSubscription = reduxSubscription.currentSubscription || state.currentSubscription;
    const plans = reduxSubscription.plans.length > 0 ? reduxSubscription.plans : state.plans;
    
    if (!user || !currentSubscription) {
      return 5; // Default free limit
    }

    const currentPlan = plans.find(
      (plan) => plan._id === currentSubscription.plan
    );

    if (!currentPlan) {
      return 5; // Default free limit
    }

    if (currentPlan.interests === -1) {
      return -1; // Unlimited
    }

    const interestsUsed = currentSubscription.interestsUsed || 0;
    return Math.max(0, currentPlan.interests - interestsUsed);
  };

  const getInterestLimit = () => {
    if (!user || !state.currentSubscription) {
      return 0;
    }

    const currentPlan = state.plans.find(
      (plan) => plan._id === state.currentSubscription.plan
    );

    if (!currentPlan) {
      return 0;
    }

    return currentPlan.interests === -1 ? -1 : currentPlan.interests;
  };

  const canSendMessage = () => {
    if (!user || !state.currentSubscription) {
      return false;
    }

    const currentPlan = state.plans.find(
      (plan) => plan._id === state.currentSubscription.plan
    );

    if (!currentPlan) {
      return false;
    }

    // Check if plan includes messaging
    return currentPlan.features.some(
      (feature) =>
        feature.toLowerCase().includes("messaging") ||
        feature.toLowerCase().includes("message")
    );
  };

  const openUpgradeModal = (plan = null) => {
    dispatch({ type: "SET_SELECTED_PLAN", payload: plan });
    dispatch({ type: "SET_UPGRADE_MODAL_OPEN", payload: true });
  };

  const closeUpgradeModal = () => {
    dispatch({ type: "SET_UPGRADE_MODAL_OPEN", payload: false });
    dispatch({ type: "SET_SELECTED_PLAN", payload: null });
  };

  const handleSubscription = async (planId, paymentMethodId) => {
    try {
      dispatch({ type: "SET_PAYMENT_LOADING", payload: true });

      const result = await reduxDispatch(
        createSubscription({
          planId,
          paymentMethodId,
        })
      );

      if (result.payload.success) {
        toast.success("Subscription activated successfully!");
        closeUpgradeModal();
        loadSubscriptionData();
      } else {
        throw new Error(result.payload.message || "Subscription failed");
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast.error(error.message || "Subscription failed");
    } finally {
      dispatch({ type: "SET_PAYMENT_LOADING", payload: false });
    }
  };

  const handleCancelSubscription = async () => {
    try {
      dispatch({ type: "SET_PAYMENT_LOADING", payload: true });

      const result = await reduxDispatch(cancelSubscription());

      if (result.payload.success) {
        toast.success("Subscription cancelled successfully");
        loadSubscriptionData();
      } else {
        throw new Error(result.payload.message || "Cancellation failed");
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast.error(error.message || "Cancellation failed");
    } finally {
      dispatch({ type: "SET_PAYMENT_LOADING", payload: false });
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
    loadSubscriptionData,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
