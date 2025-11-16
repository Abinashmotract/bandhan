import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { messagingAPI } from "../../services/apiService";
import {
  sendMessageFirebase,
  loadChatHistoryFirebase,
  getChatRoomsFirebase,
  markMessagesAsReadFirebase,
  deleteMessageFirebase,
  initializeFirebase,
} from "../../utils/firebase";

const initialState = {
  chatRooms: [],
  currentChat: [],
  messages: {},
  typingUsers: {},
  loading: false,
  error: null,
  pagination: null,
  useFirebase: import.meta.env.VITE_USE_FIREBASE === "true" || false, // Toggle between Firebase and API
};

// ================================
// FIREBASE ASYNC THUNKS
// ================================

// Send message (Firebase)
export const sendMessageFirebaseThunk = createAsyncThunk(
  "messaging/sendMessageFirebase",
  async (
    { roomId, senderId, receiverId, content, messageType = "text" },
    { rejectWithValue }
  ) => {
    try {
      const initialized = initializeFirebase();
      if (!initialized) {
        throw new Error("Firebase not initialized");
      }

      const message = await sendMessageFirebase(
        roomId,
        senderId,
        receiverId,
        content,
        messageType
      );

      return { userId: receiverId, data: message };
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to send message via Firebase"
      );
    }
  }
);

// Get chat history (Firebase)
export const getChatHistoryFirebaseThunk = createAsyncThunk(
  "messaging/getChatHistoryFirebase",
  async ({ roomId, limit = 50 }, { rejectWithValue }) => {
    try {
      const initialized = initializeFirebase();
      if (!initialized) {
        throw new Error("Firebase not initialized");
      }

      const messages = await loadChatHistoryFirebase(roomId, limit);
      return { roomId, data: { messages, pagination: null } };
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to get chat history from Firebase"
      );
    }
  }
);

// Get chat rooms (Firebase)
export const getChatRoomsFirebaseThunk = createAsyncThunk(
  "messaging/getChatRoomsFirebase",
  async (_, { rejectWithValue }) => {
    try {
      const initialized = initializeFirebase();
      if (!initialized) {
        throw new Error("Firebase not initialized");
      }

      const rooms = await getChatRoomsFirebase();
      return { data: { rooms, pagination: null } };
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to get chat rooms from Firebase"
      );
    }
  }
);

// Mark messages as read (Firebase)
export const markMessagesReadFirebaseThunk = createAsyncThunk(
  "messaging/markMessagesReadFirebase",
  async ({ roomId, userId }, { rejectWithValue }) => {
    try {
      const initialized = initializeFirebase();
      if (!initialized) {
        throw new Error("Firebase not initialized");
      }

      await markMessagesAsReadFirebase(roomId, userId);
      return { roomId, userId };
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to mark messages as read in Firebase"
      );
    }
  }
);

// Delete message (Firebase)
export const deleteMessageFirebaseThunk = createAsyncThunk(
  "messaging/deleteMessageFirebase",
  async ({ roomId, messageId }, { rejectWithValue }) => {
    try {
      const initialized = initializeFirebase();
      if (!initialized) {
        throw new Error("Firebase not initialized");
      }

      await deleteMessageFirebase(roomId, messageId);
      return { roomId, messageId };
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to delete message from Firebase"
      );
    }
  }
);

// ================================
// API ASYNC THUNKS (LEGACY - KEPT FOR BACKUP)
// ================================

// Send message (API)
export const sendMessage = createAsyncThunk(
  "messaging/sendMessage",
  async ({ userId, messageData }, { rejectWithValue }) => {
    try {
      const response = await messagingAPI.sendMessage(userId, messageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message"
      );
    }
  }
);

// Get chat history (API)
export const getChatHistory = createAsyncThunk(
  "messaging/getChatHistory",
  async ({ userId, params }, { rejectWithValue }) => {
    try {
      const response = await messagingAPI.getChatHistory(userId, params);
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get chat history"
      );
    }
  }
);

// Get chat rooms (API)
export const getChatRooms = createAsyncThunk(
  "messaging/getChatRooms",
  async (params, { rejectWithValue }) => {
    try {
      const response = await messagingAPI.getChatRooms(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get chat rooms"
      );
    }
  }
);

// Mark messages as read (API)
export const markMessagesRead = createAsyncThunk(
  "messaging/markMessagesRead",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await messagingAPI.markMessagesRead(userId);
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark messages as read"
      );
    }
  }
);

// Delete message (API)
export const deleteMessage = createAsyncThunk(
  "messaging/deleteMessage",
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await messagingAPI.deleteMessage(messageId);
      return { messageId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete message"
      );
    }
  }
);

// Add message reaction (API)
export const addMessageReaction = createAsyncThunk(
  "messaging/addMessageReaction",
  async ({ messageId, reactionData }, { rejectWithValue }) => {
    try {
      const response = await messagingAPI.addMessageReaction(
        messageId,
        reactionData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add message reaction"
      );
    }
  }
);

// Get typing status (API)
export const getTypingStatus = createAsyncThunk(
  "messaging/getTypingStatus",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await messagingAPI.getTypingStatus(userId);
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get typing status"
      );
    }
  }
);

