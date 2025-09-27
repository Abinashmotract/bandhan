// Update user status
export const updateUserStatus = createAsyncThunk(
  'admin/updateUserStatus',
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateUserStatus(userId, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user status');
    }
  }
);
// Get system notifications
export const getSystemNotifications = createAsyncThunk(
  'admin/getSystemNotifications',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getSystemNotifications(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get system notifications');
    }
  }
);
// Get report details
export const getReportDetails = createAsyncThunk(
  'admin/getReportDetails',
  async (reportId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getReportDetails(reportId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get report details');
    }
  }
);
// Delete system notification
export const deleteSystemNotification = createAsyncThunk(
  'admin/deleteSystemNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.deleteSystemNotification(notificationId);
      return { notificationId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete system notification');
    }
  }
);
// Block user
export const blockUser = createAsyncThunk(
  'admin/blockUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.blockUser(userId);
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to block user');
    }
  }
);

// Unblock user
export const unblockUser = createAsyncThunk(
  'admin/unblockUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.unblockUser(userId);
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unblock user');
    }
  }
);
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminAPI } from '../../services/apiService';

const initialState = {
  users: [],
  userDetails: null,
  reports: [],
  analytics: null,
  dashboardStats: null,
  systemLogs: [],
  auditTrails: [],
  loading: false,
  error: null,
  pagination: null
};

// Get all users
export const getAllUsers = createAsyncThunk(
  'admin/getAllUsers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAllUsers(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get users');
    }
  }
);

// Get user details
export const getUserDetails = createAsyncThunk(
  'admin/getUserDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getUserDetails(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user details');
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateUser(userId, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.deleteUser(userId);
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

// Get reports
export const getReports = createAsyncThunk(
  'admin/getReports',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getReports(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get reports');
    }
  }
);

// Resolve report
export const resolveReport = createAsyncThunk(
  'admin/resolveReport',
  async ({ reportId, resolutionData }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.resolveReport(reportId, resolutionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to resolve report');
    }
  }
);

// Get analytics
export const getAnalytics = createAsyncThunk(
  'admin/getAnalytics',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAnalytics(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get analytics');
    }
  }
);

// Get dashboard stats
export const getDashboardStats = createAsyncThunk(
  'admin/getDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getDashboardStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get dashboard stats');
    }
  }
);

// Send system notification
export const sendSystemNotification = createAsyncThunk(
  'admin/sendSystemNotification',
  async (notificationData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.sendSystemNotification(notificationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send system notification');
    }
  }
);

// Get system logs
export const getSystemLogs = createAsyncThunk(
  'admin/getSystemLogs',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getSystemLogs(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get system logs');
    }
  }
);

// Get audit trails
export const getAuditTrails = createAsyncThunk(
  'admin/getAuditTrails',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAuditTrails(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get audit trails');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = [];
      state.pagination = null;
      state.error = null;
    },
    clearUserDetails: (state) => {
      state.userDetails = null;
      state.error = null;
    },
    clearReports: (state) => {
      state.reports = [];
      state.pagination = null;
      state.error = null;
    },
    clearAnalytics: (state) => {
      state.analytics = null;
      state.error = null;
    },
    clearDashboardStats: (state) => {
      state.dashboardStats = null;
      state.error = null;
    },
    clearSystemLogs: (state) => {
      state.systemLogs = [];
      state.error = null;
    },
    clearAuditTrails: (state) => {
      state.auditTrails = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get user details
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload.data;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        // Update user in the list if it exists
        const updatedUser = action.payload.data;
        const index = state.users.findIndex(user => user._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
        if (state.userDetails && state.userDetails._id === updatedUser._id) {
          state.userDetails = updatedUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const { userId } = action.payload;
        state.users = state.users.filter(user => user._id !== userId);
        if (state.userDetails && state.userDetails._id === userId) {
          state.userDetails = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get reports
      .addCase(getReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.data || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(getReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Resolve report
      .addCase(resolveReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resolveReport.fulfilled, (state, action) => {
        state.loading = false;
        const resolvedReport = action.payload.data;
        const index = state.reports.findIndex(report => report._id === resolvedReport._id);
        if (index !== -1) {
          state.reports[index] = resolvedReport;
        }
      })
      .addCase(resolveReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get analytics
      .addCase(getAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload.data;
      })
      .addCase(getAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get dashboard stats
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload.data;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Send system notification
      .addCase(sendSystemNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendSystemNotification.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(sendSystemNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get system logs
      .addCase(getSystemLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSystemLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.systemLogs = action.payload.data || [];
      })
      .addCase(getSystemLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get audit trails
      .addCase(getAuditTrails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAuditTrails.fulfilled, (state, action) => {
        state.loading = false;
        state.auditTrails = action.payload.data || [];
      })
      .addCase(getAuditTrails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearUsers,
  clearUserDetails,
  clearReports,
  clearAnalytics,
  clearDashboardStats,
  clearSystemLogs,
  clearAuditTrails,
  clearError
} = adminSlice.actions;
export default adminSlice.reducer;
