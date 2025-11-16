// ================================
// FIREBASE MESSAGING - USAGE EXAMPLES
// ================================

// This file shows common patterns for using Firebase messaging
// in your components while maintaining API compatibility

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  sendMessageFirebaseThunk,
  getChatHistoryFirebaseThunk,
  markMessagesReadFirebaseThunk,
} from '@/store/slices/messagingSlice';
import {
  sendMessageService,
  loadChatHistoryService,
  getCurrentUserIdFromToken,
  shouldUseFirebase,
} from '@/utils/messagingService';
import { generateRoomId } from '@/utils/firebase';

// ================================
// EXAMPLE 1: Simple Message Sending
// ================================

function ExampleSimpleSendMessage() {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.messaging.loading);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      const currentUserId = await getCurrentUserIdFromToken();
      const receiverId = 'recipient_user_id';
      const roomId = generateRoomId(currentUserId, receiverId);

      // Using service layer (auto-detects Firebase vs API)
      const messageData = await sendMessageService({
        roomId,
        senderId: currentUserId,
        receiverId,
        content: message,
        messageType: 'text',
        userId: receiverId, // For API fallback
      });

      console.log('Message sent:', messageData);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSend} disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}

// ================================
// EXAMPLE 2: Chat History with Real-time Updates
// ================================

