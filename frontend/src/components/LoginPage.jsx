import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Alert, Divider,
  Fade, Slide, Zoom, useTheme, useMediaQuery, Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import {
  AuthContainer,
  AuthIllustration,
  AuthFormContainer,
  AuthLogo
} from './AuthLayout';

const AnimatedButton = styled(Button)(({ theme }) => ({
  transition: 'all 0.3s ease',
  fontWeight: 600,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, setGuestMode } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Failed to log in.');
    }
  };

  const handleGuestMode = () => {
    setGuestMode();
    navigate('/dashboard');
  };

  return (
    <AuthContainer>
      <AuthIllustration>
        <Slide in direction={isMobile ? 'down' : 'right'} timeout={500}>
          <Box sx={{ maxWidth: 500, textAlign: 'center', px: isMobile ? 2 : 0 }}>
            <AuthLogo isMobile={isMobile} />
            <Typography variant={isMobile ? 'h4' : 'h3'} gutterBottom sx={{ fontWeight: 700 }}>
              Welcome
            </Typography>
            <Typography variant={isMobile ? 'body1' : 'h6'} sx={{ mb: 3 }}>
              Master SQL with interactive lessons and real-world challenges
            </Typography>
            {!isMobile && (
              <Typography>
                Learn by doing — track progress, earn badges, and prepare for interviews.
              </Typography>
            )}
          </Box>
        </Slide>
      </AuthIllustration>

      <AuthFormContainer>
        <Paper elevation={6} sx={{
          width: '100%',
          maxWidth: 420,
          px: isMobile ? 3 : 4,
          py: isMobile ? 3 : 5,
          borderRadius: 3,
          backdropFilter: 'blur(8px)',
          background: theme.palette.mode === 'light' 
            ? 'rgba(255, 255, 255, 0.85)' 
            : 'rgba(30, 30, 30, 0.75)'
        }}>
          <Fade in timeout={800}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                Sign In
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Continue your SQL learning journey
              </Typography>

              {error && (
                <Zoom in>
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                </Zoom>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 2 }}
                  variant="outlined"
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mb: 3 }}
                  variant="outlined"
                />
                <AnimatedButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                >
                  Login
                </AnimatedButton>
              </Box>

              <Divider sx={{ my: 3 }}>OR</Divider>

              <AnimatedButton
                variant="outlined"
                fullWidth
                size="large"
                onClick={handleGuestMode}
              >
                Continue without signing in
              </AnimatedButton>

              <Typography sx={{ mt: 3, textAlign: 'center', fontSize: '0.95rem' }}>
                Don’t have an account?{' '}
                <RouterLink to="/register" style={{ textDecoration: 'none', fontWeight: 600 }}>
                  Sign up here
                </RouterLink>
              </Typography>
            </Box>
          </Fade>
        </Paper>
      </AuthFormContainer>
    </AuthContainer>
  );
}
