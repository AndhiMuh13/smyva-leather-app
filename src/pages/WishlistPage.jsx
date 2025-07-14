// src/pages/WishlistPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import ProductCard from '../components/ProductCard';

function WishlistPage() {
  const { user } = useSelector(state => state.user);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data().wishlist?.length > 0) {
          const wishlistIds = userSnap.data().wishlist;
          // Ambil data produk berdasarkan ID yang ada di wishlist
          const productsQuery = query(collection(db, 'products'), where('__name__', 'in', wishlistIds));
          const productsSnapshot = await getDocs(productsQuery);
          setWishlistProducts(productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else {
          setWishlistProducts([]); // Kosongkan jika wishlist tidak ada atau kosong
        }
      } catch (error) {
        console.error("Error fetching wishlist products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Container sx={{ my: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>My Wishlist</Typography>
      
      {!user ? (
        <Typography>Please login to see your wishlist.</Typography>
      ) : wishlistProducts.length > 0 ? (
        <Grid container spacing={4}>
          {wishlistProducts.map(product => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>Your wishlist is empty. Start adding some products!</Typography>
      )}
    </Container>
  );
}

export default WishlistPage;