import React, { useState } from 'react';
import { Box, Typography, Grid, Container, Modal } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Definisikan varian animasi untuk kartu dan modal
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

// Data material dengan link gambarnya
const materials = [
    {
        name: ' Leather Vinyl Labels',
        imgUrl: 'https://i.pinimg.com/736x/5f/33/6d/5f336dadc0827247860f1a7291bf852f.jpg'
    },
    {
        name: 'Leather Fabric Labels',
        imgUrl: 'https://i.pinimg.com/736x/b3/dd/90/b3dd902dbee581c81025c41325abc3af.jpg'
    },
    {
        name: 'Leather Velvet Labels',
        imgUrl: 'https://i.pinimg.com/1200x/e6/66/7f/e6667f562c80c870b2e25ddc9ead92d9.jpg'
    }
];

function MaterialSection() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <Box 
      sx={{ 
        my: { xs: 6, md: 8 }, // <--- Responsif: Margin vertikal
        textAlign: 'center', 
        bgcolor: '#854836', 
        color: 'white', 
        py: { xs: 6, md: 8 }, // <--- Responsif: Padding vertikal
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="h4" 
          fontWeight="bold" 
          gutterBottom 
          sx={{ 
            mb: { xs: 3, md: 5 }, // <--- Estetika & Responsif: Margin bottom judul
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } // <--- Responsif: Ukuran font judul
          }}
        >
          Material
        </Typography>
        
        <Grid container 
          spacing={{ xs: 2, md: 4 }} // <--- Responsif: Spacing antar item
          justifyContent="center" 
          sx={{ mt: 2 }}
        >
          {materials.map((material, index) => (
            // PERBAIKAN GRID V2: Hapus prop 'item'
            <Grid key={material.name} xs={12} sm={6} md={4}> {/* <--- PERBAIKAN INI */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                style={{ height: '100%' }} // Pastikan div mengisi tinggi penuh Grid item
              >
                <Box 
                  onClick={() => setSelectedImage(material.imgUrl)}
                  component="img" 
                  src={material.imgUrl} 
                  alt={material.name}
                  sx={{ 
                    width: '100%', 
                    height: { xs: 200, sm: 220, md: 250 }, // <--- Responsif: Tinggi gambar adaptif
                    objectFit: 'cover', 
                    borderRadius: 2, 
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // <--- Estetika: Transisi hover
                    '&:hover': { 
                      transform: 'scale(1.03)', // <--- Estetika: Efek zoom ringan
                      boxShadow: '0px 8px 20px rgba(0,0,0,0.2)' // <--- Estetika: Shadow saat hover
                    }
                  }} 
                />
                <Typography variant="h6" mt={1} sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' } }}> {/* <--- Responsif: Ukuran font nama material */}
                  {material.name}
                </Typography>
              </motion.div>
            </Grid>
          ))}
        </Grid>
        
        {/* Teks Deskripsi di bawah grid */}
        <Typography 
          sx={{ 
            mt: { xs: 4, md: 6 }, // <--- Responsif: Margin top
            maxWidth: { xs: '90%', sm: '70%', md: '700px' }, // <--- Responsif: Max lebar teks
            mx: 'auto', // Pusat teks
            opacity: 0.8,
            fontSize: { xs: '0.9rem', sm: '1rem' }, // <--- Responsif: Ukuran font teks
            lineHeight: 1.6,
          }}
        >
          We work with the best materials to create unique works of fashion, using high-quality leathers and fabrics that stand the test of time.
        </Typography>
      </Container>
      
      {/* Komponen Modal untuk menampilkan gambar popup */}
      <AnimatePresence>
        {selectedImage && (
          <Modal
            open={Boolean(selectedImage)}
            onClose={() => setSelectedImage(null)}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={() => setSelectedImage(null)} // Tutup juga saat gambar diklik
            >
              <Box
                component="img"
                src={selectedImage}
                sx={{
                  maxHeight: '90vh',
                  maxWidth: '90vw',
                  objectFit: 'contain', // Menyesuaikan gambar agar tidak terpotong
                  outline: 'none',
                  borderRadius: 2,
                  boxShadow: '0px 10px 30px rgba(0,0,0,0.5)' // <--- Estetika: Shadow pada modal
                }}
              />
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default MaterialSection;