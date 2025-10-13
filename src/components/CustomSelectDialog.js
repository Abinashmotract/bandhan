// components/CustomSelectDialog.js
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
  Button,
  Box,
  Divider
} from '@mui/material';

const CustomSelectDialog = ({
  open,
  onClose,
  title,
  options,
  selectedValues,
  onSelect,
  multiple = false
}) => {
  const handleToggle = (value) => {
    if (multiple) {
      const currentIndex = selectedValues.indexOf(value);
      const newSelected = [...selectedValues];

      if (currentIndex === -1) {
        newSelected.push(value);
      } else {
        newSelected.splice(currentIndex, 1);
      }
      onSelect(newSelected);
    } else {
      onSelect([value]);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: '#51365F', color: 'white' }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {options.map((option) => {
            const label = typeof option === 'string' ? option : option.label;
            const value = typeof option === 'string' ? option : option.value;
            const isSelected = selectedValues.includes(value);

            return (
              <ListItem key={value} disablePadding>
                <ListItemButton onClick={() => handleToggle(value)}>
                  {multiple && (
                    <Checkbox
                      edge="start"
                      checked={isSelected}
                      tabIndex={-1}
                      disableRipple
                    />
                  )}
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      {multiple && (
        <>
          <Divider />
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={onClose}
              sx={{ backgroundColor: '#51365F' }}
            >
              Apply
            </Button>
          </Box>
        </>
      )}
    </Dialog>
  );
};

export default CustomSelectDialog;