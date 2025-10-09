import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { interactionAPI } from '../../services/apiService';

const initialState = {
  interactionHistory: [],
  profileViews: [],
  favourites: [],
  loading: false,
  error: null,
  pagination: null
};

// Like a profile
export const likeProfile = createAsyncThunk(
  'interaction/likeProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await interactionAPI.likeProfile(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like profile');
    }
  }
);

// Super like a profile
export const superlikeProfile = createAsyncThunk(
  'interaction/superlikeProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await interactionAPI.superlikeProfile(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to super like profile');
    }
  }
);

// Add to favourites
export const addToFavourites = createAsyncThunk(
  'interaction/addToFavourites',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await interactionAPI.addToFavourites(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to favourites');
    }
  }
);

// Send interest to a user
export const sendInterest = createAsyncThunk(
  'interaction/sendInterest',
  async ({ userId, interestData }, { rejectWithValue }) => {
    try {
      const response = await interactionAPI.sendInterest(userId, interestData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send interest');
    }
  }
);

// Remove from favourites
export const removeFromFavourites = createAsyncThunk(
  'interaction/removeFromFavourites',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await interactionAPI.removeFromFavourites(userId);
      return { userId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from favourites');
    }
  }
);

// Block a user
export const blockUser = createAsyncThunk(
  'interaction/blockUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await interactionAPI.blockUser(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to block user');
    }
  }
);

// Unblock a user
export const unblockUser = createAsyncThunk(
  'interaction/unblockUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await interactionAPI.unblockUser(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unblock user');
    }
  }
);

// Report a user
export const reportUser = createAsyncThunk(
  'interaction/reportUser',
  async ({ userId, reportData }, { rejectWithValue }) => {
    try {
      const response = await interactionAPI.reportUser(userId, reportData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to report user');
    }
  }
);

// Get interaction history
export const getInteractionHistory = createAsyncThunk(
  'interaction/getInteractionHistory',
  async (params, { rejectWithValue }) => {
    try {
      const response = await interactionAPI.getInteractionHistory(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get interaction history');
    }
  }
);

// Get profile views
export const getProfileViews = createAsyncThunk(
  'interaction/getProfileViews',
  async (params, { rejectWithValue }) => {
    try {
      const response = await interactionAPI.getProfileViews(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get profile views');
    }
  }
);

// Get favourites
export const getFavourites = createAsyncThunk(
  'interaction/getFavourites',
  async (params, { rejectWithValue }) => {
    try {
      const response = await interactionAPI.getFavourites(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get favourites');
    }
  }
);

const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    clearInteractionHistory: (state) => {
      state.interactionHistory = [];
      state.pagination = null;
      state.error = null;
    },
    clearProfileViews: (state) => {
      state.profileViews = [];
      state.error = null;
    },
    clearFavourites: (state) => {
      state.favourites = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Like profile
      .addCase(likeProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(likeProfile.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(likeProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Super like profile
      .addCase(superlikeProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(superlikeProfile.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(superlikeProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to favourites
      .addCase(addToFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToFavourites.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addToFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Send interest
      .addCase(sendInterest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendInterest.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(sendInterest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove from favourites
      .addCase(removeFromFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.favourites = state.favourites.filter(fav => (fav.user?._id || fav._id) !== action.payload.userId);
      })
      .addCase(removeFromFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Block user
      .addCase(blockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Unblock user
      .addCase(unblockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unblockUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(unblockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Report user
      .addCase(reportUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reportUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(reportUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get interaction history
      .addCase(getInteractionHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInteractionHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.interactionHistory = action.payload.data || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(getInteractionHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get profile views
      .addCase(getProfileViews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileViews.fulfilled, (state, action) => {
        state.loading = false;
        state.profileViews = action.payload.data || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(getProfileViews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get favourites
      .addCase(getFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFavourites.fulfilled, (state, action) => {
        state.loading = false;
        const payloadData = action.payload?.data || {};
        state.favourites = payloadData.favourites || payloadData || [];
        state.pagination = payloadData.pagination || null;
      })
      .addCase(getFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearInteractionHistory, 
  clearProfileViews, 
  clearFavourites, 
  clearError 
} = interactionSlice.actions;
export default interactionSlice.reducer;
