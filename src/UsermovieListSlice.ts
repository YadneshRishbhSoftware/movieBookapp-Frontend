import {createSlice , createAsyncThunk} from '@reduxjs/toolkit';
import axios from './axiosConfig';



export const fetchUserMovieList = createAsyncThunk('userMovieList/fetchUserMovieList', async (searchTerm: string | null = null) => {
    try {
        const response = await axios.get(`http://localhost:4000/api/movies/user/movieList`, {
            params: searchTerm ? { search: searchTerm } : {},
          });
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
});

const userMovieListSlice = createSlice({
    name: 'userMovieList',
    initialState: {
        loading: false,
        error: '',
        success: false,
        userMovieList: [],
        userMovieDetails: null,
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
            .addCase(fetchUserMovieList.pending, (state) => {
                state.loading = true;
                state.error = '';
                state.success = false;
            })
            .addCase(fetchUserMovieList.fulfilled, (state, action) => {
                console.log(action.payload,"action.payload");
                state.loading = false;
                state.userMovieList = action.payload;
            })
            .addCase(fetchUserMovieList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});
export default userMovieListSlice.reducer;