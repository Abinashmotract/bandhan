// ================================
// MESSAGING SERVICE - SUPPORTS BOTH FIREBASE AND API
// ================================

import {
  sendMessageFirebase,
  subscribeToMessages,
  loadChatHistoryFirebase,
  markMessagesAsReadFirebase,
  deleteMessageFirebase,
  generateRoomId,
  setTypingIndicator,
} from "./firebase";
import { messagingAPI } from "../services/apiService";
import Cookies from "js-cookie";

/**
 * Determine whether to use Firebase or API based on environment
 * @returns {boolean} true if Firebase should be used
 */
export const shouldUseFirebase = () => {
  return import.meta.env.VITE_USE_FIREBASE === "true";
};

/**
 * Send a message using Firebase or API
 * @param {Object} messageConfig - Configuration object
 * @returns {Promise<Object>} Message object
 */
export const sendMessageService = async (messageConfig) => {
  const {
    roomId,
    senderId,
    receiverId,
    content,
    messageType = "text",
    userId, // For API fallback
  } = messageConfig;

  if (shouldUseFirebase()) {
    return sendMessageFirebase(roomId, senderId, receiverId, content, messageType);
  } else {
    // Fallback to API
    const messageData = {
      content: content.trim(),
      messageType: messageType,
    };
    const response = await messagingAPI.sendMessage(userId, messageData);
    return response.data?.data || response.data;
  }
};

/**
 * Load chat history using Firebase or API
 * @param {Object} config - Configuration object
 * @returns {Promise<Array>} Array of messages
 */
export const loadChatHistoryService = async (config) => {
  const { roomId, userId, limit = 50 } = config;

  if (shouldUseFirebase()) {
    return loadChatHistoryFirebase(roomId, limit);
  } else {
    // Fallback to API
    const response = await messagingAPI.getChatHistory(userId, {
      limit,
    });
    return response.data?.data?.messages || response.data?.messages || [];
  }
};

/**
 * Subscribe to real-time messages
 * @param {Object} config - Configuration object
 * @param {Function} callback - Callback function
 * @returns {Function|null} Unsubscribe function or null
 */
export const subscribeToMessagesService = (config, callback) => {
  const { roomId } = config;

  if (shouldUseFirebase()) {
    return subscribeToMessages(roomId, callback);
  } else {
    // API doesn't support real-time subscriptions via this method
    console.warn(
      "Real-time message subscriptions only available with Firebase"
    );
    return null;
  }
};

/**
 * Mark messages as read
 * @param {Object} config - Configuration object
 * @returns {Promise<void>}
 */
export const markMessagesAsReadService = async (config) => {
  const { roomId, userId } = config;

  if (shouldUseFirebase()) {
    return markMessagesAsReadFirebase(roomId, userId);
  } else {
    // Fallback to API
    return messagingAPI.markMessagesRead(userId);
  }
};

/**
 * Delete a message
 * @param {Object} config - Configuration object
 * @returns {Promise<void>}
 */
export const deleteMessageService = async (config) => {
  const { roomId, messageId } = config;

  if (shouldUseFirebase()) {
    return deleteMessageFirebase(roomId, messageId);
  } else {
    // Fallback to API
    return messagingAPI.deleteMessage(messageId);
  }
};

/**
 * Set typing indicator
 * @param {Object} config - Configuration object
 * @returns {Promise<void>}
 */
export const setTypingIndicatorService = async (config) => {
  const { roomId, userId, isTyping } = config;

  if (shouldUseFirebase()) {
    return setTypingIndicator(roomId, userId, isTyping);
  } else {
    // API doesn't have built-in typing indicator for Firebase
    console.warn("Typing indicators only available with Firebase");
    return null;
  }
};

/**
 * Get current user ID from token
 * @returns {Promise<string>} Current user ID
 */
export const getCurrentUserIdFromToken = async () => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) {
      return null;
    }

    // Decode JWT token to get user ID
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return payload.userId || payload.id || payload.sub;
  } catch (error) {
    console.error("Error getting user ID from token:", error);
    return null;
  }
};

export default {
  shouldUseFirebase,
  sendMessageService,
  loadChatHistoryService,
  subscribeToMessagesService,
  markMessagesAsReadService,
  deleteMessageService,
  setTypingIndicatorService,
  getCurrentUserIdFromToken,
};
