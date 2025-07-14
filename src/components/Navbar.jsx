import { useState } from 'react';
import { AppBar, Toolbar, Button, Box, IconButton, Badge, Menu, MenuItem, Avatar, useMediaQuery, useTheme, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material'; // Tambah useMediaQuery, useTheme, Drawer, List, ListItem, ListItemButton, ListItemText
import { Link, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu'; // Tambah MenuIcon
import { useSelector, useDispatch } from 'react-redux';
import AuthModal from './AuthModal';
import { logoutUser } from '../services/authService';
import { logout } from '../store/userSlice';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// Impor logo gambar Anda
import SmyvaLogo from '/LogoSMYVAnew.jpeg_1-removebg-preview (1).png';

function Navbar() {
  const totalQuantity = useSelector(state => state.cart.totalQuantity);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme(); // Dapatkan tema untuk mengakses breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // <--- Responsif: Akan true jika layar <= md

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false); // State untuk mobile drawer

  const handleOpenAuthModal = () => setOpenAuthModal(true);
  const handleCloseAuthModal = () => setOpenAuthModal(false);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  
  const handleGoToProfile = () => {
    navigate('/profile');
    handleCloseMenu();
  };

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
    handleCloseMenu();
    navigate('/');
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // Definisi link navigasi
  const navLinks = [
    { text: 'Home', path: '/' },
    { text: 'Products', path: '/products' },
    { text: 'Contact', path: '/contact' },
    { text: 'About Us', path: '/company-profile' },
  ];

  return (
    <>
      <AppBar position="static" color="transparent" elevation={1} sx={{ px: { xs: 1, md: 2 }, py: 1 }}> {/* <--- Responsif: Padding horizontal */}
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo Brand */}
          <Box component={Link} to="/" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img 
              src={SmyvaLogo} 
              alt="SMYVA Leather Logo" 
              style={{ height: isMobile ? '45px' : '129px' }} // <--- Responsif: Tinggi logo
            />
          </Box>
          
          {/* Navigasi Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}> {/* <--- Responsif: Sembunyikan di xs/sm */}
            {navLinks.map((link) => (
              <Button key={link.text} color="inherit" component={Link} to={link.path} sx={{ mx: 1 }}>{link.text}</Button>
            ))}
          </Box>
          
          {/* Ikon Aksi & User */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 } }}> {/* <--- Responsif: Gap ikon */}
            {/* Tombol Wishlist (tetap terlihat) */}
            {user && (
              <IconButton color="inherit" component={Link} to="/wishlist" aria-label="wishlist" size={isMobile ? "small" : "medium"}>
                <FavoriteBorderIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            )}

            {/* Ikon Keranjang (tetap terlihat) */}
            <IconButton color="inherit" component={Link} to="/cart" aria-label="cart" size={isMobile ? "small" : "medium"}>
              <Badge badgeContent={totalQuantity} color="error">
                <ShoppingCartIcon fontSize={isMobile ? "small" : "medium"} />
              </Badge>
            </IconButton>

            {isMobile ? (
              // Hamburger menu untuk Mobile
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              // Avatar user untuk Desktop
              user ? (
                <>
                  <IconButton size="large" onClick={handleMenu} color="inherit">
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      {user?.displayName?.charAt(0).toUpperCase() || 'A'}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    {user.role === 'admin' && (
                      <MenuItem component={Link} to="/admin/dashboard" onClick={handleCloseMenu}>
                        Dashboard
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleGoToProfile}>Profile</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                // Tombol Login/Register untuk Desktop (jika user belum login)
                <>
                  <Button color="inherit" onClick={handleOpenAuthModal} sx={{ mx: 0.5 }}>Login</Button> {/* <--- Responsif: Margin */}
                  <Button variant="contained" color="primary" onClick={handleOpenAuthModal} sx={{ mx: 0.5 }}>Register</Button> {/* <--- Responsif: Margin */}
                </>
              )
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer untuk navigasi Mobile */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.text} disablePadding>
                <ListItemButton component={Link} to={link.path}>
                  <ListItemText primary={link.text} />
                </ListItemButton>
              </ListItem>
            ))}
            {/* Tombol Login/Register/Profile/Logout di Drawer */}
            {user ? (
              <>
                {user.role === 'admin' && (
                  <ListItem disablePadding>
                    <ListItemButton component={Link} to="/admin/dashboard">
                      <ListItemText primary="Dashboard" />
                    </ListItemButton>
                  </ListItem>
                )}
                <ListItem disablePadding>
                  <ListItemButton onClick={handleGoToProfile}>
                    <ListItemText primary="Profile" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout}>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleOpenAuthModal}>
                    <ListItemText primary="Login" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleOpenAuthModal}>
                    <ListItemText primary="Register" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      {!user && <AuthModal open={openAuthModal} handleClose={handleCloseAuthModal} />}
    </>
  );
}

export default Navbar;