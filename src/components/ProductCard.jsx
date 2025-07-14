import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useSelector } from 'react-redux';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

function ProductCard({ product }) {
  const { user } = useSelector(state => state.user);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Cek status wishlist saat komponen dimuat
  useEffect(() => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      getDoc(userRef).then(docSnap => {
        if (docSnap.exists() && docSnap.data().wishlist?.includes(product.id)) {
          setIsWishlisted(true);
        }
      }).catch(error => {
          console.error("Error fetching user wishlist:", error);
      });
    }
  }, [user, product.id]);

  const handleToggleWishlist = async (e) => {
    e.preventDefault(); // Mencegah navigasi saat ikon diklik
    e.stopPropagation(); // Mencegah event bubbling

    if (!user) {
      alert('Please login to add items to your wishlist.');
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    try {
      if (isWishlisted) {
        // Hapus dari wishlist
        await updateDoc(userRef, {
          wishlist: arrayRemove(product.id)
        });
        setIsWishlisted(false);
      } else {
        // Tambahkan ke wishlist
        await updateDoc(userRef, {
          wishlist: arrayUnion(product.id)
        });
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Error updating wishlist: ", error);
    }
  };

  return (
    <Card
      component={Link} // <--- Estetika: Membuat seluruh Card bisa diklik sebagai link
      to={`/product/${product.id}`} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: 3, 
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        textDecoration: 'none', 
        color: 'inherit', 
        position: 'relative',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', // <--- Estetika: Transisi hover
        '&:hover': {
          transform: 'translateY(-5px)', // <--- Estetika: Efek angkat saat hover
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)', // <--- Estetika: Shadow lebih menonjol saat hover
        }
      }}
    >
      {/* Tombol Wishlist */}
      <IconButton 
        onClick={handleToggleWishlist}
        sx={{ 
          position: 'absolute', top: 8, right: 8, zIndex: 1, 
          backgroundColor: 'rgba(255,255,255,0.7)', 
          backdropFilter: 'blur(2px)', // <--- Estetika: Efek blur pada background icon
          borderRadius: '50%',
          p: '6px', // Padding ikon
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.9)',
          }
        }}
      >
        {isWishlisted ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon sx={{ color: 'text.secondary' }} />} {/* <--- Estetika: Warna default ikon wishlist */}
      </IconButton>

      {/* Gambar Produk */}
      <CardMedia
        component="img"
        sx={{ 
            aspectRatio: '1 / 1', 
            objectFit: 'cover',
            borderTopLeftRadius: 'inherit', // Mengikuti radius Card
            borderTopRightRadius: 'inherit', // Mengikuti radius Card
        }}
        image={product.imageUrl}
        alt={product.name}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2 }}> {/* <--- Estetika: Padding content */}
        <Typography gutterBottom variant="h6" component="h2" 
            sx={{ 
                fontWeight: 'bold', 
                fontSize: { xs: '1rem', sm: '1.1rem' }, // <--- Responsif: Ukuran font judul produk
                lineHeight: 1.3,
                maxHeight: '2.6em', // Batasi tinggi teks agar tidak tumpang tindih
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2, // Batasi 2 baris
                WebkitBoxOrient: 'vertical',
            }}
        >
          {product.name}
        </Typography>
        <Typography variant="body1" color="text.primary" sx={{ fontWeight: 'bold', mt: 1 }}> {/* <--- Estetika: Harga lebih tebal */}
          Rp {product.price.toLocaleString('id-ID')}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ProductCard;