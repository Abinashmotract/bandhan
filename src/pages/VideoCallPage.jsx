import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Videocam as VideoIcon,
  VideocamOff as VideoOffIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  CallEnd as CallEndIcon,
  Phone as PhoneIcon,
  Chat as ChatIcon,
  MoreVert as MoreVertIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

const VideoCallPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [showCallDialog, setShowCallDialog] = useState(true);
  const [callType, setCallType] = useState('video'); // 'video' or 'voice'
  const [loading, setLoading] = useState(false);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const callTimerRef = useRef(null);

  // Mock user data
  const [partnerData, setPartnerData] = useState({
    name: 'Priya Sharma',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    isOnline: true,
    lastSeen: 'Online now'
  });

  useEffect(() => {
    // Initialize call when component mounts
    initializeCall();
    
    return () => {
      // Cleanup on unmount
      endCall();
    };
  }, []);

  useEffect(() => {
    // Start call timer
    if (isCallActive) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [isCallActive]);

  const initializeCall = async () => {
    setLoading(true);
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callType === 'video',
        audio: true
      });
      
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Initialize peer connection (WebRTC)
      // This is a simplified version - in real implementation, you'd use WebRTC
      setTimeout(() => {
        setLoading(false);
        setIsCallActive(true);
        setShowCallDialog(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setLoading(false);
    }
  };

  const endCall = () => {
    setIsCallActive(false);
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
    
    navigate('/matches');
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        text: chatMessage,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage('');
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCallTypeChange = (type) => {
    setCallType(type);
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      backgroundColor: '#000',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Main Video Area */}
      <Box sx={{ 
        height: '100%', 
        display: 'flex',
        position: 'relative'
      }}>
        {/* Remote Video */}
        <Box sx={{ 
          flex: 1, 
          position: 'relative',
          backgroundColor: '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isCallActive ? (
            <Box sx={{ 
              width: '100%', 
              height: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Remote video placeholder */}
              <Box sx={{
                width: '100%',
                height: '100%',
                backgroundColor: '#2a2a2a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <Avatar
                  src={partnerData.profileImage}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <Typography variant="h5" sx={{ color: 'white', mb: 1 }}>
                  {partnerData.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  {partnerData.isOnline ? 'Online' : partnerData.lastSeen}
                </Typography>
              </Box>
              
              {/* Call duration */}
              <Box sx={{
                position: 'absolute',
                top: 20,
                left: 20,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                px: 2,
                py: 1,
                borderRadius: 2
              }}>
                <Typography variant="body2">
                  {formatDuration(callDuration)}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ 
              textAlign: 'center',
              color: 'white'
            }}>
              <Typography variant="h4" sx={{ mb: 2 }}>
                {callType === 'video' ? 'Video Call' : 'Voice Call'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Connecting to {partnerData.name}...
              </Typography>
              <CircularProgress color="primary" />
            </Box>
          )}
        </Box>

        {/* Local Video */}
        {isCallActive && callType === 'video' && (
          <Box sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 200,
            height: 150,
            borderRadius: 2,
            overflow: 'hidden',
            border: '2px solid #51365F',
            backgroundColor: '#2a2a2a'
          }}>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Box>
        )}
      </Box>

      {/* Call Controls */}
      {isCallActive && (
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2
        }}>
          <IconButton
            onClick={toggleMic}
            sx={{
              backgroundColor: isMicOn ? '#4caf50' : '#f44336',
              color: 'white',
              '&:hover': {
                backgroundColor: isMicOn ? '#45a049' : '#d32f2f'
              }
            }}
          >
            {isMicOn ? <MicIcon /> : <MicOffIcon />}
          </IconButton>

          {callType === 'video' && (
            <IconButton
              onClick={toggleVideo}
              sx={{
                backgroundColor: isVideoOn ? '#4caf50' : '#f44336',
                color: 'white',
                '&:hover': {
                  backgroundColor: isVideoOn ? '#45a049' : '#d32f2f'
                }
              }}
            >
              {isVideoOn ? <VideoIcon /> : <VideoOffIcon />}
            </IconButton>
          )}

          <IconButton
            onClick={toggleSpeaker}
            sx={{
              backgroundColor: isSpeakerOn ? '#4caf50' : '#f44336',
              color: 'white',
              '&:hover': {
                backgroundColor: isSpeakerOn ? '#45a049' : '#d32f2f'
              }
            }}
          >
            {isSpeakerOn ? <VolumeUpIcon /> : <VolumeOffIcon />}
          </IconButton>

          <IconButton
            onClick={() => setShowChat(!showChat)}
            sx={{
              backgroundColor: '#51365F',
              color: 'white',
              '&:hover': {
                backgroundColor: '#c2185b'
              }
            }}
          >
            <ChatIcon />
          </IconButton>

          <IconButton
            onClick={toggleFullscreen}
            sx={{
              backgroundColor: '#51365F',
              color: 'white',
              '&:hover': {
                backgroundColor: '#c2185b'
              }
            }}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>

          <IconButton
            onClick={endCall}
            sx={{
              backgroundColor: '#f44336',
              color: 'white',
              '&:hover': {
                backgroundColor: '#d32f2f'
              }
            }}
          >
            <CallEndIcon />
          </IconButton>
        </Box>
      )}

      {/* Chat Panel */}
      {showChat && (
        <Box sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 300,
          height: '100%',
          backgroundColor: 'white',
          borderLeft: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6">Chat</Typography>
          </Box>
          
          <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
            {chatMessages.map((message) => (
              <Box key={message.id} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ 
                  color: message.sender === 'me' ? '#51365F' : '#666',
                  textAlign: message.sender === 'me' ? 'right' : 'left'
                }}>
                  {message.text}
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: '#999',
                  textAlign: message.sender === 'me' ? 'right' : 'left',
                  display: 'block'
                }}>
                  {message.timestamp}
                </Typography>
              </Box>
            ))}
          </Box>
          
          <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendChatMessage();
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={sendChatMessage}
                sx={{ background: '#51365F' }}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Call Initiation Dialog */}
      <Dialog open={showCallDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', color: '#51365F' }}>
          Start a Call
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Avatar
              src={partnerData.profileImage}
              sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
            />
            <Typography variant="h6" sx={{ mb: 1 }}>
              {partnerData.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose call type
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant={callType === 'video' ? 'contained' : 'outlined'}
                startIcon={<VideoIcon />}
                onClick={() => handleCallTypeChange('video')}
                sx={{
                  borderColor: '#51365F',
                  color: callType === 'video' ? 'white' : '#51365F',
                  backgroundColor: callType === 'video' ? '#51365F' : 'transparent'
                }}
              >
                Video Call
              </Button>
              <Button
                variant={callType === 'voice' ? 'contained' : 'outlined'}
                startIcon={<PhoneIcon />}
                onClick={() => handleCallTypeChange('voice')}
                sx={{
                  borderColor: '#51365F',
                  color: callType === 'voice' ? 'white' : '#51365F',
                  backgroundColor: callType === 'voice' ? '#51365F' : 'transparent'
                }}
              >
                Voice Call
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={() => navigate('/matches')} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button
            onClick={initializeCall}
            variant="contained"
            disabled={loading}
            sx={{
              background: '#51365F',
              '&:hover': {
                background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)',
              }
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Start Call'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoCallPage;
