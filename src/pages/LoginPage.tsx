import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { login, reset } from '../authSlice';
import { TextField, Button, Container, Typography, Box, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import LoginImage from "../DALL·E-2024-09-27-14.07.png";
import Toast from '../components/Toast';
import "../App.css";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { loading, error, token, userInfo,isVerified} = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('error');

  // Handle error notifications
  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastSeverity('error');
      setToastOpen(true);
    }
  }, [error]);

  // Handle redirection after successful login
  useEffect(() => {
    // Only redirect if we have both token and userInfo
    if (token && userInfo && isVerified) {
      // Show success message
      setToastMessage('Login successful!');
      setToastSeverity('success');
      setToastOpen(true);

      // Small delay to show the success message
      const redirectTimer = setTimeout(() => {
        if (userInfo.role === 'admin') {
          navigate('/movieList');
        } else if (userInfo.role === 'user') {
          navigate('/user');
        }
        dispatch(reset()); // Reset the auth state after successful redirect
      }, 1000);

      // Cleanup timer
      return () => clearTimeout(redirectTimer);
    }else{
      navigate("/email-verification")
    }
  }, [token, userInfo, navigate, dispatch,isVerified]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!email || !password) {
      setToastMessage('All fields are mandatory');
      setToastSeverity('error');
      setToastOpen(true);
      return;
    }

    // Dispatch login action
    try {
      await dispatch(login({ email, password })).unwrap();
      // The redirect will be handled by the useEffect above
    } catch (err) {
      // Error handling is already done by the first useEffect
      console.error('Login failed:', err);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" minHeight="100vh">
        {/* Left Side: Image */}
        <Box flex={1} display="flex" justifyContent="center" alignItems="center" padding={3}>
          <img src={LoginImage} alt="loginImage" style={{ maxWidth: '100%', height: 'auto' }} />
        </Box>

        {/* Right Side: Form */}
        <Box flex={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <TextField
              className='custom-textfield input'
              label="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              fullWidth
              margin="normal"
              required
              disabled={loading}
            />
            <Typography variant="body2" align="right">
              Forgot your password  <Link to="/forgotPassword">Click here</Link>
            </Typography>
            <Box mt={2}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth 
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Login'}
              </Button>
            </Box>
          </form>
          <Box mt={2}>
            <Typography variant="body2">
              Don't have an account? <Link to="/register">Register</Link>
            </Typography>
          </Box>
        </Box>
      </Box>

      <Toast
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={() => setToastOpen(false)}
      />
    </Container>
  );
};

export default LoginPage;