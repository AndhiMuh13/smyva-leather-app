import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container, Grid, Paper, Typography, TextField, Box, Button, Divider,
  CircularProgress, Alert, Stack, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import axios from 'axios';
import { db } from '../firebase';
import { collection, doc, setDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { clearCart } from '../store/cartSlice';
import { useSnackbar } from 'notistack';

const BACKEND_URL = "http://localhost:3001";

function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const user = useSelector(state => state.user.user);
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    email: '', recipientName: '', phoneNumber: '', fullAddress: '',
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = 10000;
  const total = subtotal + shippingCost;

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev, email: user.email || '', recipientName: user.displayName || ''
      }));
      const fetchAddresses = async () => {
        try {
          const addressRef = collection(db, 'users', user.uid, 'addresses');
          const qSnapshot = await getDocs(addressRef);
          setSavedAddresses(qSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err) {
          console.error("Gagal mengambil alamat:", err);
        }
      };
      fetchAddresses();
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleAddressSelect = (e) => {
    const { value } = e.target;
    setSelectedAddressId(value);
    if (value === 'new') {
      setFormData({
        email: user.email || '', recipientName: user.displayName || '', phoneNumber: '', fullAddress: '',
      });
    } else {
      const selected = savedAddresses.find(addr => addr.id === value);
      if (selected) {
        setFormData(prev => ({
          ...prev,
          recipientName: selected.recipientName,
          phoneNumber: selected.phoneNumber,
          fullAddress: selected.fullAddress,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!user || cartItems.length === 0) {
      setError("Please login and ensure your cart is not empty.");
      setIsLoading(false);
      return;
    }

    const orderId = `SMYVA-${Date.now()}`;
    const [firstName, ...lastName] = formData.recipientName.split(' ');
    
    // ## PERBAIKAN KUNCI ADA DI SINI ##
    // Struktur payload disesuaikan dengan kebutuhan API Midtrans
    const transactionPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: total,
      },
      item_details: [
        ...cartItems.map(item => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity,
          name: item.name
        })),
        {
          id: 'SHIPPING_COST',
          price: shippingCost,
          quantity: 1,
          name: 'Shipping Cost'
        }
      ],
      customer_details: {
        first_name: firstName,
        last_name: lastName.join(' '),
        email: formData.email,
        phone: formData.phoneNumber,
        billing_address: {
          address: formData.fullAddress,
          city: '', // Bisa dikosongkan atau diisi jika ada datanya
          postal_code: '', // Bisa dikosongkan atau diisi jika ada datanya
        }
      },
    };

    try {
      await setDoc(doc(db, 'orders', orderId), {
        userId: user.uid,
        customerDetails: transactionPayload.customer_details,
        items: transactionPayload.item_details,
        totalAmount: total,
        orderId: orderId,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      const response = await axios.post(`${BACKEND_URL}/create-transaction`, transactionPayload);
      const { token } = response.data;
      
      window.snap.pay(token, {
        onSuccess: (result) => { dispatch(clearCart()); navigate(`/order-success/${result.order_id}`); },
        onPending: (result) => { dispatch(clearCart()); navigate(`/order-success/${result.order_id}`); },
        onError: (err) => setError(err.message || "Payment error occurred."),
        onClose: () => enqueueSnackbar('You closed the payment window before finishing.', { variant: 'warning' })
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process the order.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container sx={{ my: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Checkout</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={5}>
        <Box sx={{ width: { xs: '100%', md: '60%' } }}>
          <Typography variant="h6" gutterBottom>Shipping Address</Typography>
          {user && savedAddresses.length > 0 && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="address-select-label">Choose a saved address</InputLabel>
              <Select labelId="address-select-label" value={selectedAddressId} label="Choose a saved address" onChange={handleAddressSelect}>
                <MenuItem value="new"><em>-- Add a new address --</em></MenuItem>
                {savedAddresses.map(addr => (<MenuItem key={addr.id} value={addr.id}>{addr.label} - {addr.recipientName}</MenuItem>))}
              </Select>
            </FormControl>
          )}
          <Box component="form" id="checkout-form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}><TextField required fullWidth label="Recipient Name" name="recipientName" value={formData.recipientName} onChange={handleChange} /></Grid>
              <Grid item xs={12}><TextField required fullWidth label="Email Address" name="email" value={formData.email} onChange={handleChange} /></Grid>
              <Grid item xs={12}><TextField required fullWidth label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} /></Grid>
              <Grid item xs={12}><TextField required fullWidth label="Full Address" name="fullAddress" placeholder="Jalan, nomor, kecamatan, kota, dll." value={formData.fullAddress} onChange={handleChange} multiline rows={4} /></Grid>
            </Grid>
          </Box>
        </Box>
        <Box sx={{ width: { xs: '100%', md: '40%' } }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, position: 'sticky', top: '100px' }}>
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
            <Button type="submit" form="checkout-form" variant="contained" fullWidth size="large" sx={{ mt: 3 }} disabled={isLoading || cartItems.length === 0}>
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Proceed to Payment'}
            </Button>
          </Paper>
        </Box>
      </Stack>
    </Container>
  );
}

export default CheckoutPage;