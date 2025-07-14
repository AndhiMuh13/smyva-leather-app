// src/pages/CompanyProfile.jsx
import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardMedia, CardContent } from '@mui/material'; // Menggunakan Material-UI untuk konsistensi
import { styled } from '@mui/system'; // Untuk membuat komponen styled

// Styled component untuk bagian tim (sesuai desain Anda)
const TeamMemberCard = styled(Card)({
  maxWidth: 200,
  margin: '0 auto',
  textAlign: 'center',
  boxShadow: 'none', // Menghilangkan shadow default Material-UI Card
  borderRadius: '8px',
  backgroundColor: '#fff',
  padding: '10px',
});

const TeamMemberImage = styled(CardMedia)({
  width: 100,
  height: 100,
  borderRadius: '50%',
  margin: '0 auto 10px auto',
  objectFit: 'cover',
  border: '2px solid #ccc', // Sedikit border seperti di desain
});

function CompanyProfile() {
  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 } }}>
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom sx={{ borderBottom: '2px solid #000', pb: 1, mb: 3 }}>
          SMYVA LEATHER
        </Typography>

        {/* Visi */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ borderBottom: '1px solid #ccc', pb: 0.5, mb: 2 }}>
            Visi
          </Typography>
          <Typography variant="body1">
            Menjadi merek kulit terkemuka yang diakui secara global karena kualitas pengerjaan, desain inovatif, dan komitmen terhadap keberlanjutan.
          </Typography>
        </Box>

        {/* Misi */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ borderBottom: '1px solid #ccc', pb: 0.5, mb: 2 }}>
            Misi
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
            <li>Menyediakan produk kulit premium yang tahan lama dan stylish.</li>
            <li>Mempertahankan standar pengerjaan tangan yang tinggi dengan pengrajin berpengalaman.</li>
            <li>Mengembangkan desain yang unik dan relevan dengan tren pasar.</li>
            <li>Memprioritaskan praktik bisnis yang etis dan bertanggung jawab terhadap lingkungan.</li>
            <li>Membangun hubungan jangka panjang dengan pelanggan melalui layanan yang luar biasa.</li>
          </Typography>
        </Box>

        {/* Deskripsi Perusahaan */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ borderBottom: '1px solid #ccc', pb: 0.5, mb: 2 }}>
            Deskripsi Perusahaan
          </Typography>
          <Typography variant="body1">
            SMYVA LEATHER adalah perusahaan yang berdedikasi untuk menciptakan produk-produk kulit berkualitas tinggi. Dengan fokus pada keahlian pengrajin dan pemilihan material terbaik, kami menghadirkan berbagai macam barang kulit mulai dari tas, dompet, hingga aksesori. Setiap produk SMYVA LEATHER adalah hasil dari proses pengerjaan yang cermat, menggabungkan tradisi kerajinan tangan dengan estetika modern. Kami berkomitmen untuk tidak hanya menawarkan produk yang indah tetapi juga tahan lama, mencerminkan nilai-nilai keunggulan dan integritas.
          </Typography>
        </Box>

        {/* SMYVA Produk */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ borderBottom: '1px solid #ccc', pb: 0.5, mb: 2 }}>
            SMYVA Produk
          </Typography>
          <Typography variant="body1">
            Produk-produk SMYVA LEATHER meliputi:
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              <li>Tas (selempang, tangan, ransel)</li>
              <li>Dompet (pria dan wanita)</li>
              <li>Sabuk</li>
              <li>Aksesori kulit lainnya</li>
            </ul>
          </Typography>
        </Box>
      </Paper>

      {/* Meet Our Team Section */}
      <Box sx={{ backgroundColor: '#8B5733', color: '#fff', py: 6, textAlign: 'center', borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="bold" mb={1}>Meet Our Team</Typography>
        <Typography variant="body1" mb={4}>A team of smart & passionate creatives</Typography>

        <Grid container spacing={3} justifyContent="center">
          {[
            { name: 'DEVA NADA NABILA', role: 'CEO & Founder', image: 'https://via.placeholder.com/100' }, // Ganti dengan path gambar asli
            { name: 'DEVA NADA NABILA', role: 'Chief Designer', image: 'https://via.placeholder.com/100' },
            { name: 'DEVA NADA NABILA', role: 'Marketing Manager', image: 'https://via.placeholder.com/100' },
            { name: 'DEVA NADA NABILA', role: 'Production Head', image: 'https://via.placeholder.com/100' },
            { name: 'DEVA NADA NABILA', role: 'Sales Manager', image: 'https://via.placeholder.com/100' },
            { name: 'DEVA NADA NABILA', role: 'Customer Service', image: 'https://via.placeholder.com/100' },
          ].map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <TeamMemberCard>
                <TeamMemberImage image={member.image} title={member.name} />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary">{member.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{member.role}</Typography>
                </CardContent>
              </TeamMemberCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default CompanyProfile;