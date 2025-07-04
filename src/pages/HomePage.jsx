// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, CircularProgress } from '@mui/material';
import ProductCard from '../components/ProductCard'; // Impor komponen kartu
import { db } from '../firebase'; // Impor koneksi database
import { collection, getDocs } from 'firebase/firestore';

function HomePage() {
  // State untuk menyimpan daftar produk
  const [products, setProducts] = useState([]);
  // State untuk menandakan proses loading data
  const [loading, setLoading] = useState(true);

  // useEffect akan berjalan satu kali saat komponen pertama kali dimuat
  useEffect(() => {
    // Fungsi untuk mengambil data dari Firestore
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const data = await getDocs(productsCollection);

        // Ubah data dari Firestore menjadi format array yang kita inginkan
        const productsData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setProducts(productsData); // Simpan data ke state
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false); // Hentikan loading, baik berhasil maupun gagal
      }
    };

    fetchProducts();
  }, []); // Array kosong berarti efek ini hanya berjalan sekali

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Our Products
      </Typography>

      {loading ? (
        // Tampilkan ikon loading jika data sedang diambil
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        // Tampilkan produk dalam grid jika loading selesai
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default HomePage;