function ExampleChatWindow({ userId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const setupChat = async () => {
      try {
        setLoading(true);

        // Get current user
        const myUserId = await getCurrentUserIdFromToken();
        setCurrentUserId(myUserId);

        // Generate consistent room ID
        const roomId = generateRoomId(myUserId, userId);

        // Load initial history (works with both Firebase and API)
        const history = await loadChatHistoryService({
          roomId,
          userId, // For API fallback
          limit: 50,
        });

        setMessages(history);

        // Subscribe to real-time updates (Firebase only)
        if (shouldUseFirebase()) {
          const unsubscribe = subscribeToMessagesService(
            { roomId },
            (updatedMessages) => {
              setMessages(updatedMessages);
            }
          );

          return unsubscribe;
        }
      } catch (error) {
        console.error('Error loading chat:', error);
      } finally {
        setLoading(false);
      }
    };

    const cleanup = setupChat();
    return () => cleanup?.();
  }, [userId]);

  return (
    <div>
      {loading ? (
        <p>Loading chat...</p>
      ) : (
        <div>
          {messages.map((msg) => (
            <div
              key={msg._id}
              style={{
                textAlign: msg.sender._id === currentUserId ? 'right' : 'left',
              }}
            >
              <p>{msg.content}</p>
              <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ================================
// EXAMPLE 3: Using Redux Thunks
// ================================

function ExampleReduxStyle({ userId }) {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector(
    (state) => state.messaging
  );

  // Send message using Redux
  const handleSendViaRedux = async () => {
    const currentUserId = await getCurrentUserIdFromToken();
    const roomId = generateRoomId(currentUserId, userId);

    // If Firebase is enabled
    if (shouldUseFirebase()) {
      dispatch(
        sendMessageFirebaseThunk({
          roomId,
          senderId: currentUserId,
          receiverId: userId,
          content: 'Hello from Redux!',
          messageType: 'text',
        })
      );
    }
  };

  // Load history using Redux
  const handleLoadHistoryViaRedux = async () => {
    const currentUserId = await getCurrentUserIdFromToken();
    const roomId = generateRoomId(currentUserId, userId);

    if (shouldUseFirebase()) {
      dispatch(
        getChatHistoryFirebaseThunk({
          roomId,
          limit: 50,
        })
      );
    }
  };

  return (
    <div>
      <button onClick={handleSendViaRedux} disabled={loading}>
        {loading ? 'Sending...' : 'Send via Redux'}
      </button>
      <button onClick={handleLoadHistoryViaRedux} disabled={loading}>
        {loading ? 'Loading...' : 'Load History'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div>
        {messages.map((msg) => (
          <div key={msg._id}>{msg.content}</div>
        ))}
      </div>
    </div>
  );
}

// ================================
// EXAMPLE 4: Conditional Rendering Based on Backend
// ================================

function ExampleConditionalBackend() {
  const usingFirebase = shouldUseFirebase();

  return (
    <div>
      <h3>Backend Status</h3>
      <p>Using Firebase: {usingFirebase ? '✅ Yes' : '❌ No'}</p>

      {usingFirebase ? (
        <div style={{ padding: '10px', backgroundColor: '#e8f5e9' }}>
          <h4>Firebase Mode</h4>
          <ul>
            <li>✅ Real-time messaging</li>
            <li>✅ Instant updates</li>
            <li>✅ Typing indicators</li>
          </ul>
        </div>
      ) : (
        <div style={{ padding: '10px', backgroundColor: '#fff3e0' }}>
          <h4>API Mode</h4>
          <ul>
            <li>ℹ️ Using REST API</li>
            <li>ℹ️ Socket.IO fallback available</li>
            <li>ℹ️ May require polling for updates</li>
          </ul>
        </div>
      )}
    </div>
  );
}

// ================================
// EXAMPLE 5: Complete Conversation Component
// ================================

function ExampleConversationComponent({ partnerId, partnerName }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const dispatch = useDispatch();
  const reduxLoading = useSelector((state) => state.messaging.loading);

  useEffect(() => {
    initializeChat();
  }, [partnerId]);

  const initializeChat = async () => {
    try {
      const myId = await getCurrentUserIdFromToken();
      setCurrentUserId(myId);

      const roomId = generateRoomId(myId, partnerId);

      // Load chat history
      const history = await loadChatHistoryService({
        roomId,
        userId: partnerId,
        limit: 50,
      });

      setMessages(history);

      // Subscribe to real-time updates if using Firebase
      if (shouldUseFirebase()) {
        const unsubscribe = subscribeToMessagesService(
          { roomId },
          (updated) => setMessages(updated)
        );

        // Mark messages as read
        await markMessagesAsReadService({
          roomId,
          userId: myId,
        });

        return unsubscribe;
      }
    } catch (error) {
      console.error('Chat initialization failed:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentUserId) return;

    try {
      setLoading(true);
      const roomId = generateRoomId(currentUserId, partnerId);

      const sent = await sendMessageService({
        roomId,
        senderId: currentUserId,
        receiverId: partnerId,
        content: inputMessage,
        messageType: 'text',
        userId: partnerId,
      });

      setMessages((prev) => [...prev, sent]);
      setInputMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        border: '1px solid #ccc',
      }}
    >
      {/* Header */}
      <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
        <h3>{partnerName}</h3>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px',
          backgroundColor: '#f9f9f9',
        }}
      >
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999' }}>
            No messages yet. Start a conversation!
          </p>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender._id === currentUserId;
            return (
              <div
                key={msg._id}
                style={{
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: isOwn ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: isOwn ? '#dc2626' : '#e0e0e0',
                    color: isOwn ? 'white' : 'black',
                  }}
                >
                  <p>{msg.content}</p>
                  <small style={{ opacity: 0.7 }}>
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </small>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        style={{
          padding: '10px',
          borderTop: '1px solid #eee',
          display: 'flex',
          gap: '10px',
        }}
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={reduxLoading}
          style={{
            flex: 1,
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || reduxLoading || loading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {loading || reduxLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

// ================================
// EXPORTS
// ================================

export {
  ExampleSimpleSendMessage,
  ExampleChatWindow,
  ExampleReduxStyle,
  ExampleConditionalBackend,
  ExampleConversationComponent,
};

// ================================
// USAGE IN YOUR APP
// ================================

/*
import {
  ExampleConversationComponent,
  ExampleConditionalBackend,
} from '@/examples/firebaseExamples';

// In your component
<ExampleConditionalBackend />
<ExampleConversationComponent partnerId="user123" partnerName="John Doe" />
*/

// ================================
// HELPER PATTERNS
// ================================

// Pattern 1: Try Firebase first, fallback to API
export const sendMessageWithFallback = async (config) => {
  try {
    if (shouldUseFirebase()) {
      return await sendMessageService(config);
    } else {
      // Use API
      const response = await messagingAPI.sendMessage(
        config.userId,
        { content: config.content, messageType: config.messageType }
      );
      return response.data?.data;
    }
  } catch (error) {
    console.error('All backends failed:', error);
    throw error;
  }
};

// Pattern 2: Check backend before rendering
export const useMessagingBackend = () => {
  const [backend, setBackend] = useState(null);

  useEffect(() => {
    const checkBackend = async () => {
      if (shouldUseFirebase()) {
        try {
          const { initializeFirebase } = await import('@/utils/firebase');
          const success = initializeFirebase();
          setBackend(success ? 'firebase' : 'api');
        } catch {
          setBackend('api');
        }
      } else {
        setBackend('api');
      }
    };

    checkBackend();
  }, []);

  return backend;
};

// Pattern 3: Batch message operations
export const sendBatchMessages = async (messages) => {
  return Promise.all(
    messages.map((msg) =>
      sendMessageService({
        roomId: msg.roomId,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        content: msg.content,
        messageType: msg.messageType || 'text',
        userId: msg.receiverId,
      })
    )
  );
};
