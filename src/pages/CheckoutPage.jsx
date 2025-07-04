// src/pages/CheckoutPage.jsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Paper, Typography, TextField, Box, Button, Divider, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { clearCart } from '../store/cartSlice';

function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const user = useSelector(state => state.user.user);
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const shippingCost = 5000;
  const total = subtotal + shippingCost;

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ')[1] || '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Semua logika pembayaran sekarang ada di dalam fungsi ini
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Pengecekan penting sebelum melanjutkan
    if (!user) {
        setError("Anda harus login untuk melanjutkan pembayaran.");
        setIsLoading(false);
        return;
    }
    if (cartItems.length === 0) {
        setError("Keranjang Anda kosong.");
        setIsLoading(false);
        return;
    }

    const transactionDetails = {
      orderId: `SMYVA-${Date.now()}`,
      total: total,
      items: cartItems.map(item => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        name: item.name,
      })),
      customerDetails: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        billing_address: {
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
        }
      },
    };

    try {
      const response = await axios.post('/api/create-transaction', transactionDetails);
      const { token } = response.data;

      window.snap.pay(token, {
        onSuccess: async (result) => {
          await addDoc(collection(db, 'orders'), {
            userId: user.uid,
            ...transactionDetails,
            paymentResult: result,
            status: 'processing',
            createdAt: new Date(),
          });
          dispatch(clearCart());
          alert("Pembayaran berhasil!");
          navigate('/');
        },
        onPending: (result) => {
          alert("Menunggu pembayaran Anda.");
        },
        onError: (err) => {
          setError(err.message || "Terjadi kesalahan saat pembayaran.");
        },
        onClose: () => {
          console.log('Jendela pembayaran ditutup oleh pengguna.');
        }
      });

    } catch (err) {
      setError(err.response?.data?.error || 'Gagal membuat transaksi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container sx={{ my: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Checkout</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={5}>
        <Grid item xs={12} md={7}>
          <Typography variant="h6" gutterBottom>Shipping Address</Typography>
          <Box component="form" id="checkout-form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}><TextField required fullWidth label="Email Address" name="email" value={formData.email} onChange={handleChange} /></Grid>
              <Grid item xs={12} sm={6}><TextField required fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} /></Grid>
              <Grid item xs={12} sm={6}><TextField required fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} /></Grid>
              <Grid item xs={12}><TextField required fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} /></Grid>
              <Grid item xs={12} sm={6}><TextField required fullWidth label="City" name="city" value={formData.city} onChange={handleChange} /></Grid>
              <Grid item xs={12} sm={6}><TextField required fullWidth label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} /></Grid>
              <Grid item xs={12}><TextField required fullWidth label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} /></Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            {cartItems.map(item => (
              <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                <Typography>{item.name} x {item.quantity}</Typography>
                <Typography>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Subtotal</Typography><Typography>Rp {subtotal.toLocaleString('id-ID')}</Typography></Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}><Typography>Shipping</Typography><Typography>Rp {shippingCost.toLocaleString('id-ID')}</Typography></Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="h6" fontWeight="bold">Total</Typography><Typography variant="h6" fontWeight="bold">Rp {total.toLocaleString('id-ID')}</Typography></Box>
            <Button
              type="submit"
              form="checkout-form"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              disabled={isLoading || cartItems.length === 0}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Proceed to Payment'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CheckoutPage;
