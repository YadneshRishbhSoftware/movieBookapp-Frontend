import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/payment';

interface PaymentState {
  paymentData: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  paymentData: null,
  loading: false,
  error: null,
};

// Define thunks
export const initiatePayment = createAsyncThunk(
  'payment/initiate',
  async (paymentData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/initiate`, paymentData);
      return response.data;
    } catch (error :any) {
      return rejectWithValue(error.response?.data || 'Error initiating payment');
    }
  }
);

export const handlePaymentSuccess = createAsyncThunk(
  'payment/success',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/success`, data);
      return response.data;
    } catch (error :any) {
      return rejectWithValue(error.response?.data || 'Error handling payment success');
    }
  }
);

export const handlePaymentFailure = createAsyncThunk(
  'payment/failure',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/failure`, data);
      return response.data;
    } catch (error : any) {
      return rejectWithValue(error.response?.data || 'Error handling payment failure');
    }
  }
);

// Create the slice
const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initiatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action: PayloadAction<any>) => {
        state.paymentData = action.payload;
        state.loading = false;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(handlePaymentSuccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handlePaymentSuccess.fulfilled, (state, action: PayloadAction<any>) => {
        state.paymentData = action.payload;
        state.loading = false;
      })
      .addCase(handlePaymentSuccess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(handlePaymentFailure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handlePaymentFailure.fulfilled, (state, action: PayloadAction<any>) => {
        state.paymentData = action.payload;
        state.loading = false;
      })
      .addCase(handlePaymentFailure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default paymentSlice.reducer;
