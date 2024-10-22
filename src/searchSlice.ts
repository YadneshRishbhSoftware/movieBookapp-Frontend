// src/searchSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from './axiosConfig'; // Adjust path as per your project structure
import { MovieDetails } from './utils/types';

export const searchMovies = createAsyncThunk(
  'movies/searchMovies',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/movies/search?query=${query}`);
      console.log(response,"ssssssssssss")
      return response.data; // Assuming response.data contains the list of movies
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch search results');
    }
  }
);

interface SearchState {
  results: MovieDetails[];
  loadingSearch: boolean;
  error: string | null;
}

const initialState: SearchState = {
  results: [],
  loadingSearch: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchMovies.pending, (state) => {
        state.loadingSearch = true;
        state.error = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loadingSearch = false;
        state.results = action.payload;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loadingSearch = false;
        state.error = action.payload as string;
      });
  },
});

export default searchSlice.reducer;
