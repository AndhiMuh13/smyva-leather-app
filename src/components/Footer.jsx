// src/components/Footer.jsx
import React from 'react';
import { Box, Typography, Container, Grid, Link, IconButton } from '@mui/material'; // Tambah IconButton untuk ikon sosmed jika belum ada
import { Link as RouterLink } from 'react-router-dom';

// Impor ikon yang dibutuhkan (jika akan ditampilkan)
// import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
// import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
// import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
// Untuk ikon sosial media (sesuai desain baru, ini diperlukan)
// import InstagramIcon from '@mui/icons-material/Instagram';
// import WhatsAppIcon from '@mui/icons-material/WhatsApp';
// import TikTokIcon from '@mui/icons-material/SportsEsports'; // Contoh, mungkin ada ikon TikTok yang lebih spesifik

function Footer() {
    return (
        <Box sx={{
            backgroundColor: '#F5F5F5', // <--- WARNA DIUBAH: Abu-abu terang (mendekati putih)
            color: '#333', // <--- WARNA DIUBAH: Teks gelap secara umum
            fontFamily: 'Arial, sans-serif',
        }}>
            {/* Main Footer Content */}
            <Container sx={{ py: 6 }}>
                <Grid container spacing={4} justifyContent="space-between">
                    {/* Kolom 1: Company Info */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Box sx={{ mb: 2 }}>
                            {/* Jika Anda punya logo gambar, gunakan <img src="..." /> di sini */}
                            {/* Untuk saat ini, asumsikan teks SMYVA LEATHER adalah elemen Typography */}
                            <Typography variant="h5" fontWeight="bold" sx={{ color: '#333', mb: 1 }}>SMYVA LEATHER</Typography> {/* WARNA DIUBAH */}
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.7)', lineHeight: 1.6 }}> {/* WARNA DIUBAH */}
                            Kami memiliki Tas yang sesuai dengan gaya Anda dan yang Anda banggakan. Dari wanita hingga pria.
                        </Typography>
                        {/* Ikon sosial media yang terlihat di desain baru */}
                       
                    </Grid>

                    {/* Kolom 2: Support Links (tetap tidak berubah dari kode Anda sebelumnya) */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, position: 'relative', pb: 1, '&::after': { content: '""', position: 'absolute', left: 0, bottom: 0, width: '50px', height: '3px', backgroundColor: '#333' } }}> {/* WARNA DIUBAH */}
                            Support
                        </Typography>
                        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                            <Box component="li" sx={{ mb: 1 }}><Link component={RouterLink} to="/faqs" color="inherit" underline="none" sx={{ '&:hover': { color: '#555' } }}>FAQs</Link></Box> {/* WARNA DIUBAH */}
                            <Box component="li" sx={{ mb: 1 }}><Link component={RouterLink} to="/shipping-returns" color="inherit" underline="none" sx={{ '&:hover': { color: '#555' } }}>Shipping & Returns</Link></Box> {/* WARNA DIUBAH */}
                            <Box component="li" sx={{ mb: 1 }}><Link component={RouterLink} to="/terms-conditions" color="inherit" underline="none" sx={{ '&:hover': { color: '#555' } }}>Terms & Conditions</Link></Box> {/* WARNA DIUBAH */}
                            <Box component="li" sx={{ mb: 1 }}><Link component={RouterLink} to="/privacy-policy" color="inherit" underline="none" sx={{ '&:hover': { color: '#555' } }}>Privacy Policy</Link></Box> {/* WARNA DIUBAH */}
                            <Box component="li" sx={{ mb: 1 }}><Link component={RouterLink} to="/company-profile" color="inherit" underline="none" sx={{ '&:hover': { color: '#555' } }}>Company Profile</Link></Box> {/* WARNA DIUBAH */}
                        </Box>
                    </Grid>

                    {/* Kolom 3: Contact Info */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, position: 'relative', pb: 1, '&::after': { content: '""', position: 'absolute', left: 0, bottom: 0, width: '50px', height: '3px', backgroundColor: '#333' } }}> {/* WARNA DIUBAH */}
                            Contact
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            {/* Tambahkan ikon LocationOnOutlinedIcon jika Anda ingin menampilkannya seperti di desain baru */}
                            {/* <LocationOnOutlinedIcon sx={{ color: '#777', fontSize: 'small' }} /> */}
                            <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.7)' }}> {/* WARNA DIUBAH */}
                                Gondekan, RT03, Trirenggo, Bantul,
                                Kabupaten Bantul, Daerah Istimewa Yogyakarta
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            {/* Tambahkan ikon MailOutlineOutlinedIcon jika Anda ingin menampilkannya seperti di desain baru */}
                            {/* <MailOutlineOutlinedIcon sx={{ color: '#777', fontSize: 'small' }} /> */}
                            <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.7)' }}> {/* WARNA DIUBAH */}
                                smyvaleather@gmail.com
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            {/* Tambahkan ikon LocalPhoneOutlinedIcon jika Anda ingin menampilkannya seperti di desain baru */}
                            {/* <LocalPhoneOutlinedIcon sx={{ color: '#777', fontSize: 'small' }} /> */}
                            <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.7)' }}> {/* WARNA DIUBAH */}
                                +62 898-6833-448
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                {/* Garis pemisah dan Copyright */}
                <Box sx={{
                    borderTop: '1px solid rgba(0,0,0,0.1)', // <--- WARNA DIUBAH
                    mt: 4,
                    pt: 2,
                    textAlign: 'center',
                }}>
                    <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.6)' }}> {/* WARNA DIUBAH */}
                        SMYVA.com &copy; 2000-2023, All Rights Reserved
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default Footer;