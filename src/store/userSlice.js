// src/store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  status: 'loading', // 'loading', 'success', 'failed'
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Aksi untuk menyimpan data pengguna saat login
    login(state, action) {
      state.user = action.payload;
      state.status = 'success';
    },
    // Aksi untuk menghapus data pengguna saat logout
    logout(state) {
      state.user = null;
      state.status = 'success';
    },
    // Aksi untuk menandai bahwa status otentikasi sedang diperiksa
    setLoading(state) {
      state.status = 'loading';
    }
  },
});

export const { login, logout, setLoading } = userSlice.actions;
export default userSlice.reducer;
