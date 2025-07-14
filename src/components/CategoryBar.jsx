import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

function CategoryBar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catQuery = query(collection(db, 'categories'), orderBy('name', 'asc'));
        const querySnapshot = await getDocs(catQuery);
        setCategories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching categories for bar: ", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Box 
      sx={{ 
        backgroundColor: '#854836', // Warna latar belakang seperti yang sudah Anda tetapkan
        py: { xs: 1.5, md: 2.5 }, // <--- Estetika & Responsif: Sesuaikan padding vertikal
        mb: { xs: 3, md: 5 }, // <--- Estetika & Responsif: Sesuaikan margin bottom
        // Hapus borderTop/borderBottom jika tidak ada di desain yang Anda inginkan
        // borderTop: '1px solid rgba(0,0,0,0.1)',
        // borderBottom: '1px solid rgba(0,0,0,0.1)',
      }}
    >
      <Container 
        maxWidth="lg" 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          gap: { xs: 1, sm: 2, md: 3 }, // <--- Responsif: Sesuaikan gap antar kategori
          // Jika ingin horizontal scroll di mobile (untuk banyak kategori):
          // overflowX: 'auto', 
          // '&::-webkit-scrollbar': { display: 'none' }, // Sembunyikan scrollbar
          // whiteSpace: 'nowrap', // Pastikan item tidak wrap
          // justifyContent: 'flex-start', // Rata kiri jika scrollable
        }}
      >
        {categories.map(cat => (
          <Typography
            key={cat.id}
            component={Link}
            to={`/products?category=${encodeURIComponent(cat.name)}`}
            sx={{
              color: 'white',
              textDecoration: 'none',
              mx: { xs: 0.5, sm: 1, md: 2 }, // <--- Responsif: Sesuaikan margin horizontal
              py: { xs: 0.5, md: 1 }, // <--- Estetika: Padding vertikal pada teks kategori
              px: { xs: 1, md: 2 }, // <--- Estetika: Padding horizontal pada teks kategori
              borderRadius: '4px', // <--- Estetika: Sedikit border radius
              fontWeight: 'bold', // <--- Estetika: Membuat teks lebih tebal
              fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' }, // <--- Responsif: Ukuran font
              transition: 'background-color 0.2s ease, transform 0.2s ease', // <--- Estetika: Transisi hover
              '&:hover': {
                textDecoration: 'none', // Menghilangkan underline default Material-UI hover pada Link
                backgroundColor: 'rgba(255,255,255,0.15)', // <--- Estetika: Latar belakang hover
                transform: 'translateY(-2px)', // <--- Estetika: Efek angkat saat hover
              },
              '&:active': {
                transform: 'translateY(0)', // Efek tekan
              },
            }}
          >
            {cat.name}
          </Typography>
        ))}
      </Container>
    </Box>
  );
}

export default CategoryBar;