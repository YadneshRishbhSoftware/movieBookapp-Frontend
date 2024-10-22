import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { resetPassword } from '../authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();  // Get token from URL
  const dispatch = useDispatch<AppDispatch>()
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }
    if (!token) {
        setMessage("Token is not found");
        return;
      }
  
    dispatch(resetPassword({ token, password }));
    
    navigate("/login")
  };

  return (
    <Container maxWidth="xs">
      <Box mt={4}>
        <Typography variant="h4" align="center">Reset Password</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Reset Password
          </Button>
        </form>
        {message && (
          <Typography variant="body2" color="textSecondary" align="center" mt={2}>
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default ResetPassword;
