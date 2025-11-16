# Firebase Messaging - Quick Reference Card

## 🚀 Quick Start (5 minutes)

```bash
# 1. Install dependency
npm install

# 2. Add to .env
VITE_USE_FIREBASE=true
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
# ... add other Firebase config from Firebase Console

# 3. Done! System auto-uses Firebase
```

---

## 📱 Common Code Patterns

### Send Message
```javascript
import { sendMessageService } from '@/utils/messagingService';

const send = await sendMessageService({
  roomId: 'room_user1_user2',
  senderId: 'user1',
  receiverId: 'user2',
  content: 'Hello!',
});
```

### Load Chat History
```javascript
import { loadChatHistoryService } from '@/utils/messagingService';

const messages = await loadChatHistoryService({
  roomId: 'room_user1_user2',
  limit: 50,
});
```

### Real-time Updates (Firebase only)
```javascript
import { subscribeToMessagesService } from '@/utils/messagingService';

const unsubscribe = subscribeToMessagesService(
  { roomId: 'room_user1_user2' },
  (messages) => setMessages(messages)
);
```

### Generate Room ID
```javascript
import { generateRoomId } from '@/utils/firebase';

const roomId = generateRoomId('user1', 'user2');
// Returns: 'room_user1_user2' (always consistent)
```

---

## 🔧 Configuration

### Enable/Disable Firebase

```env
# Enable
VITE_USE_FIREBASE=true

# Disable (automatic fallback to API)
VITE_USE_FIREBASE=false
```

### Full Firebase Config Template
```env
VITE_USE_FIREBASE=true
VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=project
VITE_FIREBASE_STORAGE_BUCKET=project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc...
VITE_FIREBASE_DATABASE_URL=https://project.firebaseio.com
```

---

## 📂 File Locations

```
src/
├── utils/
│   ├── firebase.js                 ← Core Firebase utilities
│   └── messagingService.js         ← API/Firebase router
├── store/slices/
│   └── messagingSlice.js          ← Redux store (updated)
└── components/
    └── MessengerChatRoom.jsx      ← Component (updated)

Documentation:
├── FIREBASE_MESSAGING_GUIDE.md    ← Full docs (START HERE)
├── FIREBASE_SETUP_CHECKLIST.md    ← Setup steps
├── FIREBASE_USAGE_EXAMPLES.md     ← Code examples
├── IMPLEMENTATION_SUMMARY.md      ← Overview
└── .env.example.firebase          ← Env template
```

---

## 🔗 API Reference

### Firebase Service Methods

```javascript
// Initialization
initializeFirebase()               → boolean
getFirebaseDatabase()              → Database

// Messages
sendMessageFirebase(roomId, ...)   → Promise<Message>
loadChatHistoryFirebase(roomId)    → Promise<Message[]>
deleteMessageFirebase(roomId, id)  → Promise<void>

// Real-time
subscribeToMessages(roomId, cb)    → unsubscribe function
subscribeToTypingStatus(roomId)    → unsubscribe function

// Status
markMessagesAsReadFirebase()       → Promise<void>
getUnreadMessageCount(roomId)      → Promise<number>

// Utilities
generateRoomId(user1, user2)       → string
setTypingIndicator(roomId, userId) → Promise<void>
```

### Messaging Service Methods

```javascript
// Backend Detection
shouldUseFirebase()                → boolean

// Unified Methods (auto-routes)
sendMessageService(config)         → Promise<Message>
loadChatHistoryService(config)     → Promise<Message[]>
markMessagesAsReadService(config)  → Promise<void>
deleteMessageService(config)       → Promise<void>
subscribeToMessagesService()       → unsubscribe function
setTypingIndicatorService(config)  → Promise<void>

// Utilities
getCurrentUserIdFromToken()        → Promise<string>
```

---

## 🎯 Redux Thunks

### Firebase Thunks
```javascript
sendMessageFirebaseThunk
getChatHistoryFirebaseThunk
getChatRoomsFirebaseThunk
markMessagesReadFirebaseThunk
deleteMessageFirebaseThunk
```

### Dispatch Example
```javascript
dispatch(sendMessageFirebaseThunk({
  roomId: 'room_user1_user2',
  senderId: 'user1',
  receiverId: 'user2',
  content: 'Hello!',
}));
```

---

## 🔍 Debugging

### Check Backend Type
```javascript
import { shouldUseFirebase } from '@/utils/messagingService';
console.log('Using Firebase:', shouldUseFirebase());
```

### Check Firebase Connection
```javascript
import { getFirebaseDatabase } from '@/utils/firebase';
const db = getFirebaseDatabase();
console.log('Firebase:', !!db);
```

