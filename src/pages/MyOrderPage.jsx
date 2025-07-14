import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

// Impor komponen-komponen untuk membuat tabel
import {
  Box, Typography, CircularProgress, Paper, TableContainer,
  Table, TableHead, TableBody, TableRow, TableCell, Chip, Link
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // Impor Link dari router

// Komponen untuk Chip Status dengan warna kustom
const StatusChip = ({ status }) => {
  const statusStyles = {
    completed: { bgcolor: '#D5F5E3', color: '#2ECC71', fontWeight: 'bold' },
    shipped: { bgcolor: '#AED6F1', color: '#3498DB', fontWeight: 'bold' },
    processing: { bgcolor: '#FFF3C1', color: '#F1C40F', fontWeight: 'bold' },
    paid: { bgcolor: '#E8DAEF', color: '#8E44AD', fontWeight: 'bold' },
    cancelled: { bgcolor: '#F5B7B1', color: '#E74C3C', fontWeight: 'bold' },
    failed: { bgcolor: '#F5B7B1', color: '#E74C3C', fontWeight: 'bold' },
    pending: { bgcolor: '#EAECEE', color: '#7F8C8D', fontWeight: 'bold' },
  };
  const style = statusStyles[status] || {};
  return <Chip label={status} size="small" sx={style} />;
};


function MyOrderPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const ordersRef = collection(db, 'orders');
          const q = query(
            ordersRef,
            where("userId", "==", currentUser.uid),
            orderBy("createdAt", "desc")
          );
          const querySnapshot = await getDocs(q);
          const userOrders = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setOrders(userOrders);
        } catch (error) {
          console.error("Error fetching orders: ", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <CircularProgress />;
  if (!user) return <Typography sx={{ p: 3 }}>Please log in to view your orders.</Typography>;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>My Order</Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: '#F5F5F5' }}>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>No. Product</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Data Added</TableCell>
              <TableCell>Track</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">You have not placed any orders yet.</TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  {/* BARIS YANG BERUBAH */}
                  <TableCell component="th" scope="row">
                    <Link component={RouterLink} to={`/order-detail/${order.id}`} underline="always">
                      #{order.id.substring(0, 6)}
                    </Link>
                  </TableCell>
                  {/* AKHIR DARI BARIS YANG BERUBAH */}
                  <TableCell>{order.customerDetails?.first_name || 'N/A'}</TableCell>
                  <TableCell align="center">{order.items?.filter(item => item.id !== 'SHIPPING_COST').length || 0}</TableCell>
                  <TableCell>{order.items?.[0]?.name || 'Multiple Items'}</TableCell>
                  <TableCell><StatusChip status={order.status || 'processing'} /></TableCell>
                  <TableCell>IDR {order.totalAmount?.toLocaleString('id-ID') || 0}</TableCell>
                  <TableCell>{order.createdAt?.toDate().toLocaleDateString('en-GB') || 'N/A'}</TableCell>
                  <TableCell>
                    <Link component={RouterLink} to={`/track-order/${order.id}`} underline="always">
                      Track
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyOrderPage;