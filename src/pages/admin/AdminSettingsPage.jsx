// src/pages/admin/AdminSettingsPage.jsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Paper, Grid, TextField, Button, Avatar, FormControlLabel, Switch, Alert, CircularProgress } from '@mui/material';
import { getAuth, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../firebase';
import { login } from '../../store/userSlice'; // Impor aksi login untuk update Redux

function AdminSettingsPage() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [displayName, setDisplayName] = useState('');
  const [currentPassword, setCurrentPassword] = useState(''); // <-- State baru untuk password saat ini
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setError("No user is currently signed in.");
      setIsLoading(false);
      return;
    }

    try {
      // Update display name jika ada perubahan
      if (displayName !== user.displayName) {
        await updateProfile(currentUser, { displayName: displayName });
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, { displayName: displayName });
      }

      // Update password jika diisi
      if (newPassword) {
        if (!currentPassword) {
          throw new Error("Please enter your current password to set a new one.");
        }
        if (newPassword !== confirmPassword) {
          throw new Error("New passwords do not match.");
        }
        if (newPassword.length < 6) {
          throw new Error("Password should be at least 6 characters.");
        }

        // --- Proses Re-autentikasi ---
        const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
        await reauthenticateWithCredential(currentUser, credential);
        // -----------------------------
        
        // Jika re-autentikasi berhasil, baru update password
        await updatePassword(currentUser, newPassword);
      }
      
      setSuccess("Profile updated successfully!");
      dispatch(login({ ...user, displayName: displayName }));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (err) {
      console.error(err);
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Settings
      </Typography>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>Profile Settings</Typography>
        <Grid container spacing={4} alignItems="center">
          <Grid item>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
              {displayName.charAt(0).toUpperCase()}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Box component="form" onSubmit={handleProfileUpdate}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    fullWidth
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    fullWidth
                    value={user?.email || ''}
                    disabled
                  />
                </Grid>
                {/* Field baru untuk password saat ini */}
                <Grid item xs={12}>
                  <TextField
                    label="Current Password"
                    type="password"
                    placeholder="Enter current password to change it"
                    fullWidth
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="New Password"
                    type="password"
                    placeholder="Leave blank to keep current"
                    fullWidth
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Confirm New Password"
                    type="password"
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                  {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                  <Button type="submit" variant="contained" disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Update Profile'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>Notification Settings</Typography>
        <Box>
          <FormControlLabel control={<Switch defaultChecked />} label="Order Updates" />
        </Box>
        <Box>
          <FormControlLabel control={<Switch />} label="Promotional Emails" />
        </Box>
      </Paper>
    </Box>
  );
}

export default AdminSettingsPage;
