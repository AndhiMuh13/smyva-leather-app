import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, TextField, Button, Avatar, CircularProgress, 
  Paper, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, 
  Divider, Grid
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import axios from 'axios';

// Ganti dengan kredensial Cloudinary Anda
const CLOUDINARY_CLOUD_NAME = "dmhe5gadp";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({
    username: '', email: '', phoneNumber: '', photoURL: '',
    gender: 'Male', dateOfBirth: ''
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userRef);
        const dbData = docSnap.exists() ? docSnap.data() : {};
        
        setUserData({
          username: dbData.username || '',
          displayName: currentUser.displayName || '',
          email: currentUser.email || '',
          phoneNumber: dbData.phoneNumber || currentUser.phoneNumber || '',
          photoURL: dbData.photoURL || currentUser.photoURL || '',
          gender: dbData.gender || 'Male',
          dateOfBirth: dbData.dateOfBirth || '',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
      setUserData(prev => ({ ...prev, photoURL: response.data.secure_url }));
    } catch (error) {
      enqueueSnackbar('Failed to upload image.', { variant: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      const dataToSave = {
        username: userData.username,
        phoneNumber: userData.phoneNumber,
        photoURL: userData.photoURL,
        gender: userData.gender,
        dateOfBirth: userData.dateOfBirth,
      };
      await setDoc(userRef, dataToSave, { merge: true });
      enqueueSnackbar('Profile updated successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to update profile.', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <CircularProgress />;

  // Kode JSX sekarang hanya berisi konten form, tanpa sidebar tambahan
  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ p: {xs: 2, md: 4}, borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <Typography variant="h5" fontWeight="bold">My Account</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>Manage your profile information to control, protect and secure your account</Typography>
      <Divider />
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <TextField fullWidth label="Username" name="username" value={userData.username || ''} onChange={handleInputChange} variant="outlined" sx={{ mb: 2 }}/>
          <TextField fullWidth label="Email" name="email" value={userData.email || ''} variant="outlined" sx={{ mb: 2 }} disabled />
          <TextField fullWidth label="Phone number" name="phoneNumber" value={userData.phoneNumber || ''} onChange={handleInputChange} variant="outlined" />
          <FormControl sx={{ mt: 2 }}>
            <FormLabel>Gender</FormLabel>
            <RadioGroup row name="gender" value={userData.gender} onChange={handleInputChange}>
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
              <FormControlLabel value="Female" control={<Radio />} label="Female" />
              <FormControlLabel value="Others" control={<Radio />} label="Others" />
            </RadioGroup>
          </FormControl>
          <TextField
            fullWidth label="Date of birth" name="dateOfBirth" type="date"
            value={userData.dateOfBirth || ''} onChange={handleInputChange}
            variant="outlined" sx={{ mt: 2 }} InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed #ccc', borderRadius: 2, p: 2 }}>
          <Avatar src={userData.photoURL} sx={{ width: 120, height: 120, mb: 2 }} />
          <Button variant="outlined" component="label">
            Select Image
            <input type="file" ref={fileInputRef} hidden onChange={handleImageChange} accept="image/jpeg, image/png" />
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            Image size: max. 1 MB<br/>Image format: JPEG, PNG
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ bgcolor: '#8D6E63', '&:hover': { bgcolor: '#6D4C41' } }}>
            {isSubmitting ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ProfilePage;