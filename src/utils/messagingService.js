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
import Cookies from "js-cookie";

/**
 * Send a message using Firebase
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
  } = messageConfig;

  return sendMessageFirebase(roomId, senderId, receiverId, content, messageType);
};

/**
 * Load chat history using Firebase
 * @param {Object} config - Configuration object
 * @returns {Promise<Array>} Array of messages
 */
export const loadChatHistoryService = async (config) => {
  const { roomId, limit = 50 } = config;

  return loadChatHistoryFirebase(roomId, limit);
};

/**
 * Subscribe to real-time messages
 * @param {Object} config - Configuration object
 * @param {Function} callback - Callback function
 * @returns {Function|null} Unsubscribe function or null
 */
export const subscribeToMessagesService = (config, callback) => {
  const { roomId } = config;

  return subscribeToMessages(roomId, callback);
};

/**
 * Mark messages as read
 * @param {Object} config - Configuration object
 * @returns {Promise<void>}
 */
export const markMessagesAsReadService = async (config) => {
  const { roomId, userId } = config;

  return markMessagesAsReadFirebase(roomId, userId);
};

/**
 * Delete a message
 * @param {Object} config - Configuration object
 * @returns {Promise<void>}
 */
export const deleteMessageService = async (config) => {
  const { roomId, messageId } = config;

  return deleteMessageFirebase(roomId, messageId);
};

/**
 * Set typing indicator
 * @param {Object} config - Configuration object
 * @returns {Promise<void>}
 */
export const setTypingIndicatorService = async (config) => {
  const { roomId, userId, isTyping } = config;

  return setTypingIndicator(roomId, userId, isTyping);
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
  sendMessageService,
  loadChatHistoryService,
  subscribeToMessagesService,
  markMessagesAsReadService,
  deleteMessageService,
  setTypingIndicatorService,
  getCurrentUserIdFromToken,
};
