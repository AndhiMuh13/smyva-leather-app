// src/components/ProductCard.jsx
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom'; // <-- Tambahkan impor ini

function ProductCard({ product }) {
  return (
    // 👇 Tambahkan component={Link} dan to={...} 👇
    <Card
      component={Link}
      to={`/product/${product.id}`}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: 3, 
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        textDecoration: 'none', // Menghilangkan garis bawah dari link
        color: 'inherit'        // Mewarisi warna teks
      }}
    >
      <CardMedia
        component="img"
        sx={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
        image={product.imageUrl}
        alt={product.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
          {product.name}
        </Typography>
        <Typography variant="body1" color="text.primary">
          Rp {product.price.toLocaleString('id-ID')}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ProductCard;