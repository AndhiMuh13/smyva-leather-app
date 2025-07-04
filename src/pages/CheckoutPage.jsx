// src/pages/CheckoutPage.jsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Grid, Paper, Typography, TextField, Box, Button, Divider } from '@mui/material';

function CheckoutPage() {
  const cartItems = useSelector(state => state.cart.items);
  const user = useSelector(state => state.user.user); // Ambil data user yang login
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const shippingCost = 5000;
  const total = subtotal + shippingCost;

  // State untuk menampung data dari form
  const [formData, setFormData] = useState({
    email: user?.email || '', // Isi otomatis jika user login
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ')[1] || '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logika untuk "Proceed to Payment" akan ditambahkan di sini
    console.log('Form Data:', formData);
    console.log('Cart Items:', cartItems);
  };

  return (
    <Container sx={{ my: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Checkout</Typography>
      <Grid container spacing={5}>

        {/* Kolom Kiri: Form Alamat */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" gutterBottom>Shipping Address</Typography>
          <Box component="form" id="checkout-form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField required fullWidth id="email" label="Email Address" name="email" value={formData.email} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth id="firstName" label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth id="lastName" label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth id="address" label="Address" name="address" value={formData.address} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth id="city" label="City" name="city" value={formData.city} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth id="postalCode" label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth id="phone" label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Kolom Kanan: Ringkasan Pesanan */}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Subtotal</Typography>
              <Typography>Rp {subtotal.toLocaleString('id-ID')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Shipping</Typography>
              <Typography>Rp {shippingCost.toLocaleString('id-ID')}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" fontWeight="bold">Total</Typography>
              <Typography variant="h6" fontWeight="bold">Rp {total.toLocaleString('id-ID')}</Typography>
            </Box>
            {/* Tombol ini sekarang akan men-submit form di sebelah kiri */}
            <Button type="submit" form="checkout-form" variant="contained" fullWidth size="large" sx={{ mt: 3 }}>
              Proceed to Payment
            </Button>
          </Paper>
        </Grid>

      </Grid>
    </Container>
  );
}

export default CheckoutPage;
