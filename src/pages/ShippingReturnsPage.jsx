// src/pages/ShippingReturnsPage.jsx
import React from 'react';
import { 
  Box, Container, Typography, 
  List, ListItem, ListItemText, 
  Divider, // Added Divider for separation
  useTheme, useMediaQuery
} from '@mui/material';

function ShippingReturnsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="md" sx={{ my: { xs: 4, md: 8 } }}>
      <Typography 
        variant="h4" 
        component="h1" 
        fontWeight="bold" 
        gutterBottom 
        sx={{ 
          textAlign: 'center', 
          mb: { xs: 3, md: 6 }, 
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          color: theme.palette.text.primary 
        }}
      >
        Shipping & Returns Policy
      </Typography>

      <Box sx={{ mb: { xs: 4, md: 6 } }}> {/* Section wrapper */}
        <Typography 
          variant="h5" 
          fontWeight="bold" 
          mt={{ xs: 4, md: 5 }} 
          mb={{ xs: 1.5, md: 2.5 }}
          sx={{ color: theme.palette.primary.main }} // Use theme primary color
        >
          Shipping Information
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            lineHeight: 1.7, 
            fontSize: { xs: '0.9rem', sm: '1rem' },
            color: theme.palette.text.secondary
          }}
        >
          All orders are processed within 1-2 business days. Domestic shipping typically takes between 3-7 business days depending on your location. Shipping costs will be calculated at checkout. We partner with reputable shipping carriers to ensure your products arrive safely and on time.
        </Typography>
      </Box>

      <Divider sx={{ my: { xs: 3, md: 5 } }} /> {/* <--- Estetika: Divider for clear separation */}

      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography 
          variant="h5" 
          fontWeight="bold" 
          mt={{ xs: 4, md: 5 }} 
          mb={{ xs: 1.5, md: 2.5 }}
          sx={{ color: theme.palette.primary.main }}
        >
          Returns & Exchanges
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            lineHeight: 1.7, 
            fontSize: { xs: '0.9rem', sm: '1rem' },
            mb: { xs: 2, md: 3 },
            color: theme.palette.text.secondary
          }}
        >
          We accept returns or exchanges of products within 7 days of order receipt. Products must be in new, unused condition, and in original packaging.
        </Typography>
        <List sx={{ px: { xs: 1, md: 2 } }}> {/* Added horizontal padding to list */}
          <ListItem sx={{ py: 0.5 }}>
            <ListItemText primary={
              <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, color: theme.palette.text.secondary }}>
                1. Contact our customer service to initiate the return process.
              </Typography>
            } />
          </ListItem>
          <ListItem sx={{ py: 0.5 }}>
            <ListItemText primary={
              <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, color: theme.palette.text.secondary }}>
                2. Provide proof of purchase and reason for return.
              </Typography>
            } />
          </ListItem>
          <ListItem sx={{ py: 0.5 }}>
            <ListItemText primary={
              <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, color: theme.palette.text.secondary }}>
                3. Upon approval, send the product back to the provided address.
              </Typography>
            } />
          </ListItem>
          <ListItem sx={{ py: 0.5 }}>
            <ListItemText primary={
              <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, color: theme.palette.text.secondary }}>
                4. Refunds will be processed within 5-10 business days after the product is received and inspected.
              </Typography>
            } />
          </ListItem>
        </List>
        <Typography 
          variant="body1" 
          sx={{ 
            lineHeight: 1.7, 
            fontSize: { xs: '0.9rem', sm: '1rem' },
            mt: { xs: 2, md: 3 }, // Adjusted top margin
            color: theme.palette.text.secondary
          }}
        >
          Return shipping costs will be borne by the customer, unless the return is due to our error (e.g., damaged or incorrect product).
        </Typography>
      </Box>
    </Container>
  );
}

export default ShippingReturnsPage;