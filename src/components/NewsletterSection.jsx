// src/components/NewsletterSection.jsx
import { Box, Typography, Container, TextField, InputAdornment } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

function NewsletterSection() {
  return (
    <Box
      sx={{
        backgroundColor: '#854836', // Warna coklat gelap sesuai desain
        color: 'white',
        py: { xs: 4, md: 5 }, // Padding vertikal
        textAlign: 'center',
        borderRadius: '10px', // <--- Estetika: Radius sudut sedikit lebih besar dari 8px
        boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.4)', // <--- Estetika: Shadow lebih dalam dan menyebar
        mx: { xs: 2, md: 'auto' }, // Margin horizontal auto
        mb: -4, // Margin negatif agar overlap dengan footer
        maxWidth: '960px', // <--- Estetika: Perbesar maxWidth agar lebih sesuai lebar gambar
        position: 'relative',
        zIndex: 2,
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg"> {/* <--- Estetika: Gunakan maxWidth lg untuk judul yang lebih panjang */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: { xs: 'center', sm: 'space-between' },
          gap: { xs: 3, sm: 3 }, // <--- Estetika: Menambah gap antar judul dan input
          px: { xs: 0, md: 3 }, // <--- Estetika: Padding horizontal di dalam kontainer newsletter
        }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              color: 'white',
              flexShrink: 0,
              textAlign: { xs: 'center', sm: 'left' },
              fontSize: { xs: '1.7rem', sm: '2.2rem' }, // <--- Estetika: Penyesuaian ukuran font judul
              lineHeight: 1.2,
              letterSpacing: '0.02em', // Sedikit letter spacing
              maxWidth: { xs: 'none', sm: '400px' } // <--- Estetika: Batasi lebar judul untuk kerapihan
            }}
          >
            STAY UP TO DATE ABOUT OUR LATEST OFFERS
          </Typography>
          
          <TextField
            variant="filled"
            placeholder="Enter your email address"
            sx={{
              backgroundColor: '#fff',
              borderRadius: '8px', // <--- Estetika: Radius sudut input sedikit lebih besar
              flexGrow: 0,
              width: { xs: '100%', sm: '380px' }, // <--- Estetika: Lebar input spesifik yang lebih besar
              transition: 'all 0.3s ease-in-out', // <--- Estetika: Transisi lebih halus
              '& .MuiInputBase-root': {
                height: '52px', // <--- Estetika: Ketinggian input sedikit lebih tinggi
                padding: '0 16px', // <--- Estetika: Padding internal
                borderRadius: 'inherit',
                '&:hover': {
                  backgroundColor: '#fff',
                  boxShadow: '0px 4px 10px rgba(0,0,0,0.15)', // <--- Estetika: Shadow lebih jelas saat hover
                },
                '&.Mui-focused': {
                  backgroundColor: '#fff',
                  boxShadow: '0px 4px 10px rgba(0,0,0,0.15), 0 0 0 3px rgba(106, 77, 59, 0.6)', // <--- Estetika: Border focus custom lebih jelas
                },
              },
              '& .MuiFilledInput-underline': {
                '&:before, &:after, &:hover:not(.Mui-disabled):before': {
                  borderBottom: 'none !important',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: '#777', opacity: 0.7, mr: 0.5 }} /> {/* <--- Estetika: Menambah margin kanan ikon */}
                </InputAdornment>
              ),
              disableUnderline: true,
              style: { color: '#333' }
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}

export default NewsletterSection;