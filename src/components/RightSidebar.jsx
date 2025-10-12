import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button
} from '@mui/material';
import {
  AttachMoney as AttachMoneyIcon,
  Phone as PhoneIcon,
  ContactPhone as ContactPhoneIcon,
  Search as SearchIconAlt,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

const RightSidebar = () => {
  return (
    <Box sx={{ 
      width: 300, 
      backgroundColor: 'white', 
      borderLeft: '1px solid #e0e0e0',
      minHeight: '100vh',
      p: 3
    }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', mb: 3 }}>
        You are <span style={{ color: '#51365F' }}>missing</span> out on the premium benefits!
      </Typography>

      <List sx={{ mb: 4 }}>
        <ListItem sx={{ px: 0, py: 1 }}>
          <ListItemIcon>
            <AttachMoneyIcon sx={{ color: '#9c27b0' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Get upto 3x more profile views"
            primaryTypographyProps={{ fontSize: '0.9rem' }}
          />
        </ListItem>
        <ListItem sx={{ px: 0, py: 1 }}>
          <ListItemIcon>
            <PhoneIcon sx={{ color: '#ff9800' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Unlimited voice & video calls"
            primaryTypographyProps={{ fontSize: '0.9rem' }}
          />
        </ListItem>
        <ListItem sx={{ px: 0, py: 1 }}>
          <ListItemIcon>
            <ContactPhoneIcon sx={{ color: '#4caf50' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Get access to contact details"
            primaryTypographyProps={{ fontSize: '0.9rem' }}
          />
        </ListItem>
        <ListItem sx={{ px: 0, py: 1 }}>
          <ListItemIcon>
            <SearchIconAlt sx={{ color: '#2196f3' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Perform unlimited searches"
            primaryTypographyProps={{ fontSize: '0.9rem' }}
          />
        </ListItem>
      </List>

      <Box sx={{ 
        backgroundColor: '#f8f9fa', 
        borderRadius: 2, 
        p: 2, 
        textAlign: 'center',
        mb: 3
      }}>
        <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
          Flat 54% OFF till 17 Oct
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>
          ₹299.00
        </Typography>
      </Box>

      <Button
        variant="contained"
        fullWidth
        endIcon={<ArrowForwardIcon />}
        sx={{
          backgroundColor: '#51365F',
          '&:hover': {
            backgroundColor: '#c2185b'
          },
          textTransform: 'none',
          fontWeight: 600,
          py: 1.5
        }}
      >
        Upgrade now
      </Button>
    </Box>
  );
};

export default RightSidebar;
