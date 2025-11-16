
import { initializeApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  push, 
  set, 
  get, 
  query, 
  orderByChild, 
  startAt, 
  endAt,
  limitToLast,
  onValue,
  update,
  remove
} from 'firebase/database';
import Cookies from 'js-cookie';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

// Initialize Firebase
let firebaseApp;
let database;

export const initializeFirebase = () => {
  try {
    if (!firebaseApp) {
      // Validate that all required config values are present
      const missingConfigs = Object.entries(firebaseConfig)
        .filter(([key, value]) => !value)
        .map(([key]) => key);

      if (missingConfigs.length > 0) {
        console.error(
          'Missing Firebase configuration:',
          missingConfigs.join(', '),
          '\nPlease add these to your .env file'
        );
        return false;
      }

      firebaseApp = initializeApp(firebaseConfig);
      database = getDatabase(firebaseApp);
      console.log('✅ Firebase initialized successfully');
      return true;
    }
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    return false;
  }
};

export const getFirebaseDatabase = () => {
  if (!database) {
    initializeFirebase();
  }
  return database;
};

// ================================
// MESSAGE OPERATIONS
// ================================

/**
 * Generate room ID from two user IDs (ensures consistent room ID regardless of user order)
 * @param {string} userId1 - First user ID
 * @param {string} userId2 - Second user ID
 * @returns {string} Consistent room ID
 */
export const generateRoomId = (userId1, userId2) => {
  const ids = [userId1, userId2].sort();
  return `room_${ids[0]}_${ids[1]}`;
};

/**
 * Send a message to Firebase Realtime Database
 * @param {string} roomId - Chat room ID
 * @param {string} senderId - ID of the message sender
 * @param {string} receiverId - ID of the message receiver
 * @param {string} content - Message content
 * @param {string} messageType - Type of message (text, system, etc.)
 * @returns {Promise<Object>} Message object with Firebase ID
 */
export const sendMessageFirebase = async (
  roomId,
  senderId,
  receiverId,
  content,
  messageType = 'text'
) => {
  try {
    const db = getFirebaseDatabase();
    if (!db) throw new Error('Firebase not initialized');

    const messagesRef = ref(db, `chats/${roomId}/messages`);
    const newMessageRef = push(messagesRef);

    const messageData = {
      _id: newMessageRef.key,
      sender: {
        _id: senderId,
      },
      receiver: {
        _id: receiverId,
      },
      content: content.trim(),
      messageType: messageType,
      createdAt: new Date().toISOString(),
      isRead: false,
      timestamp: Date.now(),
    };

    await set(newMessageRef, messageData);

    // Update room's last message
    await updateRoomLastMessage(roomId, messageData, receiverId);

    return messageData;
  } catch (error) {
    console.error('❌ Error sending message to Firebase:', error);
    throw error;
  }
};

/**
 * Update the room's last message (for conversation list)
 * @param {string} roomId - Chat room ID
 * @param {Object} messageData - Message data
 * @param {string} receiverId - Receiver ID
 */
export const updateRoomLastMessage = async (roomId, messageData, receiverId) => {
  try {
    const db = getFirebaseDatabase();
    if (!db) return;

    const roomRef = ref(db, `chatRooms/${roomId}`);
    await update(roomRef, {
      lastMessage: messageData.content,
      lastMessageTime: messageData.createdAt,
      lastMessageSenderId: messageData.sender._id,
    });
  } catch (error) {
    console.error('Error updating room last message:', error);
  }
};

/**
 * Load chat history from Firebase
 * @param {string} roomId - Chat room ID
 * @param {number} limit - Number of recent messages to load
 * @returns {Promise<Array>} Array of messages
 */
