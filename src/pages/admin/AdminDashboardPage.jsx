import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, CircularProgress, List, ListItem, ListItemAvatar, 
  Avatar, ListItemText, Chip, Stack, TextField, InputAdornment, Select, 
  MenuItem, FormControl, Alert 
} from '@mui/material';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Komponen Kartu Statistik
const StatCard = ({ title, value, formatAsCurrency = false }) => (
  <Paper sx={{ p: 2, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: 'none', backgroundColor: '#FEFBF6' }}>
    <Typography color="text.secondary" sx={{ mb: 1 }}>{title}</Typography>
    <Typography variant="h4" fontWeight="bold">
      {formatAsCurrency ? `Rp ${Number(value).toLocaleString('id-ID')}` : value}
    </Typography>
  </Paper>
);

// Komponen Chip Status
const StatusChip = ({ status }) => {
    const statusStyles = {
        shipped: { bgcolor: '#FFDDC1', color: '#E67E22' },
        processing: { bgcolor: '#FFF3C1', color: '#F1C40F' },
        paid: { bgcolor: '#E8DAEF', color: '#8E44AD' },
        completed: { bgcolor: '#D5F5E3', color: '#2ECC71' },
        failed: { bgcolor: '#F5B7B1', color: '#E74C3C' },
        pending: { bgcolor: '#EAECEE', color: '#7F8C8D' },
    };
    const style = statusStyles[status] || {};
    return <Chip label={status} size="small" sx={{ ...style, fontWeight: 'bold' }} />;
};

