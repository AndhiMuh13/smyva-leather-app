import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Button, IconButton, useTheme, useMediaQuery } from '@mui/material'; // Tambah useTheme, useMediaQuery
import { Link } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const carouselItems = [
  {
    title: 'Best Leather Bags',
    subtitle: 'Online Shop Products in The World',
    description: 'We have bags to suit your style and that you\'re proud of. From women to men.',
    image: 'https://i.pinimg.com/1200x/e8/56/93/e856937567b72c967f31ea42b0a01825.jpg'
  },
  {
    title: 'Premium Collection',
    subtitle: 'Handcrafted for Perfection',
    description: 'Each product is handmade by expert craftsmen, ensuring exceptional quality and durability.',
    image: 'https://i.pinimg.com/736x/fe/78/7e/fe787e8457ecfd43ad1a69ef9b7282a8.jpg'
  }
];

function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const timeoutRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // True jika layar mobile (<600px)

  useEffect(() => {
    const resetTimeout = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setActiveSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => resetTimeout();
  }, [activeSlide]);

  const nextSlide = () => setActiveSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setActiveSlide((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1));

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        position: 'relative', 
        height: { xs: '60vh', sm: '70vh', md: '50vh' }, // <--- Responsif: Tinggi yang adaptif
        minHeight: { xs: '450px', md: '350px' }, // <--- Responsif: Min tinggi adaptif
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'white', 
        borderRadius: 4, 
        overflow: 'hidden',
        boxShadow: '0px 10px 30px -5px rgba(0,0,0,0.1)',
      }}
    >
      {carouselItems.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex', 
            width: '100%', 
            height: '100%', 
            alignItems: 'center',
            justifyContent: 'space-around', 
            p: { xs: 2, sm: 3, md: 5 }, // <--- Responsif: Padding yang adaptif
            flexDirection: { xs: 'column-reverse', md: 'row' },
            textAlign: { xs: 'center', md: 'left' },
            transition: 'opacity 0.7s ease-in-out, transform 0.7s ease-in-out',
            opacity: index === activeSlide ? 1 : 0,
            transform: index === activeSlide ? 'translateX(0)' : (index < activeSlide ? 'translateX(-100%)' : 'translateX(100%)'),
            position: 'absolute', top: 0, left: 0,
          }}
        >
          {/* Konten Teks */}
          <Box sx={{ 
            maxWidth: { xs: '100%', md: '50%' }, 
            p: { xs: 1, md: 2 }, 
            color: 'black',
            mt: { xs: 2, md: 0 } // Margin top untuk konten teks di mobile
          }}>
            <Typography 
              variant="h2" 
              component="h1" 
              fontWeight="bold"
              sx={{ 
                fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' }, // <--- Responsif: Ukuran font judul
                lineHeight: { xs: 1.2, md: 1.1 }
              }}
            >
              {item.title}
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } // <--- Responsif: Ukuran font subtitle
              }}
            >
              {item.subtitle}
            </Typography>
            <Typography 
              sx={{ 
                my: { xs: 1, md: 2 }, 
                fontSize: { xs: '0.875rem', sm: '1rem' } // <--- Responsif: Ukuran font deskripsi
              }}
            >
              {item.description}
            </Typography>
            <Button variant="contained" size="large" component={Link} to="/products" 
              sx={{ 
                bgcolor: 'black', 
                color: 'white', 
                '&:hover': { bgcolor: '#333' },
                mt: { xs: 1, md: 0 } // Margin top untuk tombol di mobile
              }}
            >
              Shop Now
            </Button>
          </Box>
          {/* Gambar Produk */}
          <Box 
            component="img" 
            src={item.image} 
            sx={{ 
              maxHeight: { xs: '60%', md: '80%' }, // <--- Responsif: Max tinggi gambar
              maxWidth: { xs: '60%', sm: '50%', md: '40%' }, // <--- Responsif: Max lebar gambar
              objectFit: 'contain',
              // Tambahan untuk mobile agar gambar terlihat jelas
              mt: { xs: 0, md: 0 },
              minHeight: { xs: '150px', sm: '200px' } // Minimum height for image on smaller screens
            }} 
          />
        </Box>
      ))}
      {/* Tombol Navigasi Carousel */}
      <IconButton 
        onClick={prevSlide} 
        sx={{ 
          position: 'absolute', left: { xs: 8, md: 16 }, top: '50%', transform: 'translateY(-50%)', zIndex: 10, 
          bgcolor: 'rgba(255, 255, 255, 0.7)', 
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
          display: { xs: 'none', sm: 'flex' } // <--- Responsif: Sembunyikan tombol di xs (opsional, tergantung preferensi)
        }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>
      <IconButton 
        onClick={nextSlide} 
        sx={{ 
          position: 'absolute', right: { xs: 8, md: 16 }, top: '50%', transform: 'translateY(-50%)', zIndex: 10, 
          bgcolor: 'rgba(255, 255, 255, 0.7)', 
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
          display: { xs: 'none', sm: 'flex' } // <--- Responsif: Sembunyikan tombol di xs (opsional)
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Paper>
  );
}

export default HeroSection;