// src/components/Navbar.jsx
import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useSelector, useDispatch } from 'react-redux';
import AuthModal from './AuthModal';
import { logoutUser } from '../services/authService';
import { logout } from '../store/userSlice';

function Navbar() {
  const totalQuantity = useSelector(state => state.cart.totalQuantity);
  const user = useSelector(state => state.user.user); // Ambil data user dari Redux
  const dispatch = useDispatch();

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenAuthModal = () => setOpenAuthModal(true);
  const handleCloseAuthModal = () => setOpenAuthModal(false);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout()); // Hapus user dari state Redux
    handleCloseMenu();
  };

  return (
    <>
      <AppBar position="static" color="transparent" elevation={1} sx={{ px: 2 }}>
        <Toolbar>
          <Typography component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
            SMYVA LEATHER
          </Typography>
          <Box>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/products">Products</Button>
            <Button color="inherit" component={Link} to="/contact">Contact</Button>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            {user ? (
              // Jika user login
              <>
                <IconButton color="inherit" component={Link} to="/cart">
                  <Badge badgeContent={totalQuantity} color="error"><ShoppingCartIcon /></Badge>
                </IconButton>
                <IconButton size="large" onClick={handleMenu} color="inherit">
                  <AccountCircle />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                  <MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              // Jika user tidak login
              <>
                <Button color="inherit" onClick={handleOpenAuthModal}>Login</Button>
                <Button variant="contained" color="primary" onClick={handleOpenAuthModal}>Register</Button>
                <IconButton color="inherit" component={Link} to="/cart">
                  <Badge badgeContent={totalQuantity} color="error"><ShoppingCartIcon /></Badge>
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {!user && <AuthModal open={openAuthModal} handleClose={handleCloseAuthModal} />}
    </>
  );
}

export default Navbar;
