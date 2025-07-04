// src/components/AuthModal.jsx
import { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Stack, Alert } from '@mui/material';
import { registerUser, loginUser } from '../services/authService';

// Gaya untuk memposisikan modal di tengah layar
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

function AuthModal({ open, handleClose }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError('');
  };

  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
    clearForm();
  };

  const handleModalClose = () => {
    clearForm();
    handleClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      if (isLoginMode) {
        await loginUser(email, password);
      } else {
        await registerUser(email, password, name);
      }
      handleModalClose();
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  return (
    <Modal open={open} onClose={handleModalClose}>
      {/* Pastikan Box ini menggunakan sx={style} */}
      <Box sx={style}>
        <Typography variant="h5" fontWeight="bold" textAlign="center">
          {isLoginMode ? 'Login' : 'Create Your Account'}
        </Typography>
        
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Stack component="form" spacing={2} sx={{ mt: 2 }} onSubmit={handleSubmit}>
          {!isLoginMode && (
            <TextField label="Name" variant="outlined" fullWidth value={name} onChange={(e) => setName(e.target.value)} required />
          )}
          <TextField label="Email" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 2 }}>
            {isLoginMode ? 'Login' : 'Register'}
          </Button>
        </Stack>
        
        <Button onClick={switchModeHandler} size="small" sx={{ mt: 2 }}>
          {isLoginMode ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
        </Button>
      </Box>
    </Modal>
  );
}

export default AuthModal;
