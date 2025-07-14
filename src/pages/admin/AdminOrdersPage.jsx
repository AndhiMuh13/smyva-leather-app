import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Select, MenuItem, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { collection, getDocs, orderBy, query, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useSnackbar } from 'notistack';

// Opsi status pesanan (tidak berubah)
const STATUS_OPTIONS = ['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled', 'failed'];

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  // PERUBAHAN 1: `useEffect` dibuat lebih sederhana dan aman
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(ordersQuery);
        
        // Langsung simpan data mentah, proses format akan dilakukan di dalam tabel
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
        enqueueSnackbar('Gagal memuat data pesanan.', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Fungsi untuk menangani perubahan status (kode Anda dipertahankan)
  const handleStatusChange = async (id, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, { status: newStatus });
      
      setOrders(orders.map(order => 
        order.id === id ? { ...order, status: newStatus } : order
      ));
      enqueueSnackbar(`Order ${id} status updated to ${newStatus}`, { variant: 'success' });
    } catch (error) {
      console.error("Error updating status: ", error);
      enqueueSnackbar('Gagal memperbarui status.', { variant: 'error' });
    }
  };

  // PERUBAHAN 2: Definisi kolom dibuat lebih aman
  const columns = [
    { field: 'id', headerName: 'Order ID', width: 220 },
    { 
      field: 'customerName', 
      headerName: 'Customer Name', 
      width: 180,
      // valueGetter aman jika customerDetails tidak ada
      valueGetter: (value, row) => `${row.customerDetails?.first_name || ''} ${row.customerDetails?.last_name || ''}`,
    },
    { 
      field: 'createdAt', 
      headerName: 'Date', 
      width: 180,
      // valueFormatter aman jika createdAt tidak ada
      valueFormatter: (value) => {
        if (!value || typeof value.toDate !== 'function') return 'N/A';
        return value.toDate().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
      }
    },
    {
      field: 'totalAmount', // Nama field disesuaikan dengan database
      headerName: 'Total Amount',
      width: 150,
      type: 'number',
      // valueFormatter aman jika totalAmount tidak ada
      valueFormatter: (value) => {
        if (typeof value !== 'number') return 'Rp 0';
        return `Rp ${value.toLocaleString('id-ID')}`;
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 200,
      // renderCell Anda dipertahankan karena sudah sangat bagus
      renderCell: (params) => (
        <Select
          value={params.value || 'processing'}
          onChange={(e) => handleStatusChange(params.id, e.target.value)}
          size="small"
          sx={{ width: '100%' }}
          onClick={(e) => e.stopPropagation()} // Mencegah klik pada select memicu klik pada baris
        >
          {STATUS_OPTIONS.map(option => (
            <MenuItem key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </MenuItem>
          ))}
        </Select>
      )
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Orders
      </Typography>
      <Paper sx={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={orders}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
          }}
        />
      </Paper>
    </Box>
  );
}

export default AdminOrdersPage;