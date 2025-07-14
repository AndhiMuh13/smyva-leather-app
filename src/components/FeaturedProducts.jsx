import { useState, useEffect } from 'react';
import { Grid, CircularProgress, Box, Typography, Container } from '@mui/material'; // Tambah Typography, Container
import ProductCard from './ProductCard';
import { db } from '../firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsQuery = query(collection(db, 'products'), limit(8));
        const data = await getDocs(productsQuery);
        setProducts(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>
  }

  return (
    <Container maxWidth="lg" sx={{ my: { xs: 5, md: 8 }, textAlign: 'center' }}> {/* <--- Estetika: Tambah Container, margin, text-align */}
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: { xs: 3, md: 5 } }}> {/* <--- Estetika: Judul Section */}
        Featured Products
      </Typography>
      <Grid 
        container 
        spacing={{ xs: 2, md: 3 }} // <--- Responsif: Sesuaikan spacing antar kartu
        justifyContent="center" // Agar kartu di tengah jika ada sisa ruang
      >
        {products.map((product) => (
          // PERBAIKAN GRID V2: Hapus prop 'item'
          <Grid key={product.id} xs={12} sm={6} md={4} lg={3}> {/* <--- PERBAIKAN INI */}
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default FeaturedProducts;