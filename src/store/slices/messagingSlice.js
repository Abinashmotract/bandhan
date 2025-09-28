import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { messagingAPI } from '../../services/apiService';

const initialState = {
  chatRooms: [],
  currentChat: [],
  messages: {},
  typingUsers: {},
  loading: false,
  error: null,
  pagination: null
};

// Send message
export const sendMessage = createAsyncThunk(
  'messaging/sendMessage',
  async ({ userId, messageData }, { rejectWithValue }) => {
    try {
      const response = await messagingAPI.sendMessage(userId, messageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

// Get chat history
export const getChatHistory = createAsyncThunk(
  'messaging/getChatHistory',
  async ({ userId, params }, { rejectWithValue }) => {
    try {
      const response = await messagingAPI.getChatHistory(userId, params);
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get chat history');
    }
  }
);

// Get chat rooms
export const getChatRooms = createAsyncThunk(
  'messaging/getChatRooms',
  async (params, { rejectWithValue }) => {
    try {
      const response = await messagingAPI.getChatRooms(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get chat rooms');
    }
  }
);

// Mark messages as read
export const markMessagesRead = createAsyncThunk(
  'messaging/markMessagesRead',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await messagingAPI.markMessagesRead(userId);
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark messages as read');
    }
  }
);

// Delete message
export const deleteMessage = createAsyncThunk(
  'messaging/deleteMessage',
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await messagingAPI.deleteMessage(messageId);
      return { messageId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete message');
    }
  }
);

// Add message reaction
export const addMessageReaction = createAsyncThunk(
  'messaging/addMessageReaction',
  async ({ messageId, reactionData }, { rejectWithValue }) => {
    try {
      const response = await messagingAPI.addMessageReaction(messageId, reactionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add message reaction');
    }
  }
);

// Get typing status
export const getTypingStatus = createAsyncThunk(
  'messaging/getTypingStatus',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await messagingAPI.getTypingStatus(userId);
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get typing status');
    }
  }
);

const messagingSlice = createSlice({
  name: 'messaging',
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
        const messageIndex = state.messages[userId].findIndex(msg => msg._id === messageId);
        if (messageIndex !== -1) {
          state.messages[userId][messageIndex] = { ...state.messages[userId][messageIndex], ...updates };
        }
      }
    },
    removeMessage: (state, action) => {
      const { userId, messageId } = action.payload;
      if (state.messages[userId]) {
        state.messages[userId] = state.messages[userId].filter(msg => msg._id !== messageId);
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
    }
  },
  extraReducers: (builder) => {
    builder
      // Send message
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

      // Get chat history
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

      // Get chat rooms
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

      // Mark messages as read
      .addCase(markMessagesRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markMessagesRead.fulfilled, (state, action) => {
        state.loading = false;
        const { userId } = action.payload;
        if (state.messages[userId]) {
          state.messages[userId] = state.messages[userId].map(msg => ({
            ...msg,
            isRead: true
          }));
        }
      })
      .addCase(markMessagesRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete message
      .addCase(deleteMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.loading = false;
        const { messageId } = action.payload;
        // Remove message from all chat histories
        Object.keys(state.messages).forEach(userId => {
          state.messages[userId] = state.messages[userId].filter(msg => msg._id !== messageId);
        });
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add message reaction
      .addCase(addMessageReaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMessageReaction.fulfilled, (state, action) => {
        state.loading = false;
        // Handle reaction update in messages
      })
      .addCase(addMessageReaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get typing status
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
  }
});

export const {
  setCurrentChat,
  addMessage,
  updateMessage,
  removeMessage,
  setTypingUser,
  clearCurrentChat,
  clearMessages,
  clearError
} = messagingSlice.actions;
export default messagingSlice.reducer;
