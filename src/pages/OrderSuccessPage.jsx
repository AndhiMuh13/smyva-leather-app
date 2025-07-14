// src/pages/OrderSuccessPage.jsx
import { Container, Paper, Typography, Box, Button, Divider } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function OrderSuccessPage() {
  // Ambil ID pesanan dari URL
  const { orderId } = useParams();

  return (
    <Container maxWidth="sm" sx={{ my: 5 }}>
      <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Thank You for Your Order!
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Your payment was successful and your order is being processed.
        </Typography>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="body1">Your Order ID:</Typography>
          <Typography fontWeight="bold" sx={{ mt: 1, wordBreak: 'break-all' }}>
            {orderId}
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/"
          variant="contained"
          size="large"
          sx={{ mt: 4 }}
        >
          Continue Shopping
        </Button>
      </Paper>
    </Container>
  );
}

export default OrderSuccessPage;
