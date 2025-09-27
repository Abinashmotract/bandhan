import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import searchReducer from './slices/searchSlice';
import interactionReducer from './slices/interactionSlice';
import messagingReducer from './slices/messagingSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import verificationReducer from './slices/verificationSlice';
import notificationReducer from './slices/notificationSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profiles: profileReducer,
    search: searchReducer,
    interaction: interactionReducer,
    messaging: messagingReducer,
    subscription: subscriptionReducer,
    verification: verificationReducer,
    notification: notificationReducer,
    admin: adminReducer,
  },
});

export default store;