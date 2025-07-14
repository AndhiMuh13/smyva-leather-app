// src/pages/PrivacyPolicyPage.jsx
import React from 'react';
import { 
  Box, Container, Typography, 
  List, ListItem, ListItemText, 
  Divider, 
  useTheme, useMediaQuery 
} from '@mui/material';

function PrivacyPolicyPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="md" sx={{ my: { xs: 4, md: 8 } }}>
      <Typography 
        variant="h4" 
        component="h1" 
        fontWeight="bold" 
        gutterBottom 
        sx={{ 
          textAlign: 'center', 
          mb: { xs: 3, md: 6 }, 
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          color: theme.palette.text.primary 
        }}
      >
        Privacy Policy
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          lineHeight: 1.7, 
          mb: { xs: 3, md: 4 }, 
          fontSize: { xs: '0.9rem', sm: '1rem' },
          color: theme.palette.text.secondary
        }}
      >
        This Privacy Policy describes how SMYVA LEATHER collects, uses, and discloses your Personal Information when you visit or make a purchase from our website.
      </Typography>

      {[
        { 
          title: "Informasi yang Kami Kumpulkan", 
          content: (
            <React.Fragment>
              When you visit the Site, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support.
              <List sx={{ px: { xs: 1, md: 2 } }}>
                <ListItem sx={{ py: 0.5 }}><ListItemText primary={<Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, color: theme.palette.text.secondary }}>• Device Information: Browser version, IP address, time zone, cookie information.</Typography>} /></ListItem>
                <ListItem sx={{ py: 0.5 }}><ListItemText primary={<Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' }, color: theme.palette.text.secondary }}>• Order Information: Name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number.</Typography>} /></ListItem>
              </List>
            </React.Fragment>
          )
        },
        { 
          title: "Bagaimana Kami Menggunakan Informasi Anda", 
          content: "We use your personal information to fulfill any orders placed through the Site, communicate with you, and if in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services." 
        },
        { 
          title: "Pembagian Informasi Pribadi Anda", 
          content: "We share your personal information with service providers to help us provide our services and fulfill our contracts with you, such as payment processors." 
        },
        { 
          title: "Hak-hak Anda", 
          content: "If you are a resident of Europe, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below." 
        },
      ].map((section, index) => (
        <React.Fragment key={index}>
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            mt={{ xs: 4, md: 5 }} 
            mb={{ xs: 1.5, md: 2.5 }}
            sx={{ color: theme.palette.primary.main }}
          >
            {section.title}
          </Typography>
          {typeof section.content === 'string' ? (
            <Typography 
              variant="body1" 
              sx={{ 
                lineHeight: 1.7, 
                fontSize: { xs: '0.9rem', sm: '1rem' },
                color: theme.palette.text.secondary
              }}
            >
              {section.content}
            </Typography>
          ) : (
            <Box>{section.content}</Box> // Render React fragment for list content
          )}
          {index < 3 && <Divider sx={{ my: { xs: 3, md: 5 } }} />} {/* Divider between sections */}
        </React.Fragment>
      ))}
    </Container>
  );
}

export default PrivacyPolicyPage;