// src/utils/toast.js
import { toast } from 'react-hot-toast';

// Success toast
export const showSuccess = (message) => {
  toast.success(message, {
    style: {
      borderRadius: '10px',
      background: '#dff0d8',
      color: '#4caf50',
      fontWeight: 500,
    },
    duration: 4000,
    position: 'top-right',
  });
};

// Error toast
export const showError = (message) => {
  toast.error(message, {
    style: {
      borderRadius: '10px',
      background: '#fdecea',
      color: '#f44336',
      fontWeight: 500,
    },
    duration: 4000,
    position: 'top-right',
  });
};

// Info toast
export const showInfo = (message) => {
  toast(message, {
    style: {
      borderRadius: '10px',
      background: '#e3f2fd',
      color: '#2196f3',
      fontWeight: 500,
    },
    duration: 4000,
    position: 'top-right',
  });
};
