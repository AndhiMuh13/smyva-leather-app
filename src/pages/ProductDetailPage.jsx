// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Container, Grid, Box, Typography, Button, CircularProgress, Rating } from '@mui/material';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../store/cartSlice'; // Impor aksi yang sudah diperbaiki

function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addItemToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    }));
  };

  const handleBuyNow = () => {
    if (!product) return;
    dispatch(addItemToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    }));
    navigate('/cart');
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
  }

  if (!product) {
    return <Typography align="center" sx={{ my: 5 }}>Produk tidak ditemukan.</Typography>;
  }

  return (
    <Container sx={{ my: 5 }}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
          <Box component="img" src={product.imageUrl} alt={product.name} sx={{ width: '100%', borderRadius: 3 }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>{product.name}</Typography>
          <Rating name="read-only" value={4.5} precision={0.5} readOnly />
          <Typography variant="h3" fontWeight="bold" color="primary.main" sx={{ my: 2 }}>
            Rp {product.price.toLocaleString('id-ID')}
          </Typography>
          <Typography paragraph>{product.description || "Deskripsi tidak tersedia."}</Typography>
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button variant="outlined" size="large" onClick={handleAddToCart}>Masukkan Keranjang</Button>
            <Button variant="contained" size="large" onClick={handleBuyNow}>Beli Sekarang</Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProductDetailPage;
