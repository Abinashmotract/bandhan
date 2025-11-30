import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
