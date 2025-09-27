import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import Cookies from 'js-cookie';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = Cookies.get('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken
          });
          
          const { accessToken } = response.data.data;
          Cookies.set('accessToken', accessToken, { expires: 1 });
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// ================================
// AUTHENTICATION & USER MANAGEMENT
// ================================
export const authAPI = {
  // User registration
  signup: (userData) => apiClient.post('/auth/signup', userData),
  
  // User login
  login: (credentials) => apiClient.post('/auth/login', credentials),
  
  // User logout
  logout: () => apiClient.post('/auth/logout'),
  
  // Refresh token
  refreshToken: (refreshToken) => apiClient.post('/auth/refresh-token', { refreshToken }),
  
  // Forgot password
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  
  // Verify OTP
  verifyOTP: (email, otp) => apiClient.post('/auth/verify-otp', { email, otp }),
  
  // Reset password
  resetPassword: (resetData) => apiClient.post('/auth/reset-password', resetData),
  
  // Get current user details
  getCurrentUser: () => apiClient.get('/auth/user'),
  
  // Update user profile
  updateProfile: (userData) => apiClient.put('/auth/user/update', userData),
  
  // Update profile picture
  updateProfilePicture: (formData) => apiClient.put('/auth/user/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

// ================================
// PROFILE MANAGEMENT
// ================================
export const profileAPI = {
  // Get all profiles
  getAllProfiles: (params = {}) => apiClient.get('/profiles/list', { params }),
  
  // Get matched profiles
  getMatchedProfiles: (params = {}) => apiClient.get('/profiles/matches', { params }),
  
  // Filter profiles
  filterProfiles: (filters = {}) => apiClient.get('/profiles/filter', { params: filters })
};

// ================================
// SEARCH & MATCHING
// ================================
export const searchAPI = {
  // Advanced search with filters
  searchProfiles: (filters = {}) => apiClient.get('/search', { params: filters }),
  
  // Get recommended matches
  getRecommendations: (params = {}) => apiClient.get('/search/recommendations', { params }),
  
  // Save search filter
  saveSearchFilter: (filterData) => apiClient.post('/search/save', filterData),
  
  // Get saved search filters
  getSavedFilters: () => apiClient.get('/search/saved'),
  
  // Delete saved search filter
  deleteSavedFilter: (filterId) => apiClient.delete(`/search/saved/${filterId}`)
};

// ================================
// INTERACTIONS
// ================================
export const interactionAPI = {
  // Like a profile
  likeProfile: (userId) => apiClient.post(`/interactions/like/${userId}`),
  
  // Super like a profile
  superlikeProfile: (userId) => apiClient.post(`/interactions/superlike/${userId}`),
  
  // Add to favourites
  addToFavourites: (userId) => apiClient.post(`/interactions/favourite/${userId}`),
  
  // Remove from favourites
  removeFromFavourites: (userId) => apiClient.delete(`/interactions/favourite/${userId}`),
  
  // Block a user
  blockUser: (userId) => apiClient.post(`/interactions/block/${userId}`),
  
  // Unblock a user
  unblockUser: (userId) => apiClient.delete(`/interactions/block/${userId}`),
  
  // Report a user
  reportUser: (userId, reportData) => apiClient.post(`/interactions/report/${userId}`, reportData),
  
  // Get interaction history
  getInteractionHistory: (params = {}) => apiClient.get('/interactions/history', { params }),
  
  // Get profile views
  getProfileViews: (params = {}) => apiClient.get('/interactions/views', { params }),
  
  // Get favourites list
  getFavourites: (params = {}) => apiClient.get('/interactions/favourites', { params })
};

// ================================
// MESSAGING
// ================================
export const messagingAPI = {
  // Send message to a user
  sendMessage: (userId, messageData) => apiClient.post(`/chat/${userId}`, messageData),
  
  // Get chat history with a user
  getChatHistory: (userId, params = {}) => apiClient.get(`/chat/${userId}`, { params }),
  
  // Get all chat rooms
  getChatRooms: (params = {}) => apiClient.get('/chat', { params }),
  
  // Mark messages as read
  markMessagesRead: (userId) => apiClient.post(`/chat/${userId}/read`),
  
  // Delete a message
  deleteMessage: (messageId) => apiClient.delete(`/chat/message/${messageId}`),
  
  // Add reaction to message
  addMessageReaction: (messageId, reactionData) => apiClient.post(`/chat/message/${messageId}/reaction`, reactionData),
  
  // Get typing status
  getTypingStatus: (userId) => apiClient.get(`/chat/${userId}/typing`)
};

// ================================
// SUBSCRIPTION & PAYMENTS
// ================================
export const subscriptionAPI = {
  // Get available subscription plans
  getSubscriptionPlans: (params = {}) => apiClient.get('/user/membership/plans', { params }),
  
  // Subscribe to a plan
  subscribeToPlan: (planData) => apiClient.post('/user/membership/subscribe', planData),
  
  // Stripe webhook for payment events
  handleWebhook: (webhookData) => apiClient.post('/user/membership/webhook', webhookData),
  
  // Check subscription status
  getSubscriptionStatus: () => apiClient.get('/user/membership/status'),
  
  // Cancel subscription
  cancelSubscription: () => apiClient.post('/user/membership/cancel')
};

// ================================
// VERIFICATION
// ================================
export const verificationAPI = {
  // Send email verification
  sendEmailVerification: () => apiClient.post('/verify/email'),
  
  // Confirm email verification
  confirmEmailVerification: (token) => apiClient.get(`/verify/email/confirm?token=${token}`),
  
  // Send phone OTP
  sendPhoneVerification: (phoneData) => apiClient.post('/verify/phone', phoneData),
  
  // Confirm phone verification
  confirmPhoneVerification: (otpData) => apiClient.post('/verify/phone/confirm', otpData),
  
  // Upload government ID for verification
  uploadIdVerification: (formData) => apiClient.post('/verify/id', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Upload verification photos
  uploadVerificationPhotos: (formData) => apiClient.post('/verify/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Get verification status
  getVerificationStatus: () => apiClient.get('/verify/status')
};

// ================================
// NOTIFICATIONS
// ================================
export const notificationAPI = {
  // Get user notifications
  getNotifications: (params = {}) => apiClient.get('/notifications', { params }),
  
  // Mark notification as read
  markNotificationRead: (notificationId) => apiClient.post(`/notifications/read/${notificationId}`),
  
  // Mark all notifications as read
  markAllNotificationsRead: () => apiClient.post('/notifications/read-all'),
  
  // Delete notification
  deleteNotification: (notificationId) => apiClient.delete(`/notifications/${notificationId}`),
  
  // Delete all notifications
  deleteAllNotifications: () => apiClient.delete('/notifications')
};

// ================================
// ADMIN PANEL
// ================================
export const adminAPI = {
  // List all users with filters
  getAllUsers: (params = {}) => apiClient.get('/admin/panel/users', { params }),
  
  // Get specific user details
  getUserDetails: (userId) => apiClient.get(`/admin/panel/users/${userId}`),
  
  // Update user (ban, suspend, verify, etc.)
  updateUser: (userId, userData) => apiClient.put(`/admin/panel/users/${userId}`, userData),
  
  // Delete user
  deleteUser: (userId) => apiClient.delete(`/admin/panel/users/${userId}`),
  
  // View reported users/content
  getReports: (params = {}) => apiClient.get('/admin/panel/reports', { params }),
  
  // Resolve a report
  resolveReport: (reportId, resolutionData) => apiClient.put(`/admin/panel/reports/${reportId}/resolve`, resolutionData),
  
  // Platform analytics
  getAnalytics: (params = {}) => apiClient.get('/admin/panel/analytics', { params }),
  
  // Dashboard statistics
  getDashboardStats: () => apiClient.get('/admin/panel/dashboard'),
  
  // Send system-wide notification
  sendSystemNotification: (notificationData) => apiClient.post('/admin/panel/notifications', notificationData),
  
  // Get system logs
  getSystemLogs: (params = {}) => apiClient.get('/admin/panel/logs', { params }),
  
  // View audit trails
  getAuditTrails: (params = {}) => apiClient.get('/admin/panel/audit', { params })
};

// ================================
// SYSTEM & SECURITY
// ================================
export const systemAPI = {
  // Health check endpoint
  healthCheck: () => axios.get(`${API_BASE_URL.replace('/api', '')}/health`)
};

// ================================
// CONTACT
// ================================
export const contactAPI = {
  // Submit contact form
  submitContactForm: (contactData) => apiClient.post('/contact', contactData)
};

// Export default apiClient for custom requests
export default apiClient;