### Redux DevTools
```javascript
// In Redux DevTools, check:
state.messaging.useFirebase  // true/false
state.messaging.messages     // message data
state.messaging.error        // error state
```

---

## 🐛 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "Firebase not initialized" | Missing env vars | Add all `VITE_FIREBASE_*` |
| No messages appearing | Wrong room ID | Use `generateRoomId()` |
| Messages only one way | Auth issue | Check JWT token |
| Slow performance | High message limit | Reduce limit to 25 |
| Fallback to API | Firebase error | Check browser console |

---

## 💡 Best Practices

```javascript
// ✅ Good
const roomId = generateRoomId(userId1, userId2);
const messages = await loadChatHistoryService({ 
  roomId, 
  limit: 50 
});

// ❌ Avoid
const roomId = `${userId1}_${userId2}`;  // Inconsistent
await loadChatHistoryService({ limit: 500 }); // Too many
```

---

## 📊 Performance Tips

```javascript
// Load limited messages first
limit: 25  // Good for initial load

// Pagination for more
if (hasMore) {
  loadMore(limit: 25);
}

// Real-time subscription (Firebase)
subscribeToMessages(roomId, callback);

// Unsubscribe on unmount
useEffect(() => {
  const unsub = subscribeToMessages();
  return () => unsub?.();
}, []);
```

---

## 🔐 Security Checklist

- [ ] Firebase Database Rules configured
- [ ] JWT token validation enabled
- [ ] CORS configured for API
- [ ] Sensitive data not logged
- [ ] Rate limiting enabled
- [ ] User authentication required

---

## 📞 Quick Help

### Documentation Links
- **Setup**: See FIREBASE_SETUP_CHECKLIST.md
- **Full Docs**: See FIREBASE_MESSAGING_GUIDE.md
- **Examples**: See FIREBASE_USAGE_EXAMPLES.md
- **Overview**: See IMPLEMENTATION_SUMMARY.md

### Key Files
- Firebase Utils: `src/utils/firebase.js`
- Service Layer: `src/utils/messagingService.js`
- Redux Store: `src/store/slices/messagingSlice.js`
- Component: `src/components/MessengerChatRoom.jsx`

---

## ✨ Features At a Glance

```
✅ Real-time messaging
✅ Typing indicators
✅ Message history
✅ Read receipts
✅ Message deletion
✅ API fallback
✅ Socket.IO support
✅ Offline caching
✅ Error handling
✅ Production ready
```

---

## 🎬 Getting Started

### 1. Test Locally
```bash
npm run dev
# Open Messenger component
# Send test message
# Check browser console
```

### 2. Verify Connection
```javascript
// In browser console
import { shouldUseFirebase } from '@/utils/messagingService'
shouldUseFirebase()  // Should return true if env is set
```

### 3. Check Firebase Console
- Go to Firebase Console
- Select your project
- Database → Realtime Database
- Check `chats` folder for messages

### 4. Deploy to Staging
```bash
npm run build
# Deploy with VITE_USE_FIREBASE=false first
# Monitor for 24 hours
```

### 5. Enable Firebase
```bash
# Update env to VITE_USE_FIREBASE=true
# Gradually roll out to users
```

---

## 🚀 Production Checklist

- [ ] Firebase credentials in production env
- [ ] Database Rules configured
- [ ] Rate limiting enabled
- [ ] Error tracking setup
- [ ] Monitoring enabled
- [ ] Backup strategy planned
- [ ] Rollback plan ready

---

## 📈 Monitoring

### Firebase Console
- Database → Metrics
- Realtime Database → Usage
- Authentication → Dashboard

### Application Metrics
- Message send time
- Load time
- Error rate
- Active users

---

## 🎓 Learning Path

1. **Day 1**: Read IMPLEMENTATION_SUMMARY.md
2. **Day 2**: Read FIREBASE_SETUP_CHECKLIST.md
3. **Day 3**: Test locally with examples
4. **Day 4**: Review FIREBASE_MESSAGING_GUIDE.md
5. **Day 5**: Deploy to staging

---

## 💬 Support Resources

### Online
- Firebase Docs: https://firebase.google.com/docs
- Stack Overflow: firebase realtime-database tag
- Firebase Community: https://firebase.google.com/community

### Local Docs
- FIREBASE_MESSAGING_GUIDE.md (comprehensive)
- FIREBASE_USAGE_EXAMPLES.md (code patterns)
- FIREBASE_SETUP_CHECKLIST.md (troubleshooting)

---

**Last Updated**: November 2024
**Status**: ✅ Ready for Development & Staging
**Support**: See included documentation files
