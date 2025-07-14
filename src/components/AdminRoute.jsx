// src/components/AdminRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

function AdminRoute() {
  const { user, status } = useSelector((state) => ({
    user: state.user.user,
    // Kita tambahkan status untuk menangani loading awal
    status: state.user.status, 
  }));

  // Tampilkan loading spinner saat status otentikasi sedang diperiksa
  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Jika sudah tidak loading, periksa apakah ada user dan perannya adalah 'admin'
  if (user && user.role === 'admin') {
    // Jika ya, tampilkan konten halaman admin (menggunakan <Outlet />)
    return <Outlet />;
  }

  // Jika tidak, arahkan pengguna ke halaman utama
  return <Navigate to="/" replace />;
}

export default AdminRoute;
