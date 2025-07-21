import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

export const AuthContainer = ({ children }) => (
  <Box sx={{
    display: 'flex',
    minHeight: '100vh',
    flexDirection: { xs: 'column', md: 'row' },
    backgroundColor: 'background.default'
  }}>
    {children}
  </Box>
);

export const AuthIllustration = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box sx={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 4,
      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
      color: theme.palette.primary.contrastText,
      minHeight: isMobile ? '40vh' : '100vh',
      boxShadow: 3
    }}>
      {children}
    </Box>
  );
};

export const AuthFormContainer = ({ children }) => (
  <Box sx={{
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 4,
    minHeight: { xs: '60vh', md: '100vh' }
  }}>
    {children}
  </Box>
);

export const AuthLogo = ({ isMobile }) => (
  <img 
    src="\assests\logosql-removebg-preview.png" 
    alt="SQL-Flow Logo"
    style={{
      width: isMobile ? '80px' : '120px',
      marginBottom: '20px'
    }}
  />
);
