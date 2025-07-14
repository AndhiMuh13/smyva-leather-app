// src/components/UserRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

function UserRoute() {
  const { user, status } = useSelector((state) => state.user);

  // Tampilkan loading spinner saat status otentikasi sedang diperiksa
  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Jika sudah tidak loading dan ada user yang login, tampilkan kontennya
  if (user) {
    return <Outlet />;
  }

  // Jika tidak ada user, arahkan ke halaman utama
  return <Navigate to="/" replace />;
}

export default UserRoute;
