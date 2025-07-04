// src/store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Aksi untuk menambah item (atau menambah kuantitas jika sudah ada)
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      
      state.totalQuantity++;
      
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          image: newItem.imageUrl,
          quantity: 1,
          totalPrice: newItem.price,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      }
    },
    // Aksi untuk mengurangi kuantitas item
    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        state.totalQuantity--;
        if (existingItem.quantity === 1) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
        }
      }
    },
    // Aksi untuk menghapus item sepenuhnya dari keranjang
    deleteItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      if (existingItem) {
        state.totalQuantity = state.totalQuantity - existingItem.quantity;
        state.items = state.items.filter(item => item.id !== id);
      }
    },
    // Aksi untuk mengosongkan keranjang setelah checkout berhasil
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
    }
  },
});

export const { addItemToCart, removeItemFromCart, deleteItemFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
