import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Grid, Paper } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppDispatch } from '../store';
import { handlePaymentFailure, handlePaymentSuccess, initiatePayment } from '../paymentSlice';

const BookuserInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();

  // Capture selected seats and total price passed through location state
  const { selectedSeats, totalPrice, movieId,userId } = location.state;
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [paymentInitiated, setPaymentInitiated] = useState<boolean>(false);

  useEffect(() => {
    const handlePaymentResponse = (event: MessageEvent) => {
      if (event.origin !== 'https://test.payu.in') return;

      const paymentStatus = event.data.status;
      console.log(paymentStatus,"dwedewrwe")
      if (paymentStatus === 'success') {
        dispatch(handlePaymentSuccess({ transactionId: event.data.transactionId }));
        navigate("/user", { state: { transactionId: event.data.transactionId } });
      } else {
        dispatch(handlePaymentFailure({ error: event.data }));
        navigate("/payment-failure", { state: { error: event.data } });
      }
    };

    window.addEventListener('message', handlePaymentResponse);

    return () => {
      window.removeEventListener('message', handlePaymentResponse);
    };
  }, [dispatch, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const paymentResult = await dispatch(initiatePayment({
        amount: totalPrice,
        email,
        phone,
        bookingDate,
        selectedSeats,
        movieId,
        userId
      }));

      if (paymentResult.meta.requestStatus === 'fulfilled') {
        const paymentData = paymentResult.payload.payURequestPayload;
        const form = document.createElement('form');
        form.action = 'https://test.payu.in/_payment';
        form.method = 'POST';

        Object.entries(paymentData).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value as string;
          form.appendChild(input);            
        });

        document.body.appendChild(form);
        form.submit();
        setPaymentInitiated(true);
      } else {
        dispatch(handlePaymentFailure({ error: paymentResult.payload }));
        navigate("/payment-failure", { state: { error: paymentResult.payload } });
      }
    } catch (error) {
      console.error('Error in payment flow:', error);
      dispatch(handlePaymentFailure({ error }));
      navigate("/payment-failure", { state: { error } });
    }
  };
  return (
    <Paper elevation={6} sx={{ maxWidth: 450, mx: 'auto', p: 4, borderRadius: 3, mt: '30px' }}>
      <Typography variant="h4" mb={3} align="center">
        Enter Your Details
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Booking Date"
              fullWidth
              variant="outlined"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              required
              type="date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone"
              fullWidth
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              type="tel"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 1.5, fontSize: '1rem' }}
              disabled={paymentInitiated}
            >
              Proceed to Payment
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default BookuserInfo;
