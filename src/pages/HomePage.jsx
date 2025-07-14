// src/pages/HomePage.jsx
import { Box, Container } from '@mui/material';

// Impor semua komponen baru
import HeroSection from '../components/HeroSection';
import CategoryBar from '../components/CategoryBar';
import FeaturedProducts from '../components/FeaturedProducts';
import MaterialSection from '../components/MaterialSection';
import NewsletterSection from '../components/NewsletterSection';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <Box>
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <HeroSection />
      </Container>
      
      <CategoryBar />
      
      <Container sx={{ py: 4 }}>
        <FeaturedProducts />
      </Container>

      <MaterialSection />
      
      <NewsletterSection />
      
      <Footer />
    </Box>
  );
}

export default HomePage;