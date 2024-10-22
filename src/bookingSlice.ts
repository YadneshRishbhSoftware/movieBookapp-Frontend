import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface BookingState {
  seats: string[];
  selectedSeats: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BookingState = {
  seats: [],
  selectedSeats: [],
  status: 'idle',
  error: null,
};

// Async thunk for booking the movie
export const bookMovie = createAsyncThunk(
  'booking/bookMovie',
  async (payload: { movieId: string; userId: string; selectedSeats: string[] }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:4000/api/movies/bookMovies', {
        movieId: payload.movieId,
        userId: payload.userId,
        seats: payload.selectedSeats,
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchBookedSeats = createAsyncThunk(
    'bookedSeats/fetchBookedSeats',
    async (movieId: string) => {
      const response = await axios.get(`http://localhost:4000/api/movies/getBookedseats/${movieId}`);
      return response.data.bookedSeats;
    }
  );

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    selectSeat: (state, action) => {
      const seat = action.payload;
      if (state.selectedSeats.includes(seat)) {
        state.selectedSeats = state.selectedSeats.filter(s => s !== seat);
      } else {
        state.selectedSeats.push(seat);
      }
    },
    clearBooking: (state) => {
      state.selectedSeats = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookMovie.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(bookMovie.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(bookMovie.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchBookedSeats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookedSeats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.seats = action.payload;
      })
      .addCase(fetchBookedSeats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch booked seats';
      });
  }
});

export const { selectSeat, clearBooking } = bookingSlice.actions;

export default bookingSlice.reducer;
