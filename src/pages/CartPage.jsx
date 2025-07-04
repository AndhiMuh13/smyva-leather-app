// src/pages/CartPage.jsx
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Box, Grid, Paper, Button, Divider, Rating, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { addItemToCart, removeItemFromCart, deleteItemFromCart } from '../store/cartSlice';

// Impor ikon untuk tombol
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const totalQuantity = useSelector(state => state.cart.totalQuantity);
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleAddItem = (item) => {
    dispatch(addItemToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.image,
    }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const handleDeleteItem = (id) => {
    dispatch(deleteItemFromCart(id));
  }

  return (
    <Container sx={{ my: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" fontWeight="bold">My Cart</Typography>
        <Typography>{totalQuantity} Items Product</Typography>
      </Box>
      <Divider sx={{ mb: 4 }} />

      {cartItems.length === 0 ? (
        <Typography sx={{ mt: 5, textAlign: 'center' }}>Keranjang Anda kosong.</Typography>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {cartItems.map(item => (
              <Paper key={item.id} elevation={0} variant="outlined" sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 2, borderRadius: 3, position: 'relative' }}>
                <IconButton 
                    aria-label="delete" 
                    size="small" 
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={() => handleDeleteItem(item.id)}
                >
                    <DeleteForeverIcon fontSize="small" />
                </IconButton>
                <Box component="img" src={item.image} alt={item.name} sx={{ width: 120, height: 120, borderRadius: 2, mr: 3 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="bold">{item.name}</Typography>
                  <Typography color="text.secondary">Rp {item.price.toLocaleString('id-ID')}</Typography>
                  <Rating name="read-only" value={4.5} size="small" readOnly sx={{ mt: 1 }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={() => handleRemoveItem(item.id)}>
                        <RemoveCircleOutlineIcon />
                    </IconButton>
                    <Typography fontWeight="bold" sx={{ width: '2ch', textAlign: 'center' }}>{item.quantity}</Typography>
                    <IconButton onClick={() => handleAddItem(item)}>
                        <AddCircleOutlineIcon />
                    </IconButton>
                </Box>
              </Paper>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3 }} variant="outlined">
              <Typography variant="h6" fontWeight="bold">Subtotal amount</Typography>
              <Typography variant="h5" fontWeight="bold" sx={{ my: 2 }}>Rp {subtotal.toLocaleString('id-ID')}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Duties & Tax Calculated at Checkout</Typography>
              <Button variant="contained" fullWidth size="large" component={Link} to="/checkout">Continue to Checkout</Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default CartPage;
