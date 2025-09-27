import React from 'react';
import { Box } from '@mui/material';
import Chat from '../components/Chat';

const ChatPage = () => {
  return (
    <Box sx={{ height: 'calc(100vh - 64px)' }}>
      <Chat />
    </Box>
  );
};

export default ChatPage;
