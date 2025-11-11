import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../../utils/api";

// Async thunks
export const getOnlineMatches = createAsyncThunk(
  "activity/getOnlineMatches",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/activity/online-matches`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch online matches"
      );
    }
  }
);

export const getShortlistedProfiles = createAsyncThunk(
  "activity/getShortlistedProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(`${API_BASE_URL}/activity/shortlisted`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch shortlisted profiles"
      );
    }
  }
);

export const getInterestsReceived = createAsyncThunk(
  "activity/getInterestsReceived",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/activity/interests/received`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch received interests"
      );
    }
  }
);

export const getInterestsSent = createAsyncThunk(
  "activity/getInterestsSent",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/activity/interests/sent`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sent interests"
      );
    }
  }
);

export const acceptInterest = createAsyncThunk(
  "activity/acceptInterest",
  async (interestId, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/activity/interests/${interestId}/approved`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { interestId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to accept interest"
      );
    }
  }
);

export const declineInterest = createAsyncThunk(
  "activity/declineInterest",
  async (interestId, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/activity/interests/${interestId}/decline`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { interestId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to decline interest"
      );
    }
  }
);

export const getAcceptedInterests = createAsyncThunk(
  "activity/getAcceptedInterests",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/activity/interests/accepted`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch accepted interests"
      );
    }
  }
);

export const getDeclinedInterests = createAsyncThunk(
  "activity/getDeclinedInterests",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/activity/interests/declined`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch declined interests"
      );
    }
  }
);

const initialState = {
  onlineMatches: [],
  shortlistedProfiles: [],
  interestsReceived: [],
  interestsSent: [],
  acceptedInterests: [],
  declinedInterests: [],
  summary: {
    acceptedInterests: 0,
    interestsReceived: 0,
    interestsSent: 0,
    shortlistedProfiles: 0,
    declinedInterests: 0,
    onlineMatches: 0,
  },
  loading: {
    onlineMatches: false,
    shortlisted: false,
    received: false,
    sent: false,
    accepted: false,
    declined: false,
  },
  error: {
    onlineMatches: null,
    shortlisted: null,
    received: null,
    sent: null,
    accepted: null,
    declined: null,
  },
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    clearActivityErrors: (state) => {
      state.error = {
        onlineMatches: null,
        shortlisted: null,
        received: null,
        sent: null,
        accepted: null,
        declined: null,
      };
    },
    updateActivitySummary: (state) => {
      state.summary = {
        acceptedInterests: Array.isArray(state.acceptedInterests)
          ? state.acceptedInterests.length
          : 0,
        interestsReceived: Array.isArray(state.interestsReceived)
          ? state.interestsReceived.filter((i) => i.status === "sent").length
          : 0,
        interestsSent: Array.isArray(state.interestsSent)
          ? state.interestsSent.length
          : 0,
        shortlistedProfiles: Array.isArray(state.shortlistedProfiles?.profiles)
          ? state.shortlistedProfiles.profiles.length
          : Array.isArray(state.shortlistedProfiles)
          ? state.shortlistedProfiles.length
          : 0,
        declinedInterests: Array.isArray(state.declinedInterests)
          ? state.declinedInterests.length
          : 0,
        onlineMatches: Array.isArray(state.onlineMatches)
          ? state.onlineMatches.length
          : 0,
      };
    },
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
        state.shortlistedProfiles =
          action.payload?.data || action.payload || [];
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
        state.interestsReceived =
          action.payload?.data?.interests ||
          action.payload?.interests ||
          action.payload ||
          [];
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
        state.interestsSent =
          action.payload?.data?.interests ||
          action.payload?.interests ||
          action.payload ||
          [];
        state.error.sent = null;
      })
      .addCase(getInterestsSent.rejected, (state, action) => {
        state.loading.sent = false;
        state.error.sent = action.payload;
      })

      // Accept Interest
      .addCase(acceptInterest.fulfilled, (state, action) => {
        const index = state.interestsReceived.findIndex(
          (interest) => interest.id === action.payload.interestId
        );
        if (index !== -1) {
          state.interestsReceived[index].status = "accepted";
        }
      })

      // Decline Interest
      .addCase(declineInterest.fulfilled, (state, action) => {
        const index = state.interestsReceived.findIndex(
          (interest) => interest.id === action.payload.interestId
        );
        if (index !== -1) {
          state.interestsReceived[index].status = "declined";
        }
      })

      // Accepted Interests - FIXED
      .addCase(getAcceptedInterests.pending, (state) => {
        state.loading.accepted = true;
        state.error.accepted = null;
      })
      .addCase(getAcceptedInterests.fulfilled, (state, action) => {
        state.loading.accepted = false;
        // Extract interests array from the API response with proper path
        state.acceptedInterests =
          action.payload?.data?.interests ||
          action.payload?.interests ||
          action.payload ||
          [];
        state.error.accepted = null;
      })
      .addCase(getAcceptedInterests.rejected, (state, action) => {
        state.loading.accepted = false;
        state.error.accepted = action.payload;
      })

      // Declined Interests - FIXED
      .addCase(getDeclinedInterests.pending, (state) => {
        state.loading.declined = true;
        state.error.declined = null;
      })
      .addCase(getDeclinedInterests.fulfilled, (state, action) => {
        state.loading.declined = false;
        // Extract interests array from the API response with proper path
        state.declinedInterests =
          action.payload?.data?.interests ||
          action.payload?.interests ||
          action.payload ||
          [];
        state.error.declined = null;
      })
      .addCase(getDeclinedInterests.rejected, (state, action) => {
        state.loading.declined = false;
        state.error.declined = action.payload;
      });
  },
});

export const { clearActivityErrors, updateActivitySummary } =
  activitySlice.actions;

export default activitySlice.reducer;
