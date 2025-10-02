import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Favorite as InterestIcon,
  Send as SendIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { interactionAPI } from '../services/apiService';

const InterestButton = ({ profile, onInterestSent }) => {
  const { canSendInterest, openUpgradeModal } = useSubscription();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendInterest = async () => {
    if (!canSendInterest()) {
      openUpgradeModal();
      return;
    }

    setDialogOpen(true);
  };

  const handleSubmitInterest = async () => {
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await interactionAPI.sendInterest(profile._id, {
        message: message.trim()
      });

      if (response.data.success) {
        toast.success('Interest sent successfully!');
        setDialogOpen(false);
        setMessage('');
        if (onInterestSent) {
          onInterestSent();
        }
      } else {
        setError(response.data.message || 'Failed to send interest');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send interest');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setMessage('');
    setError('');
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={canSendInterest() ? <InterestIcon /> : <LockIcon />}
        onClick={handleSendInterest}
        disabled={loading}
        sx={{
          background: canSendInterest() 
            ? 'linear-gradient(135deg, #d81b60 0%, #ad1457 100%)'
            : '#ccc',
          color: 'white',
          '&:hover': {
            background: canSendInterest()
              ? 'linear-gradient(135deg, #ad1457 0%, #880e4f 100%)'
              : '#ccc',
          },
          '&:disabled': {
            background: '#ccc',
            color: '#666'
          }
        }}
      >
        {canSendInterest() ? 'Send Interest' : 'Upgrade to Send Interest'}
      </Button>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InterestIcon sx={{ color: '#d81b60' }} />
            <Typography variant="h6" sx={{ color: '#000' }}>
              Send Interest to {profile.name}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
            Write a personalized message to express your interest in connecting with {profile.name}.
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hi! I saw your profile and I think we have a lot in common. I would love to know more about you..."
            variant="outlined"
            sx={{ mb: 2 }}
            disabled={loading}
          />
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="Hi! I think we have a lot in common."
              size="small"
              onClick={() => setMessage('Hi! I think we have a lot in common.')}
              sx={{ mb: 1 }}
            />
            <Chip
              label="I would love to know more about you."
              size="small"
              onClick={() => setMessage('I would love to know more about you.')}
              sx={{ mb: 1 }}
            />
            <Chip
              label="Your profile caught my attention!"
              size="small"
              onClick={() => setMessage('Your profile caught my attention!')}
              sx={{ mb: 1 }}
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitInterest}
            variant="contained"
            disabled={loading || !message.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{
              background: 'linear-gradient(135deg, #d81b60 0%, #ad1457 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #ad1457 0%, #880e4f 100%)',
              }
            }}
          >
            {loading ? 'Sending...' : 'Send Interest'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InterestButton;
