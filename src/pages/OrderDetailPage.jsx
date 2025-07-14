import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Box, Typography, Paper, Grid, CircularProgress, Alert, Button, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Container // <--- Tambahkan ini
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);
        if (orderSnap.exists()) {
          setOrder({ id: orderSnap.id, ...orderSnap.data() });
        } else {
          setError('Order not found.');
        }
      } catch (err) {
        setError('Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!order) return null;

  const subtotal = order.totalAmount - (order.items.find(item => item.id === 'SHIPPING_COST')?.price || 0);

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">Proof of Payment</Typography>
            <Typography color="text.secondary">SMYVA Leather</Typography>
          </Box>
          <Button onClick={() => navigate(-1)}>Back</Button>
        </Box>
        <Divider />

        <Grid container spacing={4} sx={{ my: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold">Payment Date :</Typography>
            <Typography>{order.createdAt?.toDate().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) || 'N/A'}</Typography>
            
            <Typography fontWeight="bold" sx={{ mt: 2 }}>Payment Method :</Typography>
            <Typography>{order.paymentResult?.payment_type || 'N/A'}</Typography>
            {/* Anda bisa menambahkan logo DANA atau metode pembayaran lain di sini */}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold">Payment Details :</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Products</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.filter(item => item.id !== 'SHIPPING_COST').map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">Rp {Number(item.price).toLocaleString('id-ID')}</TableCell>
                      <TableCell align="right">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right" sx={{ border: 'none' }}></TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.2rem', border: 'none' }}>
                        Rp {subtotal.toLocaleString('id-ID')}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        
        <Divider />

        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '250px' }}>
                <Typography>Sup Total</Typography>
                <Typography>Rp {subtotal.toLocaleString('id-ID')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '250px' }}>
                <Typography>Ongkir</Typography>
                <Typography>Rp {(order.totalAmount - subtotal).toLocaleString('id-ID')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '250px', fontWeight: 'bold', mt: 1 }}>
                <Typography variant="h6" fontWeight="bold">Total</Typography>
                <Typography variant="h6" fontWeight="bold">Rp {order.totalAmount.toLocaleString('id-ID')}</Typography>
            </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
            <Typography>Shipping : SPX Standard</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>Status Pembayaran :</Typography>
                <Typography color="success.main" fontWeight="bold">BERHASIL</Typography>
                <CheckCircleIcon color="success" fontSize="small"/>
            </Box>
        </Box>
        
        <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="h6">Terima kasih telah berbelanja!</Typography>
            <Typography color="text.secondary">Barang anda akan segera dikirim ke alamat Anda.</Typography>
        </Box>

      </Paper>
    </Container>
  );
}

export default OrderDetailPage;