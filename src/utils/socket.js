import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance) {
    const token = Cookies.get('accessToken');
    
    if (!token) {
      console.warn('No access token found, socket connection will fail');
      return null;
    }

    socketInstance = io(SOCKET_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socketInstance.on('connect', () => {
      console.log('✅ Socket.IO connected:', socketInstance.id);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('❌ Socket.IO disconnected:', reason);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error.message);
    });
  }

  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export default getSocket;

