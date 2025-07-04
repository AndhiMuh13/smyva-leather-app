// src/store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // Awalnya tidak ada pengguna yang login
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Aksi untuk menyimpan data pengguna saat login
    login(state, action) {
      state.user = action.payload;
    },
    // Aksi untuk menghapus data pengguna saat logout
    logout(state) {
      state.user = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
