import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchAPI } from '../../services/apiService';

const initialState = {
  searchResults: [],
  recommendations: [],
  savedFilters: [],
  loading: false,
  error: null,
  pagination: null
};

// Search profiles with filters
export const searchProfiles = createAsyncThunk(
  'search/searchProfiles',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await searchAPI.searchProfiles(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search profiles');
    }
  }
);

// Get recommendations
export const getRecommendations = createAsyncThunk(
  'search/getRecommendations',
  async (params, { rejectWithValue }) => {
    try {
      const response = await searchAPI.getRecommendations(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get recommendations');
    }
  }
);

// Save search filter
export const saveSearchFilter = createAsyncThunk(
  'search/saveSearchFilter',
  async (filterData, { rejectWithValue }) => {
    try {
      const response = await searchAPI.saveSearchFilter(filterData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save search filter');
    }
  }
);

// Get saved filters
export const getSavedFilters = createAsyncThunk(
  'search/getSavedFilters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await searchAPI.getSavedFilters();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get saved filters');
    }
  }
);

// Delete saved filter
export const deleteSavedFilter = createAsyncThunk(
  'search/deleteSavedFilter',
  async (filterId, { rejectWithValue }) => {
    try {
      const response = await searchAPI.deleteSavedFilter(filterId);
      return { filterId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete saved filter');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.pagination = null;
      state.error = null;
    },
    clearRecommendations: (state) => {
      state.recommendations = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Search profiles
      .addCase(searchProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.data || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(searchProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get recommendations
      .addCase(getRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload.data || [];
      })
      .addCase(getRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Save search filter
      .addCase(saveSearchFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveSearchFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.savedFilters.push(action.payload.data);
      })
      .addCase(saveSearchFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get saved filters
      .addCase(getSavedFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSavedFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.savedFilters = action.payload.data || [];
      })
      .addCase(getSavedFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete saved filter
      .addCase(deleteSavedFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSavedFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.savedFilters = state.savedFilters.filter(filter => filter._id !== action.payload.filterId);
      })
      .addCase(deleteSavedFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSearchResults, clearRecommendations, clearError } = searchSlice.actions;
export default searchSlice.reducer;
