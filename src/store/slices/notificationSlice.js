import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationAPI } from '../../services/apiService';

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pagination: null
};

// Get notifications
export const getNotifications = createAsyncThunk(
  'notification/getNotifications',
  async (params, { rejectWithValue }) => {
    try {
      const response = await notificationAPI.getNotifications(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get notifications');
    }
  }
);

// Mark notification as read
export const markNotificationRead = createAsyncThunk(
  'notification/markNotificationRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await notificationAPI.markNotificationRead(notificationId);
      return { notificationId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

// Mark all notifications as read
export const markAllNotificationsRead = createAsyncThunk(
  'notification/markAllNotificationsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationAPI.markAllNotificationsRead();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all notifications as read');
    }
  }
);

// Delete notification
export const deleteNotification = createAsyncThunk(
  'notification/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await notificationAPI.deleteNotification(notificationId);
      return { notificationId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
    }
  }
);

// Delete all notifications
export const deleteAllNotifications = createAsyncThunk(
  'notification/deleteAllNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationAPI.deleteAllNotifications();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete all notifications');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.pagination = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get notifications
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both response formats: { data: { notifications, unreadCount } } or { data: [...] }
        const responseData = action.payload.data || action.payload;
        if (Array.isArray(responseData)) {
          state.notifications = responseData;
          state.unreadCount = responseData.filter(notif => !notif.isRead).length;
        } else if (responseData && responseData.notifications) {
          state.notifications = responseData.notifications || [];
          state.unreadCount = responseData.unreadCount !== undefined 
            ? responseData.unreadCount 
            : state.notifications.filter(notif => !notif.isRead).length;
          state.pagination = responseData.pagination || null;
        } else {
          state.notifications = [];
          state.unreadCount = 0;
        }
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark notification as read
      .addCase(markNotificationRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.loading = false;
        const { notificationId } = action.payload;
        const notification = state.notifications.find(notif => notif._id === notificationId);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark all notifications as read
      .addCase(markAllNotificationsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = state.notifications.map(notif => ({
          ...notif,
          isRead: true
        }));
        state.unreadCount = 0;
      })
      .addCase(markAllNotificationsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete notification
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        const { notificationId } = action.payload;
        const notification = state.notifications.find(notif => notif._id === notificationId);
        if (notification && !notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter(notif => notif._id !== notificationId);
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete all notifications
      .addCase(deleteAllNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAllNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = [];
        state.unreadCount = 0;
      })
      .addCase(deleteAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  addNotification, 
  clearNotifications, 
  clearError, 
  updateUnreadCount 
} = notificationSlice.actions;
export default notificationSlice.reducer;
