import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider } from '@mui/material';
// 1. Impor 'Link' dari react-router-dom
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LogoutIcon from '@mui/icons-material/Logout';
import { logoutUser } from '../services/authService';
import { logout } from '../store/userSlice';

const drawerWidth = 240;

function DashboardLayout({ menuItems }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
    navigate('/');
  };

  const drawer = (
    <div>
      {/* 2. BUNGKUS LOGO DENGAN KOMPONEN LINK */}
      <Toolbar 
        component={Link} 
        to="/" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          p: 2,
          textDecoration: 'none', // Hapus garis bawah link
          color: 'inherit'        // Gunakan warna teks dari parent
        }}
      >
        <Typography variant="h6" noWrap component="div" fontWeight="bold">
          SMYVA LEATHER
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              component={NavLink} 
              to={item.path}
              sx={{
                '&.active': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRight: '3px solid white',
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon><LogoutIcon sx={{ color: 'white' }} /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer 
        variant="permanent" 
        sx={{ 
          width: drawerWidth, 
          flexShrink: 0, 
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box', 
            backgroundColor: '#854836', 
            color: 'white' 
          } 
        }}
      >
        {drawer}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#FEFDFC', minHeight: '100vh' }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default DashboardLayout;