// Thunk to update user profile
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ profileData, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('email', profileData.email);
      formData.append('dob', profileData.dob);
      formData.append('location', profileData.location);
      formData.append('occupation', profileData.occupation);
      formData.append('education', profileData.education);
      formData.append('motherTongue', profileData.motherTongue);
      formData.append('religion', profileData.religion);
      formData.append('caste', profileData.caste);
      formData.append('about', profileData.about);
      formData.append('interests', JSON.stringify(profileData.interests));
      formData.append('preferences', JSON.stringify(profileData.preferences));
      const response = await axios.put(
        `${API_BASE_URL}/auth/user/update`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
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