const messagingSlice = createSlice({
  name: "messaging",
  initialState,
  reducers: {
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    addMessage: (state, action) => {
      const { userId, message } = action.payload;
      if (!state.messages[userId]) {
        state.messages[userId] = [];
      }
      state.messages[userId].push(message);
    },
    updateMessage: (state, action) => {
      const { userId, messageId, updates } = action.payload;
      if (state.messages[userId]) {
        const messageIndex = state.messages[userId].findIndex(
          (msg) => msg._id === messageId
        );
        if (messageIndex !== -1) {
          state.messages[userId][messageIndex] = {
            ...state.messages[userId][messageIndex],
            ...updates,
          };
        }
      }
    },
    removeMessage: (state, action) => {
      const { userId, messageId } = action.payload;
      if (state.messages[userId]) {
        state.messages[userId] = state.messages[userId].filter(
          (msg) => msg._id !== messageId
        );
      }
    },
    setTypingUser: (state, action) => {
      const { userId, isTyping } = action.payload;
      state.typingUsers[userId] = isTyping;
    },
    clearCurrentChat: (state) => {
      state.currentChat = [];
    },
    clearMessages: (state) => {
      state.messages = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    setUseFirebase: (state, action) => {
      state.useFirebase = action.payload;
    },
    addMessageToRoom: (state, action) => {
      const { roomId, message } = action.payload;
      if (!state.messages[roomId]) {
        state.messages[roomId] = [];
      }
      state.messages[roomId].push(message);
    },
    setRoomMessages: (state, action) => {
      const { roomId, messages } = action.payload;
      state.messages[roomId] = messages;
    },
    markRoomMessagesAsRead: (state, action) => {
      const { roomId } = action.payload;
      if (state.messages[roomId]) {
        state.messages[roomId] = state.messages[roomId].map((msg) => ({
          ...msg,
          isRead: true,
        }));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ================================
      // FIREBASE THUNKS HANDLERS
      // ================================

      // Send message via Firebase
      .addCase(sendMessageFirebaseThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessageFirebaseThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, data: message } = action.payload;
        if (!state.messages[userId]) {
          state.messages[userId] = [];
        }
        state.messages[userId].push(message);
      })
      .addCase(sendMessageFirebaseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get chat history via Firebase
      .addCase(getChatHistoryFirebaseThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatHistoryFirebaseThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { roomId, data } = action.payload;
        state.messages[roomId] = data.messages || [];
        state.pagination = data.pagination || null;
      })
      .addCase(getChatHistoryFirebaseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get chat rooms via Firebase
      .addCase(getChatRoomsFirebaseThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatRoomsFirebaseThunk.fulfilled, (state, action) => {
        state.loading = false;
        const payloadData = action.payload?.data || {};
        state.chatRooms = payloadData.rooms || [];
        state.pagination = payloadData.pagination || null;
      })
      .addCase(getChatRoomsFirebaseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark messages as read via Firebase
      .addCase(markMessagesReadFirebaseThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markMessagesReadFirebaseThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { roomId } = action.payload;
        if (state.messages[roomId]) {
          state.messages[roomId] = state.messages[roomId].map((msg) => ({
            ...msg,
            isRead: true,
          }));
        }
      })
      .addCase(markMessagesReadFirebaseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete message via Firebase
      .addCase(deleteMessageFirebaseThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMessageFirebaseThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { roomId, messageId } = action.payload;
        if (state.messages[roomId]) {
          state.messages[roomId] = state.messages[roomId].filter(
            (msg) => msg._id !== messageId
          );
        }
      })
      .addCase(deleteMessageFirebaseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================================
      // API THUNKS HANDLERS (LEGACY)
      // ================================

      // Send message via API
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        const message = action.payload.data;
        const userId = message.receiverId || message.senderId;
        if (!state.messages[userId]) {
          state.messages[userId] = [];
        }
        state.messages[userId].push(message);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get chat history via API
      .addCase(getChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, data } = action.payload;
        const payloadData = data?.data || {};
        state.messages[userId] = payloadData.messages || [];
        state.pagination = payloadData.pagination || null;
      })
      .addCase(getChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get chat rooms via API
      .addCase(getChatRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatRooms.fulfilled, (state, action) => {
        state.loading = false;
        const payloadData = action.payload?.data || {};
        state.chatRooms = payloadData.rooms || [];
        state.pagination = payloadData.pagination || null;
      })
      .addCase(getChatRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark messages as read via API
      .addCase(markMessagesRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markMessagesRead.fulfilled, (state, action) => {
        state.loading = false;
        const { userId } = action.payload;
        if (state.messages[userId]) {
          state.messages[userId] = state.messages[userId].map((msg) => ({
            ...msg,
            isRead: true,
          }));
        }
      })
      .addCase(markMessagesRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete message via API
      .addCase(deleteMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.loading = false;
        const { messageId } = action.payload;
        // Remove message from all chat histories
        Object.keys(state.messages).forEach((userId) => {
          state.messages[userId] = state.messages[userId].filter(
            (msg) => msg._id !== messageId
          );
        });
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add message reaction via API
      .addCase(addMessageReaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMessageReaction.fulfilled, (state) => {
        state.loading = false;
        // Handle reaction update in messages
      })
      .addCase(addMessageReaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get typing status via API
      .addCase(getTypingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTypingStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, data } = action.payload;
        state.typingUsers[userId] = data.isTyping || false;
      })
      .addCase(getTypingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentChat,
  addMessage,
  updateMessage,
  removeMessage,
  setTypingUser,
  clearCurrentChat,
  clearMessages,
  clearError,
  setUseFirebase,
  addMessageToRoom,
  setRoomMessages,
  markRoomMessagesAsRead,
} = messagingSlice.actions;
export default messagingSlice.reducer;
