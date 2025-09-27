import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Badge,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Online as OnlineIcon,
  Offline as OfflineIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import {
  sendMessage,
  getChatHistory,
  getChatRooms,
  markMessagesRead,
  deleteMessage,
  addMessageReaction,
  setCurrentChat,
  addMessage,
  updateMessage,
  removeMessage
} from '../store/slices/messagingSlice';
import { showSuccess, showError } from '../utils/toast';

const Chat = () => {
  const dispatch = useDispatch();
  const { 
    chatRooms, 
    messages, 
    currentChat, 
    typingUsers, 
    loading, 
    error 
  } = useSelector(state => state.messaging);
  
  const { user } = useSelector(state => state.auth);
  
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentDialog, setShowAttachmentDialog] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load chat rooms on component mount
    dispatch(getChatRooms({ limit: 50 }));
  }, [dispatch]);

  useEffect(() => {
    // Load messages when a chat is selected
    if (selectedChat) {
      dispatch(getChatHistory({ userId: selectedChat.userId, params: { limit: 50 } }));
      dispatch(setCurrentChat(selectedChat));
    }
  }, [selectedChat, dispatch]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollToBottom();
  }, [messages, selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const messageData = {
        content: newMessage.trim(),
        messageType: 'text'
      };
      
      await dispatch(sendMessage({ 
        userId: selectedChat.userId, 
        messageData 
      })).unwrap();
      
      setNewMessage('');
      showSuccess('Message sent successfully!');
    } catch (error) {
      showError(error || 'Failed to send message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMarkAsRead = async (chatUserId) => {
    try {
      await dispatch(markMessagesRead(chatUserId)).unwrap();
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await dispatch(deleteMessage(messageId)).unwrap();
      showSuccess('Message deleted successfully!');
    } catch (error) {
      showError(error || 'Failed to delete message');
    }
  };

  const handleAddReaction = async (messageId, emoji) => {
    try {
      await dispatch(addMessageReaction({ 
        messageId, 
        reactionData: { emoji } 
      })).unwrap();
      showSuccess('Reaction added!');
    } catch (error) {
      showError(error || 'Failed to add reaction');
    }
  };

  const filteredChatRooms = chatRooms.filter(chat => 
    chat.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage?.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMessages = selectedChat ? messages[selectedChat.userId] || [] : [];

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', backgroundColor: '#f5f5f5' }}>
      {/* Chat List Sidebar */}
      <Paper 
        elevation={3} 
        sx={{ 
          width: 350, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 0,
          borderRight: '1px solid #e0e0e0'
        }}
      >
        {/* Chat List Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#37474f', mb: 2 }}>
            Messages
          </Typography>
          
          {/* Search */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#d81b60' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#d81b60',
                },
              },
            }}
          />
        </Box>

        {/* Chat Rooms List */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : filteredChatRooms.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No conversations found
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredChatRooms.map((chat, index) => (
                <React.Fragment key={chat._id || index}>
                  <ListItem
                    button
                    onClick={() => {
                      setSelectedChat({
                        userId: chat.user?._id || chat.participants?.find(p => p._id !== user?._id)?._id,
                        user: chat.user || chat.participants?.find(p => p._id !== user?._id),
                        chatId: chat._id
                      });
                      handleMarkAsRead(chat.user?._id || chat.participants?.find(p => p._id !== user?._id)?._id);
                    }}
                    sx={{
                      backgroundColor: selectedChat?.userId === (chat.user?._id || chat.participants?.find(p => p._id !== user?._id)?._id) 
                        ? 'rgba(216, 27, 96, 0.1)' 
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(216, 27, 96, 0.05)',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          <Box sx={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: '50%', 
                            backgroundColor: chat.user?.isOnline ? '#4caf50' : '#ccc',
                            border: '2px solid white'
                          }} />
                        }
                      >
                        <Avatar
                          src={chat.user?.profileImage || chat.participants?.find(p => p._id !== user?._id)?.profileImage}
                          sx={{ width: 50, height: 50 }}
                        >
                          {chat.user?.name?.charAt(0) || chat.participants?.find(p => p._id !== user?._id)?.name?.charAt(0)}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {chat.user?.name || chat.participants?.find(p => p._id !== user?._id)?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(chat.lastMessage?.createdAt || chat.updatedAt)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: 200,
                              fontWeight: chat.lastMessage?.isRead === false ? 600 : 400
                            }}
                          >
                            {chat.lastMessage?.content || 'No messages yet'}
                          </Typography>
                          {chat.unreadCount > 0 && (
                            <Chip
                              label={chat.unreadCount}
                              size="small"
                              sx={{
                                backgroundColor: '#d81b60',
                                color: 'white',
                                fontSize: '0.75rem',
                                height: 20,
                                minWidth: 20,
                                mt: 0.5
                              }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < filteredChatRooms.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Paper>

      {/* Chat Area */}
      {selectedChat ? (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Chat Header */}
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              alignItems: 'center', 
              borderBottom: '1px solid #e0e0e0',
              borderRadius: 0
            }}
          >
            <Avatar
              src={selectedChat.user?.profileImage}
              sx={{ width: 40, height: 40, mr: 2 }}
            >
              {selectedChat.user?.name?.charAt(0)}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {selectedChat.user?.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  backgroundColor: selectedChat.user?.isOnline ? '#4caf50' : '#ccc',
                  mr: 1 
                }} />
                <Typography variant="caption" color="text.secondary">
                  {selectedChat.user?.isOnline ? 'Online' : 'Last seen recently'}
                </Typography>
              </Box>
            </Box>
            
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </Paper>

          {/* Messages Area */}
          <Box 
            sx={{ 
              flex: 1, 
              overflow: 'auto', 
              p: 2, 
              backgroundColor: '#fafafa',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress size={24} />
              </Box>
            ) : currentMessages.length === 0 ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100%',
                flexDirection: 'column'
              }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  No messages yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start a conversation with {selectedChat.user?.name}
                </Typography>
              </Box>
            ) : (
              <>
                {currentMessages.map((message, index) => {
                  const isOwn = message.senderId === user?._id;
                  const showAvatar = index === 0 || currentMessages[index - 1]?.senderId !== message.senderId;
                  
                  return (
                    <Box
                      key={message._id}
                      sx={{
                        display: 'flex',
                        justifyContent: isOwn ? 'flex-end' : 'flex-start',
                        mb: 1,
                        alignItems: 'flex-end'
                      }}
                    >
                      {!isOwn && showAvatar && (
                        <Avatar
                          src={selectedChat.user?.profileImage}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        >
                          {selectedChat.user?.name?.charAt(0)}
                        </Avatar>
                      )}
                      
                      {!isOwn && !showAvatar && <Box sx={{ width: 40 }} />}
                      
                      <Box sx={{ maxWidth: '70%' }}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            backgroundColor: isOwn ? '#d81b60' : 'white',
                            color: isOwn ? 'white' : 'black',
                            borderRadius: isOwn ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                            position: 'relative'
                          }}
                        >
                          <Typography variant="body2">
                            {message.content}
                          </Typography>
                          
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mt: 1
                          }}>
                            <Typography variant="caption" sx={{ 
                              color: isOwn ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                              fontSize: '0.75rem'
                            }}>
                              {formatTime(message.createdAt)}
                            </Typography>
                            
                            {isOwn && (
                              <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleAddReaction(message._id, '❤️')}
                                  sx={{ color: 'rgba(255,255,255,0.7)' }}
                                >
                                  <FavoriteBorderIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteMessage(message._id)}
                                  sx={{ color: 'rgba(255,255,255,0.7)' }}
                                >
                                  <MoreVertIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                              </Box>
                            )}
                          </Box>
                        </Paper>
                        
                        {message.reactions && message.reactions.length > 0 && (
                          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, ml: isOwn ? 0 : 5 }}>
                            {message.reactions.map((reaction, idx) => (
                              <Chip
                                key={idx}
                                label={`${reaction.emoji} ${reaction.count}`}
                                size="small"
                                sx={{ fontSize: '0.75rem', height: 20 }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </Box>

          {/* Message Input */}
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              borderTop: '1px solid #e0e0e0',
              borderRadius: 0
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={() => setShowAttachmentDialog(true)}>
                <AttachFileIcon sx={{ color: '#d81b60' }} />
              </IconButton>
              
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#d81b60',
                    },
                  },
                }}
              />
              
              <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <EmojiIcon sx={{ color: '#d81b60' }} />
              </IconButton>
              
              <IconButton 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                sx={{
                  backgroundColor: '#d81b60',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#c2185b',
                  },
                  '&:disabled': {
                    backgroundColor: '#ccc',
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Paper>
        </Box>
      ) : (
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: '#fafafa'
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
              Welcome to Messages
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Select a conversation to start messaging
            </Typography>
          </Box>
        </Box>
      )}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}>
          {error}
        </Alert>
      )}

      {/* Attachment Dialog */}
      <Dialog open={showAttachmentDialog} onClose={() => setShowAttachmentDialog(false)}>
        <DialogTitle>Send Attachment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            File attachment feature coming soon...
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAttachmentDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Chat;
