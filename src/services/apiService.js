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
  }),
  
  // Upload profile image
  uploadProfileImage: (formData) => apiClient.post('/auth/user/upload-profile-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Remove profile image
  removeProfileImage: () => apiClient.delete('/auth/user/remove-profile-image')
};

// Notifications API
export const notificationsAPI = {
  // Get user notifications
  getNotifications: (params = {}) => apiClient.get('/notifications', { params }),
  
  // Get notification count
  getNotificationCount: () => apiClient.get('/notifications/count'),
  
  // Mark notification as read
  markAsRead: (notificationId) => apiClient.patch(`/notifications/${notificationId}/read`),
  
  // Mark all notifications as read
  markAllAsRead: () => apiClient.patch('/notifications/read-all'),
  
  // Delete notification
  deleteNotification: (notificationId) => apiClient.delete(`/notifications/${notificationId}`)
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
  deleteSavedFilter: (filterId) => apiClient.delete(`/search/saved/${filterId}`),
  
  // New search methods for dynamic data
  getCriteria: () => apiClient.get('/search/criteria'),
  searchByCriteria: (criteria) => apiClient.post('/search/by-criteria', criteria),
  searchByProfileId: (profileId) => apiClient.get(`/search/by-profile-id/${profileId}`)
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
  
  // Send interest to a user
  sendInterest: (userId, interestData) => apiClient.post(`/interactions/interest/${userId}`, interestData),
  
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

// Add these methods to your existing messagingAPI object in apiService.js

// export const messagingAPI = {
//   // Send message
//   sendMessage: (userId, messageData) => {
//     return apiClient.post(`/chat/send/${userId}`, messageData);
//   },

//   // Get chat history with a user
//   getChatHistory: (userId, params = {}) => {
//     return apiClient.get(`/chat/chat/${userId}`, { params });
//   },

//   // Get all chat rooms (for Acceptances tab)
//   getChatRooms: (params = {}) => {
//     return apiClient.get('/chat/rooms', { params });
//   },

//   // Get interests list (for Interests tab) - NEW ENDPOINT
//   getInterestsList: (params = {}) => {
//     return apiClient.get('/chat/interests', { params });
//   },

//   // Mark messages as read
//   markMessagesRead: (userId) => {
//     return apiClient.put(`/chat/read/${userId}`);
//   },

//   // Delete message
//   deleteMessage: (messageId) => {
//     return apiClient.delete(`/chat/${messageId}`);
//   },

//   // Add reaction to message
//   addMessageReaction: (messageId, reactionData) => {
//     return apiClient.post(`/chat/${messageId}/reaction`, reactionData);
//   },

//   // Get typing status
//   getTypingStatus: (userId) => {
//     return apiClient.get(`/chat/typing/${userId}`);
//   }
// };

// ================================
// SUBSCRIPTION & PAYMENTS
// ================================
export const subscriptionAPI = {
  // Get available subscription plans
  getSubscriptionPlans: (params = {}) => apiClient.get('/user/subscription/plans', { params }),
  
  // Create Razorpay order
  createCheckoutSession: (planId) => apiClient.post('/user/subscription/create-checkout-session', { planId }),
  
  // Get order details
  getCheckoutSessionDetails: (orderId) => apiClient.get(`/user/subscription/checkout-session/${orderId}`),
  
  // Process payment manually (for testing)
  processPaymentManually: (orderId, paymentId) => apiClient.post('/user/subscription/process-payment', { orderId, paymentId }),
  
  // Confirm payment with Razorpay
  confirmPayment: (paymentData) => apiClient.post('/user/subscription/confirm-payment', paymentData),
  
  // Razorpay webhook for payment events
  handleWebhook: (webhookData) => apiClient.post('/user/subscription/webhook', webhookData),
  
  // Check subscription status
  getSubscriptionStatus: () => apiClient.get('/user/subscription/status'),
  
  // Cancel subscription
  cancelSubscription: () => apiClient.post('/user/subscription/cancel'),
  
  // Get subscription history
  getSubscriptionHistory: (params = {}) => apiClient.get('/user/subscription/history', { params }),
  
  // Update payment method
  updatePaymentMethod: (paymentMethodData) => apiClient.post('/user/subscription/update-payment-method', paymentMethodData)
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
  // Update user status (ban, suspend, activate, etc.)
  updateUserStatus: (userId, status) => apiClient.patch(`/admin/panel/users/${userId}/status`, { status }),
  // Get all system notifications
  getSystemNotifications: (params = {}) => apiClient.get('/admin/panel/notifications', { params }),
  // Get details of a specific report
  getReportDetails: (reportId) => apiClient.get(`/admin/panel/reports/${reportId}`),
  // Delete a system notification
  deleteSystemNotification: (notificationId) => apiClient.delete(`/admin/panel/notifications/${notificationId}`),
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

// ================================
// ACTIVITY
// ================================
export const activityAPI = {
  getDashboard: () => apiClient.get('/activity/dashboard'),
  getOnlineMatches: (limit = 22) => apiClient.get('/activity/online-matches', { params: { limit } })
};

// ================================
// CONVERSATIONS
// ================================
export const conversationAPI = {
  getConversations: (tab = 'acceptances') => apiClient.get('/conversations', { params: { tab } }),
  getUpMatchHour: () => apiClient.get('/conversations/up-match-hour'),
  getOnlineMatches: (limit = 22) => apiClient.get('/conversations/online-matches', { params: { limit } })
};


// Export default apiClient for custom requests
export default apiClient;
