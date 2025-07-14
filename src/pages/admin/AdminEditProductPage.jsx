import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, increment, collection, getDocs } from 'firebase/firestore';
import axios from 'axios';
import { useSnackbar } from 'notistack';

// Ganti dengan kredensial Cloudinary Anda
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dmhe5gadp/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

function AdminEditProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [originalStock, setOriginalStock] = useState(0);

  const [mainImageFile, setMainImageFile] = useState(null);
  const [otherImageFiles, setOtherImageFiles] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const productRef = doc(db, 'products', productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data();
          setProduct(productData);
          setOriginalStock(productData.stock || 0);
        } else {
          setError('Product not found.');
        }

        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        setCategories(categoriesSnapshot.docs.map(doc => doc.data().name));

      } catch (err) {
        setError('Failed to load data.');
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, [productId]);

  const handleInputChange = (e) => setProduct({ ...product, [e.target.name]: e.target.value });
  const handleMainImageChange = (e) => { if (e.target.files[0]) setMainImageFile(e.target.files[0]); };
  
  const uploadImage = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      const response = await axios.post(CLOUDINARY_URL, formData);
      return response.data.secure_url;
    } catch (err) {
      console.error('Cloudinary Upload Error:', err);
      throw new Error('Failed to upload image to Cloudinary.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let mainImageUrl = product.imageUrl || '';
      if (mainImageFile) {
        mainImageUrl = await uploadImage(mainImageFile);
      }
      
      const updatedProductData = {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
        imageUrl: mainImageUrl,
      };

      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, updatedProductData);

      const stockDifference = updatedProductData.stock - originalStock;
      if (stockDifference !== 0) {
        const statsRef = doc(db, 'summary', 'stats');
        await updateDoc(statsRef, {
          totalStock: increment(stockDifference)
        });
      }
      
      enqueueSnackbar('Product updated successfully!', { variant: 'success' });
      navigate('/admin/products');

    } catch (err) {
      setError(err.message || 'Failed to update product. Please check console.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) return <CircularProgress />;
  if (error && !product) return <Alert severity="error">{error}</Alert>;

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h4" fontWeight="bold" mb={4}>Edit Product</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {product && (
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}><TextField name="name" label="Product Name" fullWidth value={product.name} onChange={handleInputChange} required /></Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select name="category" value={product.category} label="Category" onChange={handleInputChange}>
                  {categories.map((cat) => (<MenuItem key={cat} value={cat}>{cat}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}><TextField name="price" label="Price" type="number" fullWidth value={product.price} onChange={handleInputChange} required /></Grid>
            <Grid item xs={12} md={6}><TextField name="stock" label="Stock" type="number" fullWidth value={product.stock} onChange={handleInputChange} required /></Grid>
            <Grid item xs={12} md={6}><TextField name="material" label="Material" fullWidth value={product.material} onChange={handleInputChange} /></Grid>
            <Grid item xs={12} md={6}><TextField name="color" label="Color" fullWidth value={product.color} onChange={handleInputChange} /></Grid>
            <Grid item xs={12}><TextField name="description" label="Description" multiline rows={6} fullWidth value={product.description} onChange={handleInputChange} /></Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Current Main Image</Typography>
              <img src={product.imageUrl || 'https://via.placeholder.com/100'} alt="main preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
              <Button variant="outlined" component="label" sx={{ display: 'block', mt: 1 }}>
                Change Main Image
                <input type="file" hidden onChange={handleMainImageChange} accept="image/*" />
              </Button>
              {mainImageFile && <Typography variant="body2" sx={{mt:1}}>New: {mainImageFile.name}</Typography>}
            </Grid>
            
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={() => navigate('/admin/products')} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
}

export default AdminEditProductPage;