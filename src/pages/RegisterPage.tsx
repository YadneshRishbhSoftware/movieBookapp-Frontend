// src/pages/RegisterPage.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { register, reset } from '../authSlice';
import { TextField, Button, Container, Typography, Box, CircularProgress, Checkbox } from '@mui/material';
import { Link } from 'react-router-dom';
import Toast from '../components/Toast';
import LoginImage from "../DALL·E-2024-09-27-14.07.png"
import { SubmitHandler, useForm } from 'react-hook-form';
type RegisterFormInputs = {
  email: string;
  username: string;
  password: string;
};
const RegisterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const history = useNavigate();
  const { loading, error, success } = useSelector((state: RootState) => state.auth);
  const { register: formRegister, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();

  const [toastOpen, setToastOpen] = useState(false);
  const [checkthetheuseroradmin,setCheckthetheuseroradmin] = useState(false)
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('error');

  useEffect(() => {
    if (success) {
      setToastMessage('User registered successfully');
      setToastSeverity('success');
      setToastOpen(true);
      history('/login');
      dispatch(reset());
    }
  }, [success, history, dispatch]);

  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastSeverity('error');
      setToastOpen(true);
    }
  }, [error]);

  const onSubmit: SubmitHandler<RegisterFormInputs> = (data) => {
    dispatch(register({ email: data.email, username: data.username, password: data.password, role: checkthetheuseroradmin ? 'admin':'user' }));
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" minHeight="100vh">
      <Box flex={1} display="flex" justifyContent="center" alignItems="center" padding={3}>
        <img src={LoginImage} alt="loginImage" style={{ maxWidth: '100%', height: 'auto' }} />
      </Box>
      <Box flex={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
           <TextField
              label="Email"
              fullWidth
              margin="normal"
              {...formRegister('email', { required: 'Email is required' })}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ''}
            />
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              {...formRegister('username', { required: 'Username is required' })}
              error={!!errors.username}
              helperText={errors.username ? errors.username.message : ''}
            />
            <TextField
              label="Password"
              fullWidth
              margin="normal"
              type="password"
              {...formRegister('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ''}
            />
            <Checkbox checked={checkthetheuseroradmin} onChange={(e:any)=> setCheckthetheuseroradmin(e.target.value)}/> If you admin then click on these check 
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </Box>
        </form>
        <Box mt={2}>
          <Typography variant="body2">
            Already have an account? <Link to="/login">Login</Link>
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

export default RegisterPage;
