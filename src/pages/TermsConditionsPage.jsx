// src/pages/TermsConditionsPage.jsx
import React from 'react';
import { 
  Box, Container, Typography, 
  List, ListItem, ListItemText, 
  Divider, 
  useTheme, useMediaQuery 
} from '@mui/material';

function TermsConditionsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="md" sx={{ my: { xs: 4, md: 8 } }}>
      <Typography 
        variant="h4" 
        component="h1" 
        fontWeight="bold" 
        gutterBottom 
        sx={{ 
          textAlign: 'center', 
          mb: { xs: 3, md: 6 }, 
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          color: theme.palette.text.primary 
        }}
      >
        Terms & Conditions
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          lineHeight: 1.7, 
          mb: { xs: 3, md: 4 }, // Adjusted bottom margin
          fontSize: { xs: '0.9rem', sm: '1rem' },
          color: theme.palette.text.secondary
        }}
      >
        Welcome to the SMYVA LEATHER website. By accessing or using this website, you agree to be bound by the following Terms and Conditions. Please read carefully before making a transaction.
      </Typography>

      {[
        { 
          title: "Penggunaan Situs Web", 
          content: "Anda setuju untuk menggunakan situs web ini hanya untuk tujuan yang sah dan sesuai dengan semua hukum dan peraturan yang berlaku. Anda tidak boleh menggunakan situs web untuk tujuan penipuan atau untuk menyebabkan gangguan pada layanan kami." 
        },
        { 
          title: "Informasi Produk", 
          content: "Kami berusaha untuk memastikan bahwa semua deskripsi produk, harga, dan informasi lainnya di situs web akurat. Namun, kesalahan dapat terjadi. Kami berhak untuk memperbaiki kesalahan apa pun dan mengubah informasi kapan saja tanpa pemberitahuan sebelumnya." 
        },
        { 
          title: "Pembatasan Tanggung Jawab", 
          content: "SMYVA LEATHER tidak bertanggung jawab atas kerugian atau kerusakan tidak langsung, insidental, khusus, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan untuk menggunakan situs web atau produk kami." 
        },
        { 
          title: "Perubahan Syarat & Ketentuan", 
          content: "Kami berhak untuk memperbarui atau mengubah Syarat dan Ketentuan ini kapan saja. Perubahan akan berlaku segera setelah diposting di situs web. Anda disarankan untuk meninjau halaman ini secara berkala." 
        },
      ].map((section, index) => (
        <React.Fragment key={index}>
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            mt={{ xs: 4, md: 5 }} 
            mb={{ xs: 1.5, md: 2.5 }}
            sx={{ color: theme.palette.primary.main }}
          >
            {section.title}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              lineHeight: 1.7, 
              fontSize: { xs: '0.9rem', sm: '1rem' },
              color: theme.palette.text.secondary
            }}
          >
            {section.content}
          </Typography>
          {index < 3 && <Divider sx={{ my: { xs: 3, md: 5 } }} />} {/* Divider between sections */}
        </React.Fragment>
      ))}
    </Container>
  );
}

export default TermsConditionsPage;