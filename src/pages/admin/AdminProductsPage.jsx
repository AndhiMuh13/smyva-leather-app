// src/pages/admin/AdminProductsPage.jsx
import { useState, useEffect } from 'react';
import { Box, Typography, Button, Avatar, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

// Impor Ikon
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(productsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    // Tampilkan konfirmasi sebelum menghapus
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        // Perbarui state untuk menghapus produk dari tabel secara real-time
        setProducts(products.filter((product) => product.id !== id));
      } catch (error) {
        console.error("Error removing document: ", error);
      }
    }
  };

  const handleEdit = (id) => {
    // Arahkan ke halaman edit (akan kita buat nanti)
    navigate(`/admin/products/edit/${id}`);
  };

  // Definisikan kolom untuk tabel data
  const columns = [
    { 
      field: 'imageUrl', 
      headerName: 'Image', 
      width: 100,
      renderCell: (params) => <Avatar src={params.value} sx={{ width: 56, height: 56 }} variant="rounded" />
    },
    { field: 'name', headerName: 'Product Name', width: 250 },
    { 
      field: 'price', 
      headerName: 'Price', 
      width: 150,
      valueFormatter: (value) => `Rp ${value.toLocaleString('id-ID')}`
    },
    { field: 'stock', headerName: 'Stock', width: 100 },
    { field: 'soldCount', headerName: 'Sold', width: 100, valueGetter: (value) => value || 0 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Box 
          sx={{ 
            bgcolor: params.row.stock > 0 ? 'success.light' : 'error.light', 
            color: params.row.stock > 0 ? 'success.dark' : 'error.dark',
            p: '4px 12px',
            borderRadius: 2,
            fontWeight: 'bold'
          }}
        >
          {params.row.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </Box>
      )
    },
    // Kolom baru untuk tombol aksi
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">My Products</Typography>
        <Button 
          variant="contained" 
          component={Link} 
          to="/admin/products/new"
        >
          + Add New Product
        </Button>
      </Box>
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={products}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 20]}
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

// Komponen Paper perlu diimpor
import { Paper } from '@mui/material';

export default AdminProductsPage;
