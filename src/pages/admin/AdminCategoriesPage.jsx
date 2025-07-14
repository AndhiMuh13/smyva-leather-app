import { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, List, ListItem, ListItemText, IconButton, Divider, CircularProgress, Alert } from '@mui/material';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack'; // Disarankan untuk notifikasi yang lebih baik

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { enqueueSnackbar } = useSnackbar(); // Hook untuk notifikasi

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // ## PERBAIKAN: Urutkan berdasarkan nama (name) secara alfabetis ##
      const categoriesQuery = query(collection(db, "categories"), orderBy("name", "asc"));
      const querySnapshot = await getDocs(categoriesQuery);
      const categoriesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError('');
    if (newCategory.trim() === '') {
      setError("Category name cannot be empty.");
      return;
    }
    
    try {
      await addDoc(collection(db, "categories"), {
        name: newCategory.trim(), // Hanya simpan nama, createdAt tidak begitu relevan untuk kategori
      });
      enqueueSnackbar('Category added successfully!', { variant: 'success' });
      setNewCategory('');
      fetchCategories(); // Muat ulang daftar kategori
    } catch (err) {
      console.error("Error adding category: ", err);
      setError("Failed to add category. Check permissions.");
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteDoc(doc(db, "categories", id));
        enqueueSnackbar('Category deleted successfully!', { variant: 'info' });
        fetchCategories(); // Muat ulang daftar kategori
      } catch (error) {
        console.error("Error deleting category: ", error);
        setError("Failed to delete category.");
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  };

  return (
    <Box sx={{p: 3}}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Manage Categories
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>Add New Category</Typography>
        <Box component="form" onSubmit={handleAddCategory} sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            label="Category Name"
            variant="outlined"
            size="small"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            sx={{ flexGrow: 1 }}
            error={!!error}
            helperText={error}
          />
          <Button type="submit" variant="contained">Add</Button>
        </Box>
        <Divider />
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Existing Categories</Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {categories.map(category => (
              <ListItem
                key={category.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCategory(category.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={category.name} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}

export default AdminCategoriesPage;