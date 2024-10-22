import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from './axiosConfig'; // Adjust path as per your project structure


export const register = createAsyncThunk(
  'auth/register',
  async (userData: { email:string, username: string; password: string; role: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('api/auth/register', userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('api/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (credentials: { email: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put('api/auth/forgotPassword', credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    { token, password }: { token: string; password: string }, // Expect token and new password
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.patch(`/api/auth/resetPassword/${token}`, { password }); // Dynamically insert token
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
export const verificationEmail = createAsyncThunk(
  'auth/verificationEmail',
  async (
    {  otp }: { otp: string }, // Expect token and new password
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`/api/auth/verify-otp`, {  otp }); // Dynamically insert token
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    userInfo:null as any,
    error: '',
    success: false,
    isVerified:false,
    message:"",
    token: localStorage.getItem('token') || '',
  },
  reducers: {
    reset: (state) => {
      state.success = false;
      state.error = '';
    },
    logout: (state) => {
      state.loading = false;
      state.success = false;
      state.token = '';
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = '';
        state.success = false;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.token = action.payload.token;
        state.userInfo = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verificationEmail.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(verificationEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(verificationEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;
