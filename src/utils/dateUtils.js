// Date utility functions
import { formatDistanceToNow, format } from 'date-fns';

export const formatTimeAgo = (date) => {
  try {
    if (!date) return 'Unknown';
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Unknown';
  }
};

export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  try {
    if (!date) return 'Unknown';
    return format(new Date(date), formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Unknown';
  }
};

// Fallback function for browsers that might not support date-fns
export const formatTimeAgoFallback = (date) => {
  try {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now - targetDate) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  } catch (error) {
    console.error('Error formatting date with fallback:', error);
    return 'Unknown';
  }
};
