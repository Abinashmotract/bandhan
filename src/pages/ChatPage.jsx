import React from 'react';
import { Box } from '@mui/material';
import Chat from '../components/Chat';
import MainLayout from '../layouts/MainLayout';

const ChatPage = () => {
  return (
    <MainLayout>
      <Box sx={{ height: 'calc(100vh - 64px)' }}>
        <Chat />
      </Box>
    </MainLayout>
  );
};

export default ChatPage;
