// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import authReducer from './authSlice';
import movieReducer from './movieSlice';
import searchReducer from './searchSlice';
import userMovieListReducer from './UsermovieListSlice';
import bookingSlice from './bookingSlice';
import paymentSlice from './paymentSlice';
const authPersistConfig = {
  key: 'auth',
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    movies: movieReducer,
    search: searchReducer,
    userMovieList: userMovieListReducer,
    booking: bookingSlice,
    payment: paymentSlice,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
