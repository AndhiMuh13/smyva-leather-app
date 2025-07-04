// src/App.jsx
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { monitorAuthState } from './services/authService'; // Impor fungsi monitor
import { login, logout } from './store/userSlice'; // Impor aksi Redux

// Import komponen utama dan halaman
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

function App() {
  const dispatch = useDispatch();

  // useEffect ini akan berjalan sekali saat aplikasi pertama kali dimuat
  useEffect(() => {
    // Jalankan fungsi monitorAuthState untuk mendengarkan perubahan status login dari Firebase
    const unsubscribe = monitorAuthState((user) => {
      if (user) {
        // Jika ada pengguna yang login, kirim datanya ke Redux store
        dispatch(login(user));
      } else {
        // Jika tidak ada, pastikan state Redux juga logout
        dispatch(logout());
      }
    });

    // Cleanup listener saat komponen tidak lagi digunakan
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
