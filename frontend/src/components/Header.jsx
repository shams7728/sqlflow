import React from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: { xs: 1.5, sm: 2.5 },
        py: 0.75,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        position: 'sticky',
        top: 0,
        zIndex: theme.zIndex.appBar,
        width: '100%',
        minHeight: '48px'
      }}
    >
      {/* Logo and Title */}
      <Box
        onClick={() => navigate('/dashboard')}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          minWidth: 0,
          flexShrink: 1,
          overflow: 'hidden'
        }}
      >
        <img
          src="/assests/logosql-removebg-preview.png"
          alt="SQL-Flow Logo"
          style={{
            width: isSmallScreen ? '28px' : '40px',
            height: 'auto',
            flexShrink: 0
          }}
        />
        {!isSmallScreen && (
          <Typography
            variant="h6"
            noWrap
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 600,
              fontSize: '1rem',
              ml: 0.5
            }}
          >
            SQL-Flow
          </Typography>
        )}
      </Box>

      {/* Action Icons */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexShrink: 0
        }}
      >
        <ThemeToggle />
        <Tooltip title="Logout">
          <IconButton
            onClick={handleLogout}
            size="small"
            sx={{
              p: 0.75,
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
