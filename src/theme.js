// src/theme.js
import { createTheme } from '@mui/material/styles';

// Warna yang diekstrak dari desain SMYVA LEATHER
const smyvaColors = {
  primary: '#6D4C41',   // Coklat tua untuk tombol dan aksen
  secondary: '#A1887F', // Coklat lebih muda
  background: '#FEFDFC',// Latar belakang krem/putih
  text: '#4E342E',      // Warna teks utama
};

export const theme = createTheme({
  palette: {
    primary: {
      main: smyvaColors.primary,
    },
    secondary: {
      main: smyvaColors.secondary,
    },
    background: {
      default: smyvaColors.background,
    },
    text: {
      primary: smyvaColors.text,
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif", // Set font default
    h4: {
      fontWeight: 700, // Contoh: untuk judul "Customers" atau "My Products"
    },
    h5: {
        fontWeight: 700,
    }
  },
  components: {
    // Kustomisasi komponen default agar cocok dengan desain
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Tombol dengan sudut membulat
          textTransform: 'none', // Agar teks tombol tidak kapital semua
          fontWeight: 'bold',
        },
      },
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                borderRadius: 12, // Untuk card dan elemen paper lainnya
            }
        }
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: 8,
                },
            },
        },
    },
  },
});