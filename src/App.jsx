import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { monitorAuthState } from './services/authService';
import { login, logout, setLoading } from './store/userSlice';

// Import Layouts & Route Guards
import Navbar from './components/Navbar';
import DashboardLayout from './components/DashboardLayout';
import AdminRoute from './components/AdminRoute';
import UserRoute from './components/UserRoute';

// Import Halaman Publik
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ContactPage from './pages/ContactPage';
import WishlistPage from './pages/WishlistPage';
import CompanyProfile from './pages/CompanyProfile';

// <--- BARU: Impor halaman-halaman support
import FAQsPage from './pages/FAQsPage';
import ShippingReturnsPage from './pages/ShippingReturnsPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

// Import Halaman Profil, Pesanan, & Pelacakan
import ProfilePage from './pages/ProfilePage';
import MyOrderPage from './pages/MyOrderPage';
import AddressPage from './pages/AddressPage';
import TrackOrderPage from './pages/TrackOrderPage';
import OrderDetailPage from './pages/OrderDetailPage';

// Import Halaman Admin
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage'; // <--- KOREKSI PATH
import AdminAddProductPage from './pages/admin/AdminAddProductPage';
import AdminEditProductPage from './pages/admin/AdminEditProductPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';

// Import Ikon untuk Menu
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Definisikan item menu untuk Admin
const adminMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'Products', icon: <InventoryIcon />, path: '/admin/products' },
  { text: 'Categories', icon: <CategoryIcon />, path: '/admin/categories' },
  { text: 'Orders', icon: <ShoppingCartIcon />, path: '/admin/orders' },
  { text: 'Customers', icon: <PeopleIcon />, path: '/admin/customers' },
  { text: 'Analytics', icon: <BarChartIcon />, path: '/admin/analytics' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
];

// Definisikan item menu untuk Profil Pengguna
const profileMenuItems = [
    { text: 'My Account', icon: <AccountCircleIcon />, path: '/profile' },
    { text: 'My Order', icon: <ShoppingCartIcon />, path: '/my-orders' },
    { text: 'Address', icon: <LocationOnIcon />, path: '/address' },
];

// Komponen Pembungkus untuk Layout Publik
const PublicLayout = () => (
  <>
    <Navbar />
    <main><Outlet /></main>
  </>
);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading());
    const unsubscribe = monitorAuthState((user) => {
      if (user) {
        dispatch(login(user));
      } else {
        dispatch(logout());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Grup Rute Publik */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/company-profile" element={<CompanyProfile />} />
          {/* <--- BARU: Rute untuk halaman-halaman support */}
          <Route path="/faqs" element={<FAQsPage />} />
          <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
          <Route path="/terms-conditions" element={<TermsConditionsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        </Route>

        {/* Grup Rute Halaman yang Memerlukan Login Pengguna */}
        <Route element={<UserRoute />}>
          <Route element={<DashboardLayout menuItems={profileMenuItems} />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-orders" element={<MyOrderPage />} />
            <Route path="/address" element={<AddressPage />} />
          </Route>
          
          <Route path="/track-order/:orderId" element={<TrackOrderPage />} />
          <Route path="/order-detail/:orderId" element={<OrderDetailPage />} />
        </Route>

        {/* Grup Rute Admin */}
        <Route element={<AdminRoute />}>
          <Route element={<DashboardLayout menuItems={adminMenuItems} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/products/new" element={<AdminAddProductPage />} />
            <Route path="/admin/products/edit/:productId" element={<AdminEditProductPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/customers" element={<AdminCustomersPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;