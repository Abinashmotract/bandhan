// src/redux/slices/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/api';

// ✅ Thunk to fetch matched profiles
export const fetchMatchedProfiles = createAsyncThunk(
  "profiles/fetchMatchedProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = Cookies.get("accessToken");
      if (!accessToken) {
        return rejectWithValue("No access token found");
      }

      const response = await axios.get(`${API_BASE_URL}/profiles/matches`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response?.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profiles",
  initialState: {
    profiles: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearProfiles: (state) => {
      state.profiles = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatchedProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatchedProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
      })
      .addCase(fetchMatchedProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch matched profiles";
      });
  },
});

export const { clearProfiles } = profileSlice.actions;
export default profileSlice.reducer;
