import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box, Typography, Container, Grid, Paper, TextField, InputAdornment,
  Checkbox, FormControlLabel, FormGroup, Slider, CircularProgress
} from '@mui/material';
import ProductCard from '../components/ProductCard';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import SearchIcon from '@mui/icons-material/Search';

function ProductsPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [maxPrice, setMaxPrice] = useState(1000000);

  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productsPromise = getDocs(collection(db, 'products'));
        const categoriesPromise = getDocs(collection(db, 'categories'));

        const [productsSnapshot, categoriesSnapshot] = await Promise.all([
          productsPromise,
          categoriesPromise,
        ]);

        const productsData = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const categoriesData = categoriesSnapshot.docs.map((doc) => doc.data().name);
        
        if (productsData.length > 0) {
          const max = Math.max(...productsData.map(p => p.price));
          setMaxPrice(max);
          setPriceRange([0, max]);
        }
        
        setAllProducts(productsData);
        setAllCategories(categoriesData);
        
        const searchParams = new URLSearchParams(location.search);
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl) {
          setSelectedCategories([categoryFromUrl]);
        }

      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.search]);

  const handleCategoryChange = (event) => {
    const { name, checked } = event.target;
    setSelectedCategories((prev) =>
      checked
        ? [...prev, name]
        : prev.filter((category) => category !== name)
    );
  };
  
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(product => selectedCategories.length === 0 || selectedCategories.includes(product.category))
      .filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);
  }, [allProducts, searchTerm, selectedCategories, priceRange]);

  return (
    <Container sx={{ my: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Our Product</Typography>
      
      {/* ## BAGIAN UTAMA YANG DIPERBAIKI DENGAN FLEXBOX ## */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        
        {/* Kolom Kiri: Filter Sidebar */}
        <Box sx={{ width: { xs: '100%', md: '25%' } }}>
          <Paper sx={{ p: 2, borderRadius: 3, position: 'sticky', top: '80px' }}>
            <Typography fontWeight="bold" gutterBottom>Categories</Typography>
            <FormGroup>
              {allCategories.map(category => (
                <FormControlLabel
                  key={category}
                  control={<Checkbox name={category} checked={selectedCategories.includes(category)} onChange={handleCategoryChange} />}
                  label={category}
                />
              ))}
            </FormGroup>
            <Typography fontWeight="bold" gutterBottom sx={{ mt: 3 }}>Price</Typography>
            <Slider
              value={priceRange}
              onChange={(e, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={maxPrice}
              step={10000}
              sx={{ mt: 1 }}
            />
             <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
               <Typography variant="body2">Rp {priceRange[0].toLocaleString()}</Typography>
               <Typography variant="body2">Rp {priceRange[1].toLocaleString()}</Typography>
             </Box>
          </Paper>
        </Box>
        
        {/* Kolom Kanan: Daftar Produk */}
        <Box sx={{ width: { xs: '100%', md: '75%' } }}>
          <TextField
            variant="outlined"
            placeholder="Search products..."
            fullWidth
            sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: '#f5f5f5' } }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
          ) : (
            <Grid container spacing={3}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Grid item key={product.id} xs={12} sm={6} md={4}>
                    <ProductCard product={product} />
                  </Grid>
                ))
              ) : (
                <Typography sx={{ p: 3 }}>No products found matching your criteria.</Typography>
              )}
            </Grid>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default ProductsPage;