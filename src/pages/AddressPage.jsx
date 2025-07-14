import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

import {
  Box, Typography, CircularProgress, Card, CardContent, Button,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Grid
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';

const center = { lat: -7.7956, lng: 110.3695 };

function MapClickHandler({ setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });
  return null;
}

const AddressPage = () => {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '', recipientName: '', phoneNumber: '', fullAddress: '', lat: null, lng: null
  });
  const { enqueueSnackbar } = useSnackbar();

  const fetchAddresses = async (currentUser) => {
    if (!currentUser) return;
    const addressRef = collection(db, 'users', currentUser.uid, 'addresses');
    const querySnapshot = await getDocs(addressRef);
    const userAddresses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAddresses(userAddresses);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchAddresses(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenDialog = () => {
    setNewAddress({ label: '', recipientName: '', phoneNumber: '', fullAddress: '', lat: center.lat, lng: center.lng });
    setOpenDialog(true);
  };
  const handleCloseDialog = () => setOpenDialog(false);

  // FUNGSI YANG DIPERBAIKI
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSaveAddress = async () => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'users', user.uid, 'addresses'), newAddress);
      enqueueSnackbar('Address added successfully!', { variant: 'success' });
      await fetchAddresses(user);
      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar('Failed to add address.', { variant: 'error' });
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!user || !addressId) return;
    try {
        await deleteDoc(doc(db, 'users', user.uid, 'addresses', addressId));
        enqueueSnackbar('Address deleted successfully!', { variant: 'success' });
        await fetchAddresses(user);
    } catch (error) {
        enqueueSnackbar('Failed to delete address.', { variant: 'error' });
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">My Addresses</Typography>
          <Typography color="text.secondary">Manage your shipping addresses.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleOpenDialog}>
          Add New Address
        </Button>
      </Box>
      <Box sx={{ height: '300px', width: '100%', mb: 3, borderRadius: 2, overflow: 'hidden' }}>
        <MapContainer center={[center.lat, center.lng]} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {addresses.map(addr => (
            addr.lat && <Marker key={addr.id} position={[addr.lat, addr.lng]}><Popup>{addr.label}</Popup></Marker>
          ))}
        </MapContainer>
      </Box>

      <Grid container spacing={2}>
        {addresses.length === 0 ? (
          <Grid item xs={12}><Typography>You have not added any addresses yet.</Typography></Grid>
        ) : (
          addresses.map(address => (
            <Grid item xs={12} md={6} key={address.id}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography fontWeight="bold">{address.label}</Typography>
                      <Typography>{address.recipientName}</Typography>
                      <Typography variant="body2" color="text.secondary">{address.phoneNumber}</Typography>
                      <Typography variant="body2" color="text.secondary">{address.fullAddress}</Typography>
                    </Box>
                    <IconButton onClick={() => handleDeleteAddress(address.id)} color="error"><DeleteIcon /></IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>Add a New Address</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              {/* TEXTFIELD YANG DIPERBAIKI: Tambahkan prop 'name' */}
              <TextField autoFocus margin="dense" name="label" label="Address Label (e.g., Home, Office)" fullWidth onChange={handleInputChange} />
              <TextField margin="dense" name="recipientName" label="Recipient Name" fullWidth onChange={handleInputChange} />
              <TextField margin="dense" name="phoneNumber" label="Phone Number" fullWidth onChange={handleInputChange} />
              <TextField margin="dense" name="fullAddress" label="Full Address" fullWidth multiline rows={4} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Click on the map to set location</Typography>
              <Box sx={{ height: '300px', width: '100%', mt: 1 }}>
                <MapContainer center={[newAddress.lat || center.lat, newAddress.lng || center.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {newAddress.lat && <Marker position={[newAddress.lat, newAddress.lng]} />}
                  <MapClickHandler setPosition={(latlng) => setNewAddress(prev => ({...prev, ...latlng}))} />
                </MapContainer>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveAddress}>Save Address</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddressPage;