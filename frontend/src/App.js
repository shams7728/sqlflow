import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress, useMediaQuery, useTheme, IconButton, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LessonSidebar from './components/LessonSidebar';
import { ProgressProvider } from './context/ProgressContext';
import LessonPage from './components/LessonPage';
import DashboardPage from './components/DashboardPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import GlossaryPage from './components/GlossaryPage';
import SQLInterviewPreparation from './components/SQLInterviewPreparation';
import HelpFab from './components/HelpFab';

const ProtectedRoute = () => {
  const { isAuthenticated, loading, isGuest } = useAuth();
  
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>;
  }
  
  return isAuthenticated || isGuest ? <Outlet /> : <Navigate to="/login" />;
};

export default function App() {
  const [lessons, setLessons] = useState([]);
  const { loading: authLoading, isAuthenticated, user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchLessons = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/lessons`);
          const data = await response.json();
          setLessons(data);
        } catch (error) {
          console.error('❌ Failed to load lessons:', error);
        }
      };
      fetchLessons();
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>;
  }

  const AuthenticatedLayout = () => (
    <ProgressProvider lessons={lessons}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        minHeight: '100vh',
        bgcolor: 'background.default',
        position: 'relative'
      }}>
        {/* Mobile Header */}
        {isMobile && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1,
            bgcolor: 'background.paper',
            borderBottom: `1px solid ${theme.palette.divider}`,
            zIndex: theme.zIndex.appBar
          }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Header mobile />
          </Box>
        )}
  
        {/* Sidebar Drawer */}
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: 270,
              boxSizing: 'border-box',
              position: 'relative',
              height: '100vh',
              [theme.breakpoints.down('md')]: {
                position: 'fixed',
                zIndex: theme.zIndex.drawer
              }
            },
          }}
        >
          <LessonSidebar 
            lessons={lessons} 
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
          />
        </Drawer>
  
        {/* Main + Footer Container */}
        <Box sx={{ 
          flexGrow: 1,
          width: { md: `calc(100% - 270px)` },
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}>
          {/* Desktop Header */}
          {!isMobile && <Header />}
  
          {/* Main Content */}
          <Box component="main" sx={{
            flex: 1,
            p: { xs: 2, md: 3 },
            overflowY: 'auto',
            bgcolor: 'background.paper',
            borderRadius: { xs: 0, md: 2 },
            m: { xs: 0, md: 2 },
            mt: { xs: 0, md: 0 }
          }}>
            <Outlet />
          </Box>
  
          {/* Footer Stays Below */}
          <Footer />
        </Box>
  
        {/* Floating Help Button */}
        <HelpFab />
      </Box>
    </ProgressProvider>
  );
  

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default'
    }}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<AuthenticatedLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage lessons={lessons} />} />
            <Route path="/lesson/:id" element={<LessonPage lessons={lessons} />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="/sql-interview-preparation" element={<SQLInterviewPreparation />} />
          </Route>
        </Route>
      </Routes>
    </Box>
  );
}