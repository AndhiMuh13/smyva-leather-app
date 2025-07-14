// src/pages/admin/AdminCustomersPage.jsx
import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';

function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      const customersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(customersQuery);
      
      const customersData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate().toLocaleDateString('id-ID'),
        };
      });
      setCustomers(customersData);
      setLoading(false);
    };

    fetchCustomers();
  }, []);

  // Definisikan kolom untuk tabel data pelanggan
  const columns = [
    { 
      field: 'id', 
      headerName: 'User ID', 
      width: 220 
    },
    { 
      field: 'displayName', 
      headerName: 'Name', 
      width: 250,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2, width: 32, height: 32 }}>{params.value.charAt(0)}</Avatar>
          {params.value}
        </Box>
      )
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 250 
    },
    { 
      field: 'createdAt', 
      headerName: 'Date Joined', 
      width: 150 
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
    }
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Customers
      </Typography>
      <Paper sx={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={customers}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
        />
      </Paper>
    </Box>
  );
}

export default AdminCustomersPage;
