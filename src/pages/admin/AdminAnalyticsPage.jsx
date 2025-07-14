// src/pages/admin/AdminAnalyticsPage.jsx
import { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Select, MenuItem, FormControl, Button } from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';

// Helper function untuk mendapatkan nomor minggu dalam setahun
const getWeekNumber = (d) => {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return weekNo;
};

function AdminAnalyticsPage() {
  const [chartData, setChartData] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [timeframe, setTimeframe] = useState('monthly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const ordersQuery = query(collection(db, "orders"), where("status", "==", "completed"));
      const querySnapshot = await getDocs(ordersQuery);
      const ordersData = querySnapshot.docs.map(doc => doc.data());
      setAllOrders(ordersData);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (allOrders.length === 0 && !loading) return;

    const processData = () => {
      const salesData = {};
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      allOrders.forEach(order => {
        const date = order.createdAt.toDate();
        let key = '';

        if (timeframe === 'daily') {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          if (date < sevenDaysAgo) return;
          key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          if (!salesData[key]) salesData[key] = { name: dayNames[date.getDay()], sales: 0 };
        } 
        else if (timeframe === 'weekly') {
          key = `${date.getFullYear()}-W${getWeekNumber(date)}`;
          if (!salesData[key]) salesData[key] = { name: `Week ${getWeekNumber(date)}`, sales: 0 };
        } 
        else if (timeframe === 'monthly') {
          key = `${date.getFullYear()}-${date.getMonth()}`;
          if (!salesData[key]) salesData[key] = { name: monthNames[date.getMonth()], sales: 0 };
        } 
        else if (timeframe === 'yearly') {
          key = date.getFullYear().toString();
          if (!salesData[key]) salesData[key] = { name: key, sales: 0 };
        }
        
        if(salesData[key]) {
            salesData[key].sales += order.total;
        }
      });

      setChartData(Object.values(salesData));
    };

    processData();
  }, [allOrders, timeframe, loading]);

  // --- FUNGSI EKSPOR YANG DIPERBARUI ---
  const handleExport = () => {
    if (allOrders.length === 0) {
      alert("No data to export.");
      return;
    }

    // 1. Ubah data mentah menjadi format yang lebih detail
    const detailedData = [];
    allOrders.forEach(order => {
      // Loop melalui setiap item di dalam pesanan
      order.items.forEach(item => {
        // Abaikan item ongkos kirim
        if (item.id !== 'SHIPPING_COST') {
          detailedData.push({
            'Order ID': order.orderId,
            'Order Date': order.createdAt.toDate().toLocaleString('id-ID'),
            'Customer Name': `${order.customerDetails.first_name} ${order.customerDetails.last_name}`,
            'Customer Email': order.customerDetails.email,
            'Product ID': item.id,
            'Product Name': item.name,
            'Quantity': item.quantity,
            'Price per Item': item.price,
            'Total Price': item.price * item.quantity,
          });
        }
      });
    });

    // 2. Buat worksheet dari data yang sudah detail
    const ws = XLSX.utils.json_to_sheet(detailedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DetailedSalesData");

    // 3. Unduh file Excel
    XLSX.writeFile(wb, `detailed-sales-report.xlsx`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Sales Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={handleExport}>
            Export Detailed Data
          </Button>
          <FormControl size="small">
            <Select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="daily">Daily (Last 7 Days)</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Paper sx={{ p: 3, borderRadius: 3, height: 400 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `Rp ${value/1000}k`} />
              <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
              <Legend />
              <Bar dataKey="sales" fill="#8D6E63" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Paper>
    </Box>
  );
}

export default AdminAnalyticsPage;
