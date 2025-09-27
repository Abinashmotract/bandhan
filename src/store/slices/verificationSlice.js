import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { verificationAPI } from '../../services/apiService';

const initialState = {
  verificationStatus: null,
  loading: false,
  error: null
};

// Send email verification
export const sendEmailVerification = createAsyncThunk(
  'verification/sendEmailVerification',
  async (_, { rejectWithValue }) => {
    try {
      const response = await verificationAPI.sendEmailVerification();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send email verification');
    }
  }
);

// Confirm email verification
export const confirmEmailVerification = createAsyncThunk(
  'verification/confirmEmailVerification',
  async (token, { rejectWithValue }) => {
    try {
      const response = await verificationAPI.confirmEmailVerification(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to confirm email verification');
    }
  }
);

// Send phone verification
export const sendPhoneVerification = createAsyncThunk(
  'verification/sendPhoneVerification',
  async (phoneData, { rejectWithValue }) => {
    try {
      const response = await verificationAPI.sendPhoneVerification(phoneData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send phone verification');
    }
  }
);

// Confirm phone verification
export const confirmPhoneVerification = createAsyncThunk(
  'verification/confirmPhoneVerification',
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await verificationAPI.confirmPhoneVerification(otpData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to confirm phone verification');
    }
  }
);

// Upload ID verification
export const uploadIdVerification = createAsyncThunk(
  'verification/uploadIdVerification',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await verificationAPI.uploadIdVerification(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload ID verification');
    }
  }
);

// Upload verification photos
export const uploadVerificationPhotos = createAsyncThunk(
  'verification/uploadVerificationPhotos',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await verificationAPI.uploadVerificationPhotos(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload verification photos');
    }
  }
);

// Get verification status
export const getVerificationStatus = createAsyncThunk(
  'verification/getVerificationStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await verificationAPI.getVerificationStatus();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get verification status');
    }
  }
);

const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    clearVerificationStatus: (state) => {
      state.verificationStatus = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Send email verification
      .addCase(sendEmailVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendEmailVerification.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(sendEmailVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Confirm email verification
      .addCase(confirmEmailVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmEmailVerification.fulfilled, (state, action) => {
        state.loading = false;
        if (state.verificationStatus) {
          state.verificationStatus.emailVerified = true;
        }
      })
      .addCase(confirmEmailVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Send phone verification
      .addCase(sendPhoneVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendPhoneVerification.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(sendPhoneVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Confirm phone verification
      .addCase(confirmPhoneVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmPhoneVerification.fulfilled, (state, action) => {
        state.loading = false;
        if (state.verificationStatus) {
          state.verificationStatus.phoneVerified = true;
        }
      })
      .addCase(confirmPhoneVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload ID verification
      .addCase(uploadIdVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadIdVerification.fulfilled, (state, action) => {
        state.loading = false;
        if (state.verificationStatus) {
          state.verificationStatus.idVerification = action.payload.data;
        }
      })
      .addCase(uploadIdVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload verification photos
      .addCase(uploadVerificationPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadVerificationPhotos.fulfilled, (state, action) => {
        state.loading = false;
        if (state.verificationStatus) {
          state.verificationStatus.photoVerification = action.payload.data;
        }
      })
      .addCase(uploadVerificationPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get verification status
      .addCase(getVerificationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVerificationStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.verificationStatus = action.payload.data;
      })
      .addCase(getVerificationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearVerificationStatus, clearError } = verificationSlice.actions;
export default verificationSlice.reducer;
