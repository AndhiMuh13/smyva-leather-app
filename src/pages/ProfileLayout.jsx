// src/pages/ProfileLayout.jsx
import DashboardLayout from '../components/DashboardLayout'; // Impor layout reusable kita

// Impor Ikon untuk menu profil
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

// Definisikan item menu khusus untuk halaman profil
const profileMenuItems = [
    { text: 'My Account', icon: <AccountCircleIcon />, path: '/profile/my-account' },
    { text: 'Address', icon: <LocationOnIcon />, path: '/profile/address' },
    { text: 'Change Password', icon: <LockIcon />, path: '/profile/change-password' },
    { text: 'Notification Settings', icon: <NotificationsIcon />, path: '/profile/notification-settings' },
    { text: 'My Order', icon: <ShoppingBagIcon />, path: '/profile/my-order' },
];

function ProfileLayout() {
    // Kirim 'profileMenuItems' sebagai prop ke DashboardLayout
    return <DashboardLayout menuItems={profileMenuItems} />;
}

export default ProfileLayout;
