// src/movieSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from './axiosConfig'; // Adjust path as per your project structure

interface MovieAddData {
  name: string;
  photoPublicId: string; // Ensure this matches your API response structure
  trailerPublicId: string; // Ensure this matches your API response structure
  landmark: string;
  city: string;
  state: string;
  country: string;
}

export const addMovie = createAsyncThunk(
  'movies/addMovie',
  async (movieData: MovieAddData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/movies/add', movieData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);


export const updateMovie = createAsyncThunk(
  'movies/updateMovie',
  async ({ id, movieData }: { id: string; movieData: MovieAddData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/movies/update/${id}`, movieData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
export const getMovieById = createAsyncThunk(
  'movies/getMovieById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`api/movies/getMovies/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// Delete movie
export const deleteMovie = async (id: string) => {
  try {
    const response = await axios.delete(`/api/movies/delete/${id}`);
    return response.data;
  } catch (error:any) {
    throw new Error(`Failed to delete movie: ${error.message}`);
  }
};
export const fetchMovies = createAsyncThunk('movies/fetchMovies', async () => {
  const response = await axios.get('api/movies/movieList');
  return response.data;
});
const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    loading: false,
    error: '',
    success: false,
    movies: [],
    movieDetails: null,
  },
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = '';
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMovie.pending, (state) => {
        state.loading = true;
        state.error = '';
        state.success = false;
      })
      .addCase(addMovie.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateMovie.pending, (state) => {
        state.loading = true;
        state.error = '';
        state.success = false;
      })
      .addCase(updateMovie.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getMovieById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMovieById.fulfilled, (state, action) => {
        state.loading = false;
        state.movieDetails = action.payload;
      })
      .addCase(getMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.movies = action.payload;
        state.loading = false;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch movies';
        state.loading = false;
      });
  },
});

export const { reset } = movieSlice.actions;
export default movieSlice.reducer;
