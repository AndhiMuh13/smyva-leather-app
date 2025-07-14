import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Container, Box, Typography, Stepper, Step, StepLabel, 
  Paper, CircularProgress, Alert, Button, styled, IconButton 
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import Ikon
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Perbaikan untuk ikon marker default Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Kustomisasi Ikon untuk Stepper
const StepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundColor: '#8D6E63',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundColor: '#8D6E63',
  }),
}));

function CustomStepIcon(props) {
  const { active, completed, className, icon } = props;
  const icons = {
    1: <StorefrontIcon />,
    2: <LocalShippingIcon />,
    3: <HomeIcon />,
  };
  return (
    <StepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(icon)]}
    </StepIconRoot>
  );
}

function TrackOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(-1);

  const steps = [
    { label: 'Order Placed', status: 'paid' },
    { label: 'Processing', status: 'processing' },
    { label: 'Shipped', status: 'shipped' },
    { label: 'Completed', status: 'completed' },
  ];

  const mapPositions = {
    start: [-7.801, 110.364],
    delivery: [-7.800, 110.367],
    end: [-7.802, 110.369],
  };
  const routeLine = [mapPositions.start, mapPositions.delivery, mapPositions.end];

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);
        if (orderSnap.exists()) {
          const orderData = orderSnap.data();
          setOrder(orderData);
          const statusIndex = steps.findIndex(step => step.status === orderData.status);
          setActiveStep(statusIndex);
        } else {
          setError('Order not found.');
        }
      } catch (err) {
        setError('Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="sm" sx={{ my: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <IconButton onClick={() => navigate(-1)} aria-label="go back">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight="bold" sx={{ ml: 1 }}>
          Order Tracking
        </Typography>
      </Box>
      <Typography color="text.secondary" sx={{ ml: {xs: 0, sm: 6} }} gutterBottom>
        Track location for order #{orderId}
      </Typography>

      <Paper sx={{ height: 300, width: '100%', my: 2, borderRadius: 3, overflow: 'hidden' }}>
        <MapContainer center={mapPositions.delivery} zoom={16} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={mapPositions.end}></Marker>
          <Polyline pathOptions={{ color: 'red' }} positions={routeLine} />
        </MapContainer>
      </Paper>

      <Typography variant="h5" fontWeight="bold" sx={{ mt: 4 }}>Progress of your Order</Typography>
      <Box sx={{ mt: 2 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel StepIconComponent={CustomStepIcon}>
                <Typography fontWeight={activeStep >= index ? 'bold' : 'normal'}>
                  {step.label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Button
        fullWidth
        variant="outlined"
        onClick={() => navigate('/')}
        sx={{ mt: 4, borderRadius: 2, p: 1.5 }}
      >
        Done
      </Button>
    </Container>
  );
}

export default TrackOrderPage;