import React, { useState } from 'react';
import { Box, Paper, Grid, Typography, TextField, RadioGroup, FormControlLabel, Radio, Button, FormControl, FormLabel, CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import axios from 'axios';

// Impor Ikon
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const BACKEND_URL = "http://localhost:3001";

// Komponen Ikon TikTok
const TikTokIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.01-1.58-.01-3.16 0-4.75l-.04 1.28c-1.1.52-2.31.8-3.48.94v4.5c.95-.08 1.91-.26 2.82-.53v4.06c-1.12.33-2.28.52-3.46.54-1.92.03-3.84-.42-5.59-1.57-1.75-1.15-2.85-2.9-3.3-4.81H3.49v-4.04c1.51 0 3.02-.01 4.53 0 .04-1.28.29-2.58.78-3.79a7.13 7.13 0 011.96-3.03c1.01-.82 2.2-1.39 3.48-1.66l.02-2.73z" />
  </svg>
);

function ContactPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    subject: 'Product Question', message: ''
  });

  const handleChange = (e) => {
    setFormData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/send-contact-email`, formData);
      enqueueSnackbar(response.data.message || 'Message sent successfully!', { variant: 'success' });
      setFormData({ firstName: '', lastName: '', email: '', phone: '', subject: 'Product Question', message: '' });
    } catch (error) {
      enqueueSnackbar(error.response?.data?.error || 'Failed to send message.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5', p: { xs: 2, md: 4 } }}>
      <Paper elevation={3} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width: '100%', maxWidth: '1200px', borderRadius: '24px', overflow: 'hidden' }}>
        
        {/* Kolom Kiri (Informasi Kontak) */}
        <Box sx={{ width: { xs: '100%', md: '40%' }, bgcolor: '#854836', color: 'white', p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Contact Information</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}><EmailIcon sx={{ mr: 2 }} /><Typography>smyvaleather@gmail.com</Typography></Box>
            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}><PhoneIcon sx={{ mr: 2 }} /><Typography>+62 898-6833-448</Typography></Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', my: 2 }}>
              <LocationOnIcon sx={{ mr: 2, mt: 0.5 }} />
              <Typography>Gondekan, RT03, Trirenggo, Bantul,<br />Kabupaten Bantul, Daerah Istimewa Yogyakarta</Typography>
            </Box>
            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <InstagramIcon />
              <TikTokIcon />
              <WhatsAppIcon />
            </Box>
          </Box>
          <Box>
            <Typography variant="h5" fontWeight="bold">SMYVA LEATHER</Typography>
            <Typography variant="body2">We have bags to suit your style and that you're proud of. From women to men.</Typography>
          </Box>
        </Box>
        
        {/* Kolom Kanan (Form Kontak) */}
        <Box sx={{ width: { xs: '100%', md: '60%' }, p: { xs: 3, md: 5 }, bgcolor: 'white' }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth variant="standard" label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth variant="standard" label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth variant="standard" label="Email" name="email" value={formData.email} onChange={handleChange} required type="email" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth variant="standard" label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend" sx={{ typography: 'subtitle1', fontWeight: 'medium', color: 'text.primary', '&.Mui-focused': { color: 'text.primary' }}}>Select Subject</FormLabel>
                  <RadioGroup row name="subject" value={formData.subject} onChange={handleChange}>
                    <FormControlLabel value="Product Question" control={<Radio />} label="Product Question" />
                    <FormControlLabel value="Order/Delivery Status" control={<Radio />} label="Order/Delivery Status" />
                    <FormControlLabel value="Payment and Confirmation" control={<Radio />} label="Payment and Confirmation" />
                    <FormControlLabel value="Exchange/Return of Goods" control={<Radio />} label="Exchange/Return of Goods" />
                    <FormControlLabel value="Cooperation / Reseller Request" control={<Radio />} label="Cooperation / Reseller Request" />
                    <FormControlLabel value="Others" control={<Radio />} label="Others" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth variant="standard" label="Message" name="message" placeholder="Write your message.." value={formData.message} onChange={handleChange} required multiline rows={3} />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: '#854836', color: 'white', px: 4, py: 1.5, borderRadius: '8px', textTransform: 'none', fontWeight: 'bold', '&:hover': { bgcolor: '#6D4C41' } }}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Message'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default ContactPage;