function AdminDashboardPage() {
  const { user } = useSelector(state => state.user);
  const [stats, setStats] = useState({ totalRevenue: 0, totalStock: 0, totalOrders: 0 });
  const [latestOrders, setLatestOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [popularProduct, setPopularProduct] = useState(null);
  
  const [activityData, setActivityData] = useState([]);
  const [activityFilter, setActivityFilter] = useState('monthly');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const statsUnsub = onSnapshot(doc(db, 'summary', 'stats'), (docSnap) => {
      if (docSnap.exists()) setStats(docSnap.data());
      setLoading(false);
    });

    const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const ordersUnsub = onSnapshot(ordersQuery, (snapshot) => {
        const allOrders = snapshot.docs.map(doc => doc.data());

        const latest = allOrders.slice(0, 5).map(order => ({
            id: order.orderId,
            name: order.customerDetails?.first_name || 'Customer',
            status: order.status || 'pending'
        }));
        setLatestOrders(latest);
        
        // Logika untuk memproses data grafik berdasarkan filter
        let processedData = [];
        const now = new Date();

        if (activityFilter === 'daily') {
            const last7Days = Array(7).fill(0).map((_, i) => {
                const d = new Date();
                d.setDate(now.getDate() - i);
                return { date: d, name: d.toLocaleDateString('en-US', { weekday: 'short' }), orders: 0 };
            }).reverse();

            allOrders.forEach(order => {
                if (order.createdAt) {
                    const orderDate = order.createdAt.toDate();
                    const day = last7Days.find(d => d.date.toDateString() === orderDate.toDateString());
                    if (day) day.orders++;
                }
            });
            processedData = last7Days;

        } else if (activityFilter === 'weekly') {
            processedData = [
                { name: '3 Wk Ago', orders: 0 }, { name: '2 Wk Ago', orders: 0 },
                { name: 'Last Wk', orders: 0 }, { name: 'This Wk', orders: 0 }
            ];
            const weekInMillis = 7 * 24 * 60 * 60 * 1000;
            allOrders.forEach(order => {
                if (order.createdAt) {
                    const orderTime = order.createdAt.toDate().getTime();
                    const diff = now.getTime() - orderTime;
                    if (diff < weekInMillis) processedData[3].orders++;
                    else if (diff < 2 * weekInMillis) processedData[2].orders++;
                    else if (diff < 3 * weekInMillis) processedData[1].orders++;
                    else if (diff < 4 * weekInMillis) processedData[0].orders++;
                }
            });
        } else { // monthly
            const monthlySales = {};
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            allOrders.forEach(order => {
                if (['paid', 'completed', 'shipped'].includes(order.status) && order.createdAt) {
                    const date = order.createdAt.toDate();
                    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
                    if (!monthlySales[monthKey]) {
                        monthlySales[monthKey] = { name: monthNames[date.getMonth()], orders: 0 };
                    }
                    monthlySales[monthKey].orders++;
                }
            });
            processedData = Object.values(monthlySales).reverse().slice(0, 7);
        }
        setActivityData(processedData);
    });

    const productsQuery = query(collection(db, "products"));
    const productsUnsub = onSnapshot(productsQuery, (snapshot) => {
        let popular = null;
        const lowStock = [];
        snapshot.forEach(doc => {
            const product = doc.data();
            if (!popular || (product.soldCount || 0) > (popular.soldCount || 0)) popular = product;
            if (product.stock <= 5 && product.stock > 0) lowStock.push(product.name);
        });
        setPopularProduct(popular);
        setLowStockProducts(lowStock);
    });

    return () => {
      statsUnsub();
      ordersUnsub();
      productsUnsub();
    };
  }, [activityFilter]); // useEffect akan berjalan kembali saat filter berubah

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" fontWeight="bold">Seller Dashboard</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box textAlign="right">
            <Typography fontWeight="bold">{user?.displayName || 'Admin'}</Typography>
            <Typography variant="body2" color="text.secondary">Admin</Typography>
          </Box>
          <Avatar src={user?.photoURL}>{user?.displayName?.charAt(0).toUpperCase() || 'A'}</Avatar>
        </Box>
      </Box>

      <TextField
        variant="outlined" placeholder="Search..." fullWidth
        sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#FEFBF6' } }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
      />
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4} md={3}><StatCard title="Total Revenue" value={stats.totalRevenue} formatAsCurrency /></Grid>
        <Grid item xs={12} sm={4} md={3}><StatCard title="Total Orders" value={stats.totalOrders} /></Grid>
        <Grid item xs={12} sm={4} md={3}><StatCard title="Product Stock" value={stats.totalStock} /></Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, borderRadius: 3, height: '280px', bgcolor: '#FEFBF6', boxShadow: 'none', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb:1}}>
                <Typography variant="h6">Activity</Typography>
                <FormControl variant="standard" size="small" sx={{minWidth: 80}}>
                    <Select value={activityFilter} onChange={(e) => setActivityFilter(e.target.value)}>
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip wrapperStyle={{ fontSize: '12px', padding: '5px' }} cursor={{fill: 'rgba(221, 221, 221, 0.3)'}}/>
                <Bar dataKey="orders" fill="#8D6E63" barSize={15} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#FEFBF6', boxShadow: 'none', height: '100%' }}>
            <Typography variant="h6" mb={1}>Latest Orders</Typography>
            <List>
              {latestOrders.map(order => (
                <ListItem key={order.id} disablePadding>
                  <ListItemAvatar><Avatar>{order.name?.charAt(0).toUpperCase()}</Avatar></ListItemAvatar>
                  <ListItemText primary={order.name} secondary={order.id} />
                  <StatusChip status={order.status} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          {popularProduct && (
            <Paper sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#FFEDD9', boxShadow: 'none', height: '100%' }}>
              <Box>
                <Typography variant="h6">Popular Products</Typography>
                <Typography variant="h4" fontWeight="bold">{popularProduct.name}</Typography>
                <Typography variant="h5" color="text.secondary">{popularProduct.soldCount || 0} Sales</Typography>
              </Box>
              <Box component="img" src={popularProduct.imageUrl} sx={{ width: 120, height: 100, objectFit: 'cover', borderRadius: 2, ml: 'auto' }} />
            </Paper>
          )}
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#FEFBF6', boxShadow: 'none', height: '100%' }}>
            <Typography variant="h6" mb={1}>Notifications</Typography>
            <Stack spacing={1}>
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((name, index) => (
                  <Alert icon={<InfoOutlinedIcon fontSize="inherit" />} severity="warning" key={index} sx={{ borderRadius: 2 }}>
                    Low Inventory: <strong>{name}</strong>
                  </Alert>
                ))
              ) : (<Typography color="text.secondary" sx={{p:1}}>No new notifications.</Typography>)}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboardPage;