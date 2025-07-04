// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import userReducer from './userSlice'; // <-- Impor user reducer

const store = configureStore({
  reducer: { 
    cart: cartReducer,
    user: userReducer, // <-- Tambahkan user reducer
  },
});

export default store;
