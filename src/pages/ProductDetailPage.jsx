import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Container, Grid, Box, Typography, Button, CircularProgress, Rating, Paper, 
  IconButton, Tabs, Tab, Divider, List, ListItem, ListItemAvatar, Avatar, 
  ListItemText, TextField 
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { addItemToCart } from '../store/cartSlice';
import { useSnackbar } from 'notistack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// Komponen helper untuk menampilkan konten Tab
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3, whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{children}</Box>}
    </div>
  );
}

function ProductDetailPage() {
  const { productId } = useParams();
  const { user } = useSelector(state => state.user);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);

  // State untuk form ulasan baru
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Fungsi untuk mengambil data produk dan ulasan
  const fetchProductData = async () => {
    // Tidak perlu setLoading(true) di sini karena sudah diatur di useEffect
    try {
      const productRef = doc(db, "products", productId);
      const productSnap = await getDoc(productRef);
      
      if (productSnap.exists()) {
        const productData = { id: productSnap.id, ...productSnap.data() };
        setProduct(productData);
        // Hanya set gambar utama saat pertama kali, atau jika belum ada
        if (!selectedImage) {
          setSelectedImage(productData.imageUrl);
        }

        const reviewsQuery = query(collection(db, `products/${productId}/reviews`), orderBy('createdAt', 'desc'));
        const reviewsSnapshot = await getDocs(reviewsQuery);
        setReviews(reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        setProduct(null);
        console.log("Product not found!");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true); // Set loading saat ID produk berubah
    fetchProductData();
  }, [productId]);

  // Handler untuk menambah produk ke keranjang
  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    if (quantity > product.stock) {
      enqueueSnackbar(`Hanya tersisa ${product.stock} item di stok!`, { variant: 'warning' });
      return;
    }
    dispatch(addItemToCart({ ...product, quantity }));
    enqueueSnackbar(`${quantity} x ${product.name} ditambahkan ke keranjang`, { variant: 'success' });
  };

  // Handler untuk tombol "Beli Sekarang"
  const handleBuyNow = () => {
    if (!product || product.stock === 0) return;
    handleAddToCart(); // Tetap tambahkan ke keranjang
    navigate('/checkout'); // Lalu arahkan ke halaman checkout
  };

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  // Handler untuk mengirim ulasan baru
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (newReviewRating === 0 || newReviewText.trim() === '') {
      enqueueSnackbar('Rating dan ulasan tidak boleh kosong.', { variant: 'warning' });
      return;
    }
    setIsSubmittingReview(true);
    try {
      const reviewsRef = collection(db, `products/${productId}/reviews`);
      await addDoc(reviewsRef, {
        userId: user.uid,
        userName: user.displayName,
        userAvatar: user.photoURL,
        rating: newReviewRating,
        text: newReviewText,
        createdAt: serverTimestamp(),
      });
      enqueueSnackbar('Ulasan Anda berhasil dikirim!', { variant: 'success' });
      setNewReviewText('');
      setNewReviewRating(0);
      await fetchProductData(); // Panggil ulang untuk refresh ulasan
    } catch (error) {
      console.error("Error submitting review:", error);
      enqueueSnackbar('Gagal mengirim ulasan.', { variant: 'error' });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
  if (!product) return <Typography align="center" sx={{ my: 5 }}>Produk tidak ditemukan.</Typography>;

  const galleryImages = [product.imageUrl, ...(product.otherImages || [])].filter(Boolean);

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 5 } }}>
        
        {/* Kolom Kiri: Galeri Gambar */}
        <Box sx={{ flex: 1, width: { xs: '100%', md: '50%' } }}>
          <Paper elevation={0} sx={{ border: '1px solid #eee', borderRadius: 2, overflow: 'hidden', mb: 1 }}>
            <Box
              component="img"
              src={selectedImage}
              alt={product.name}
              sx={{ width: '100%', height: 'auto', aspectRatio: '1 / 1', objectFit: 'cover' }}
            />
          </Paper>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {galleryImages.map((img, index) => (
              <Box key={index} sx={{ flexBasis: '25%', maxWidth: '25%', pr: index !== galleryImages.length - 1 ? 1 : 0 }}>
                <Paper
                  onClick={() => setSelectedImage(img)}
                  sx={{ border: selectedImage === img ? '2px solid #8D6E63' : '1px solid #eee', cursor: 'pointer', borderRadius: 2, overflow: 'hidden', lineHeight: 0 }}
                >
                  <Box component="img" src={img} sx={{ width: '100%', height: 'auto', display: 'block' }} />
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>
        
        {/* Kolom Kanan: Info Produk */}
        <Box sx={{ flex: 1, width: { xs: '100%', md: '50%' } }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>{product.name}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Rating value={product.rating || 0} precision={0.5} readOnly />
            <Typography>{reviews.length} Reviews</Typography>
          </Box>
          <Typography variant="h3" fontWeight="bold" sx={{ my: 2, color: '#4E342E' }}>
            Rp {product.price.toLocaleString('id-ID')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 3 }}>
            <Typography>Quantity</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: 2 }}>
              <IconButton onClick={() => setQuantity(q => Math.max(1, q - 1))} size="small" disabled={product.stock === 0}><RemoveIcon /></IconButton>
              <Typography sx={{ px: 2, fontWeight: 'bold' }}>{quantity}</Typography>
              <IconButton onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} size="small" disabled={quantity >= product.stock || product.stock === 0}><AddIcon /></IconButton>
            </Box>
            <Typography color="text.secondary">Stok: {product.stock}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button variant="outlined" size="large" onClick={handleAddToCart} disabled={product.stock === 0} sx={{ flexGrow: 1, borderColor: '#8D6E63', color: '#8D6E63' }}>
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button variant="contained" size="large" onClick={handleBuyNow} disabled={product.stock === 0} sx={{ flexGrow: 1, bgcolor: '#8D6E63', '&:hover': { bgcolor: '#6D4C41' }}}>
              {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
            </Button>
          </Box>
        </Box>
      </Box>
      
      {/* Bagian Bawah: Deskripsi & Ulasan dengan Tab */}
      <Paper elevation={0} sx={{ border: '1px solid #eee', borderRadius: 2, mt: 5, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ bgcolor: '#F5F5F5' }}>
              <Tab label="Product Specifications" />
              <Tab label="Product Description" />
              <Tab label={`Product Assessment (${reviews.length})`} />
            </Tabs>
        </Box>
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}><Typography color="text.secondary">Brand</Typography></Grid>
            <Grid item xs={12} sm={8}><Typography>SMYVA LEATHER</Typography></Grid>
            <Grid item xs={12} sm={4}><Typography color="text.secondary">Material</Typography></Grid>
            <Grid item xs={12} sm={8}><Typography>{product.material || 'N/A'}</Typography></Grid>
            <Grid item xs={12} sm={4}><Typography color="text.secondary">Color</Typography></Grid>
            <Grid item xs={12} sm={8}><Typography>{product.color || 'Varies'}</Typography></Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={activeTab} index={1}>{product.description || 'No description available.'}</TabPanel>
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>Customer Reviews</Typography>
          <List>
            {reviews.length > 0 ? reviews.map(review => (
              <React.Fragment key={review.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar><Avatar alt={review.userName} src={review.userAvatar} /></ListItemAvatar>
                  <ListItemText
                    primary={<><Typography component="span" fontWeight="bold">{review.userName}</Typography> <Rating value={review.rating} size="small" readOnly sx={{verticalAlign: 'middle', ml:1}}/></>}
                    secondary={<Typography sx={{ mt: 1 }} variant="body2" color="text.primary">{review.text}</Typography>}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            )) : <Typography>No reviews yet for this product.</Typography>}
          </List>
          {user ? (
            <Box component="form" onSubmit={handleReviewSubmit} sx={{ mt: 4, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Write Your Review</Typography>
              <Rating name="new-review-rating" value={newReviewRating} onChange={(e, val) => setNewReviewRating(val)} sx={{ mb: 2 }}/>
              <TextField label="Your Review" multiline rows={4} fullWidth value={newReviewText} onChange={(e) => setNewReviewText(e.target.value)} required/>
              <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={isSubmittingReview}>
                {isSubmittingReview ? <CircularProgress size={24} /> : 'Submit Review'}
              </Button>
            </Box>
          ) : (
            <Typography sx={{ mt: 3, textAlign: 'center' }}>
              Please <Button component={Link} to="#">login</Button> to write a review.
            </Typography>
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
}

export default ProductDetailPage;