export const loadChatHistoryFirebase = async (roomId, limit = 50) => {
  try {
    const db = getFirebaseDatabase();
    if (!db) throw new Error('Firebase not initialized');

    const messagesRef = ref(db, `chats/${roomId}/messages`);
    const messagesQuery = query(
      messagesRef,
      limitToLast(limit)
    );

    const snapshot = await get(messagesQuery);

    if (!snapshot.exists()) {
      return [];
    }

    const messages = [];
    snapshot.forEach((child) => {
      messages.push(child.val());
    });

    // Return in chronological order (oldest first)
    return messages.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  } catch (error) {
    console.error('❌ Error loading chat history from Firebase:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time message updates
 * @param {string} roomId - Chat room ID
 * @param {Function} callback - Callback function to handle new messages
 * @returns {Function} Unsubscribe function
 */
export const subscribeToMessages = (roomId, callback) => {
  try {
    const db = getFirebaseDatabase();
    if (!db) throw new Error('Firebase not initialized');

    const messagesRef = ref(db, `chats/${roomId}/messages`);

    const unsubscribe = onValue(
      messagesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const messages = [];
          snapshot.forEach((child) => {
            messages.push(child.val());
          });
          
          // Sort by timestamp
          messages.sort((a, b) => a.timestamp - b.timestamp);
          callback(messages);
        }
      },
      (error) => {
        console.error('❌ Error subscribing to messages:', error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('❌ Error in subscribeToMessages:', error);
    throw error;
  }
};

/**
 * Mark messages as read
 * @param {string} roomId - Chat room ID
 * @param {string} receiverId - Receiver ID (the one marking as read)
 */
export const markMessagesAsReadFirebase = async (roomId, receiverId) => {
  try {
    const db = getFirebaseDatabase();
    if (!db) return;

    const messagesRef = ref(db, `chats/${roomId}/messages`);
    const snapshot = await get(messagesRef);

    if (!snapshot.exists()) return;

    const updates = {};
    snapshot.forEach((child) => {
      const message = child.val();
      // Only mark messages where this user is the receiver
      if (message.receiver?._id === receiverId && !message.isRead) {
        updates[`chats/${roomId}/messages/${child.key}/isRead`] = true;
      }
    });

    if (Object.keys(updates).length > 0) {
      const db = getFirebaseDatabase();
      await update(ref(db), updates);
    }
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};

/**
 * Delete a message
 * @param {string} roomId - Chat room ID
 * @param {string} messageId - Message ID to delete
 */
export const deleteMessageFirebase = async (roomId, messageId) => {
  try {
    const db = getFirebaseDatabase();
    if (!db) throw new Error('Firebase not initialized');

    const messageRef = ref(db, `chats/${roomId}/messages/${messageId}`);
    await remove(messageRef);
  } catch (error) {
    console.error('❌ Error deleting message:', error);
    throw error;
  }
};

/**
 * Get chat rooms list
 * @returns {Promise<Array>} Array of chat rooms
 */
export const getChatRoomsFirebase = async () => {
  try {
    const db = getFirebaseDatabase();
    if (!db) throw new Error('Firebase not initialized');

    const roomsRef = ref(db, 'chatRooms');
    const snapshot = await get(roomsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const rooms = [];
    snapshot.forEach((child) => {
      rooms.push({
        id: child.key,
        ...child.val(),
      });
    });

    // Sort by last message time (newest first)
    return rooms.sort((a, b) => {
      const timeA = new Date(a.lastMessageTime || 0).getTime();
      const timeB = new Date(b.lastMessageTime || 0).getTime();
      return timeB - timeA;
    });
  } catch (error) {
    console.error('❌ Error getting chat rooms:', error);
    throw error;
  }
};

/**
 * Subscribe to typing status
 * @param {string} roomId - Chat room ID
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const subscribeToTypingStatus = (roomId, callback) => {
  try {
    const db = getFirebaseDatabase();
    if (!db) throw new Error('Firebase not initialized');

    const typingRef = ref(db, `typing/${roomId}`);

    const unsubscribe = onValue(
      typingRef,
      (snapshot) => {
        callback(snapshot.val() || {});
      },
      (error) => {
        console.error('❌ Error subscribing to typing status:', error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('❌ Error in subscribeToTypingStatus:', error);
    throw error;
  }
};

/**
 * Set typing indicator
 * @param {string} roomId - Chat room ID
 * @param {string} userId - User ID
 * @param {boolean} isTyping - Whether user is typing
 */
export const setTypingIndicator = async (roomId, userId, isTyping) => {
  try {
    const db = getFirebaseDatabase();
    if (!db) return;

    if (isTyping) {
      const typingRef = ref(db, `typing/${roomId}/${userId}`);
      await set(typingRef, {
        timestamp: Date.now(),
      });

      // Auto-clear after 3 seconds
      setTimeout(async () => {
        await remove(typingRef);
      }, 3000);
    } else {
      const typingRef = ref(db, `typing/${roomId}/${userId}`);
      await remove(typingRef);
    }
  } catch (error) {
    console.error('Error setting typing indicator:', error);
  }
};

/**
 * Get unread message count
 * @param {string} roomId - Chat room ID
 * @param {string} userId - User ID
 * @returns {Promise<number>} Count of unread messages
 */
export const getUnreadMessageCount = async (roomId, userId) => {
  try {
    const db = getFirebaseDatabase();
    if (!db) throw new Error('Firebase not initialized');

    const messagesRef = ref(db, `chats/${roomId}/messages`);
    const snapshot = await get(messagesRef);

    if (!snapshot.exists()) {
      return 0;
    }

    let count = 0;
    snapshot.forEach((child) => {
      const message = child.val();
      if (message.receiver?._id === userId && !message.isRead) {
        count++;
      }
    });

    return count;
  } catch (error) {
    console.error('Error getting unread message count:', error);
    return 0;
  }
};

export default {
  initializeFirebase,
  getFirebaseDatabase,
  generateRoomId,
  sendMessageFirebase,
  loadChatHistoryFirebase,
  subscribeToMessages,
  markMessagesAsReadFirebase,
  deleteMessageFirebase,
  getChatRoomsFirebase,
  subscribeToTypingStatus,
  setTypingIndicator,
  getUnreadMessageCount,
};
