// src/components/Toast.tsx
import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface ToastProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ open, message, severity, onClose }) => {
  console.log(message,"message",open)
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
