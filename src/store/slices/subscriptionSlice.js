import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { subscriptionAPI } from '../../services/apiService';

const initialState = {
  subscriptionPlans: [],
  currentSubscription: null,
  loading: false,
  error: null
};

// Get subscription plans
export const getSubscriptionPlans = createAsyncThunk(
  'subscription/getSubscriptionPlans',
  async (params, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.getSubscriptionPlans(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get subscription plans');
    }
  }
);

// Subscribe to a plan
export const subscribeToPlan = createAsyncThunk(
  'subscription/subscribeToPlan',
  async (planData, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.subscribeToPlan(planData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to subscribe to plan');
    }
  }
);

// Get subscription status
export const getSubscriptionStatus = createAsyncThunk(
  'subscription/getSubscriptionStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.getSubscriptionStatus();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get subscription status');
    }
  }
);

// Cancel subscription
export const cancelSubscription = createAsyncThunk(
  'subscription/cancelSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.cancelSubscription();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel subscription');
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscriptionPlans: (state) => {
      state.subscriptionPlans = [];
      state.error = null;
    },
    clearCurrentSubscription: (state) => {
      state.currentSubscription = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get subscription plans
      .addCase(getSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptionPlans = action.payload.data || [];
      })
      .addCase(getSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Subscribe to plan
      .addCase(subscribeToPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeToPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscription = action.payload.data;
      })
      .addCase(subscribeToPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get subscription status
      .addCase(getSubscriptionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscriptionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscription = action.payload.data;
      })
      .addCase(getSubscriptionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel subscription
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscription = action.payload.data;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearSubscriptionPlans, 
  clearCurrentSubscription, 
  clearError 
} = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
