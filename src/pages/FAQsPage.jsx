// src/pages/FAQsPage.jsx
import React from 'react';
import { 
  Box, Container, Typography, 
  Accordion, AccordionSummary, AccordionDetails, 
  useTheme, useMediaQuery // Import for responsive adjustments
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function FAQsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // True for screens smaller than 600px

  const faqs = [
    {
      question: "Bagaimana cara melacak pesanan saya?",
      answer: "Anda dapat melacak pesanan Anda melalui halaman 'Pesanan Saya' setelah login, atau menggunakan link pelacakan yang dikirimkan ke email Anda."
    },
    {
      question: "Metode pembayaran apa saja yang diterima?",
      answer: "Kami menerima pembayaran melalui transfer bank, kartu kredit, dan dompet digital tertentu. Detail lebih lanjut akan ditampilkan saat checkout."
    },
    {
      question: "Apakah saya bisa mengembalikan produk jika tidak puas?",
      answer: "Ya, kami memiliki kebijakan pengembalian dalam waktu 7 hari setelah penerimaan barang, selama produk dalam kondisi asli dan belum digunakan. Silakan lihat halaman 'Pengiriman & Pengembalian' untuk detail lebih lanjut."
    },
    {
      question: "Berapa lama waktu pengiriman?",
      answer: "Waktu pengiriman standar adalah 3-7 hari kerja tergantung lokasi Anda. Pengiriman ekspres mungkin tersedia dengan biaya tambahan."
    },
    {
      question: "Apakah SMYVA LEATHER menggunakan kulit asli?",
      answer: "Ya, semua produk kulit kami dibuat dari kulit asli berkualitas tinggi yang diproses oleh pengrajin berpengalaman."
    },
    {
      question: "Bagaimana cara menghubungi layanan pelanggan?",
      answer: "Anda dapat menghubungi tim layanan pelanggan kami melalui halaman 'Kontak' di situs web kami, atau melalui email langsung ke support@smyvaleather.com."
    },
    {
      question: "Apakah saya bisa mengubah atau membatalkan pesanan?",
      answer: "Perubahan atau pembatalan pesanan hanya dapat dilakukan jika pesanan Anda belum diproses atau dikirim. Mohon segera hubungi kami setelah melakukan pemesanan jika ada perubahan."
    }
  ];

  return (
    <Container maxWidth="md" sx={{ my: { xs: 4, md: 8 } }}> {/* Increased vertical margin */}
      <Typography 
        variant="h4" 
        component="h1" // Semantic HTML
        fontWeight="bold" 
        gutterBottom 
        sx={{ 
          textAlign: 'center', 
          mb: { xs: 3, md: 6 }, // Increased bottom margin
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, // Responsive font size
          color: theme.palette.text.primary // Use theme color
        }}
      >
        Frequently Asked Questions (FAQs)
      </Typography>
      <Box sx={{ mt: { xs: 2, md: 3 } }}> {/* Adjusted top margin */}
        {faqs.map((faq, index) => (
          <Accordion 
            key={index} 
            elevation={2} // <--- Estetika: Add elevation for depth
            sx={{ 
              mb: { xs: 1.5, md: 2 }, // Adjusted bottom margin
              borderRadius: '8px', // More prominent border radius
              overflow: 'hidden', // Ensure content respects border radius
              border: '1px solid rgba(0,0,0,0.05)', // Subtle border
              '&:before': { // Remove default accordion line
                display: 'none',
              }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.primary.main }} />} // Icon color from theme
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              sx={{ 
                bgcolor: theme.palette.background.default, // Light background for summary
                '&:hover': {
                  bgcolor: theme.palette.action.hover, // Hover effect
                },
                py: { xs: 0.5, md: 1 } // Adjusted vertical padding
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                sx={{ 
                  fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.15rem' }, // Responsive font size
                  color: theme.palette.text.secondary // Use theme color for question
                }}
              >
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: { xs: 2, md: 3 }, py: { xs: 1.5, md: 2 } }}> {/* Adjusted padding */}
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' }, // Responsive font size
                  lineHeight: 1.7, // Increased line height for readability
                  color: theme.palette.text.secondary // Use theme color for answer
                }}
              >
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
}

export default FAQsPage;