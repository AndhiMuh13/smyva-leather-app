import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
// 1. Impor fungsi yang dibutuhkan dari Firestore
import { collection, addDoc, serverTimestamp, getDocs, doc, updateDoc, increment } from 'firebase/firestore'; 
import axios from 'axios';

// Ganti dengan kredensial Cloudinary Anda
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dmhe5gadp/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

function AdminAddProductPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    material: '',
    color: '',
  });
  
  const [mainImage, setMainImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "categories"));
      setCategories(querySnapshot.docs.map(doc => doc.data().name));
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleMainImageChange = (e) => {
    if (e.target.files[0]) setMainImage(e.target.files[0]);
  };
  
  const handleOtherImagesChange = (e) => {
    if (e.target.files) setOtherImages([...e.target.files]);
  };

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    const response = await axios.post(CLOUDINARY_URL, formData);
    return response.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mainImage) {
      setError('Please upload the main product image.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const mainImageUrl = await uploadImage(mainImage);
      const otherImagesUrls = await Promise.all(
        otherImages.map(image => uploadImage(image))
      );

      const newProductData = {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
        soldCount: 0,
        rating: 0,
        reviewCount: 0,
        imageUrl: mainImageUrl,
        otherImages: otherImagesUrls,
        createdAt: serverTimestamp(),
      };

      // Simpan produk baru ke koleksi 'products'
      await addDoc(collection(db, 'products'), newProductData);
      
      // 2. TAMBAHKAN LOGIKA UPDATE STATISTIK DI SINI
      // Referensi ke dokumen statistik
      const statsRef = doc(db, 'summary', 'stats');
      // Perbarui total stok dengan menambahkannya sejumlah stok produk baru
      await updateDoc(statsRef, {
        totalStock: increment(newProductData.stock)
      });
      
      navigate('/admin/products');

    } catch (err) {
      console.error(err);
      setError('Failed to add product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h4" fontWeight="bold" mb={4}>Add New Product</Typography>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={3}>
          {/* ... Sisa JSX form Anda tidak perlu diubah ... */}
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
          <Grid item xs={12}>
            <TextField name="description" label="Description" multiline rows={6} fullWidth value={product.description} onChange={handleInputChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>Main Image*</Typography>
            <Button variant="outlined" component="label">
              Upload Main Image
              <input type="file" hidden onChange={handleMainImageChange} accept="image/*" />
            </Button>
            {mainImage && <Typography variant="body2" sx={{mt:1}}>{mainImage.name}</Typography>}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>Other Images (Optional)</Typography>
            <Button variant="outlined" component="label">
              Upload Other Images
              <input type="file" hidden multiple onChange={handleOtherImagesChange} accept="image/*" />
            </Button>
            {otherImages.length > 0 && <Typography variant="body2" sx={{mt:1}}>{otherImages.length} images selected</Typography>}
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => navigate('/admin/products')} disabled={isLoading}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : 'Add Product'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default AdminAddProductPage;