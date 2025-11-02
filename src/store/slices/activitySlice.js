import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../../utils/api';

// Async thunks
export const getOnlineMatches = createAsyncThunk(
  'activity/getOnlineMatches',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.get(`${API_BASE_URL}/activity/online-matches`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch online matches');
    }
  }
);

export const getShortlistedProfiles = createAsyncThunk(
  'activity/getShortlistedProfiles',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.get(`${API_BASE_URL}/activity/shortlisted`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shortlisted profiles');
    }
  }
);

export const getInterestsReceived = createAsyncThunk(
  'activity/getInterestsReceived',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.get(`${API_BASE_URL}/activity/interests/received`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch received interests');
    }
  }
);

export const getInterestsSent = createAsyncThunk(
  'activity/getInterestsSent',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.get(`${API_BASE_URL}/activity/interests/sent`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sent interests');
    }
  }
);

export const acceptInterest = createAsyncThunk(
  'activity/acceptInterest',
  async (interestId, { rejectWithValue }) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.post(
        `${API_BASE_URL}/interests/${interestId}/activity/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { interestId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept interest');
    }
  }
);

export const declineInterest = createAsyncThunk(
  'activity/declineInterest',
  async (interestId, { rejectWithValue }) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.post(
        `${API_BASE_URL}/interests/${interestId}/activity/decline`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { interestId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to decline interest');
    }
  }
);

const initialState = {
  onlineMatches: [],
  shortlistedProfiles: [],
  interestsReceived: [],
  interestsSent: [],
  summary: {
    acceptedInterests: 0,
    interestsReceived: 0,
    interestsSent: 0,
    shortlistedProfiles: 0,
    declinedInterests: 0,
    onlineMatches: 0
  },
  loading: {
    onlineMatches: false,
    shortlisted: false,
    received: false,
    sent: false
  },
  error: {
    onlineMatches: null,
    shortlisted: null,
    received: null,
    sent: null
  }
};

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    clearActivityErrors: (state) => {
      state.error = {
        onlineMatches: null,
        shortlisted: null,
        received: null,
        sent: null
      };
    },
    updateActivitySummary: (state) => {
      state.summary = {
        acceptedInterests: state.interestsReceived.filter(i => i.status === 'accepted').length,
        interestsReceived: state.interestsReceived.length,
        interestsSent: state.interestsSent.length,
        shortlistedProfiles: state.shortlistedProfiles.length,
        declinedInterests: state.interestsReceived.filter(i => i.status === 'declined').length,
        onlineMatches: state.onlineMatches.length
      };
    }
  },
  extraReducers: (builder) => {
    // Online Matches
    builder
      .addCase(getOnlineMatches.pending, (state) => {
        state.loading.onlineMatches = true;
        state.error.onlineMatches = null;
      })
      .addCase(getOnlineMatches.fulfilled, (state, action) => {
        state.loading.onlineMatches = false;
        state.onlineMatches = action.payload;
        state.error.onlineMatches = null;
      })
      .addCase(getOnlineMatches.rejected, (state, action) => {
        state.loading.onlineMatches = false;
        state.error.onlineMatches = action.payload;
      })

      // Shortlisted Profiles
      .addCase(getShortlistedProfiles.pending, (state) => {
        state.loading.shortlisted = true;
        state.error.shortlisted = null;
      })
      .addCase(getShortlistedProfiles.fulfilled, (state, action) => {
        state.loading.shortlisted = false;
        state.shortlistedProfiles = action.payload;
        state.error.shortlisted = null;
      })
      .addCase(getShortlistedProfiles.rejected, (state, action) => {
        state.loading.shortlisted = false;
        state.error.shortlisted = action.payload;
      })

      // Interests Received
      .addCase(getInterestsReceived.pending, (state) => {
        state.loading.received = true;
        state.error.received = null;
      })
      .addCase(getInterestsReceived.fulfilled, (state, action) => {
        state.loading.received = false;
        state.interestsReceived = action.payload;
        state.error.received = null;
      })
      .addCase(getInterestsReceived.rejected, (state, action) => {
        state.loading.received = false;
        state.error.received = action.payload;
      })

      // Interests Sent
      .addCase(getInterestsSent.pending, (state) => {
        state.loading.sent = true;
        state.error.sent = null;
      })
      .addCase(getInterestsSent.fulfilled, (state, action) => {
        state.loading.sent = false;
        state.interestsSent = action.payload;
        state.error.sent = null;
      })
      .addCase(getInterestsSent.rejected, (state, action) => {
        state.loading.sent = false;
        state.error.sent = action.payload;
      })

      // Accept Interest
      .addCase(acceptInterest.fulfilled, (state, action) => {
        const index = state.interestsReceived.findIndex(
          interest => interest.id === action.payload.interestId
        );
        if (index !== -1) {
          state.interestsReceived[index].status = 'accepted';
        }
      })

      // Decline Interest
      .addCase(declineInterest.fulfilled, (state, action) => {
        const index = state.interestsReceived.findIndex(
          interest => interest.id === action.payload.interestId
        );
        if (index !== -1) {
          state.interestsReceived[index].status = 'declined';
        }
      });
  }
});

export const { clearActivityErrors, updateActivitySummary } = activitySlice.actions;

export default activitySlice.reducer;
