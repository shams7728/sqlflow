import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  TextField, Button, Alert, Divider,
  Fade, Slide, Zoom, useTheme, useMediaQuery, Box, Typography, CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import {
  AuthContainer,
  AuthIllustration,
  AuthFormContainer,
  AuthLogo
} from './AuthLayout';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, setGuestMode } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    const result = await register(email, password);
    setSubmitting(false);

    if (result.success) {
      toast.success('Welcome! Account created 🎉');
      navigate('/dashboard');
    } else {
      setError(result.message || 'Failed to register.');
    }
  };

  const handleGuestMode = () => {
    toast('Entering guest mode...');
    setGuestMode();
    navigate('/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AuthContainer>
        <AuthIllustration>
          <Slide in direction={isMobile ? "down" : "right"} timeout={500}>
            <Box sx={{
              maxWidth: 500,
              textAlign: 'center',
              px: isMobile ? 2 : 0
            }}>
              <HowToRegIcon sx={{
                fontSize: isMobile ? 60 : 80,
                mb: 2
              }} />
              <Typography variant={isMobile ? "h4" : "h3"} gutterBottom sx={{ fontWeight: 700 }}>
                Join Us Today
              </Typography>
              <Typography variant={isMobile ? "body1" : "h6"} sx={{ mb: 3 }}>
                Start your SQL learning journey with interactive lessons
              </Typography>
              {!isMobile && (
                <Typography variant="body2">
                  Track progress, save work, unlock content — all for free.
                </Typography>
              )}
            </Box>
          </Slide>
        </AuthIllustration>

        <AuthFormContainer>
          <Box sx={{
            width: '100%',
            maxWidth: 400,
            px: isMobile ? 2 : 0,
            boxShadow: theme.shadows[2],
            p: isMobile ? 2 : 3,
            borderRadius: 3,
            bgcolor: 'background.paper'
          }}>
            <Fade in timeout={800}>
              <Box>
                <Typography variant={isMobile ? "h5" : "h4"} component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                  Create Account
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Start mastering SQL today
                </Typography>

                {error && (
                  <Zoom in>
                    <Alert severity="error" sx={{ mb: 2 }}>
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
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                    size={isMobile ? "small" : "medium"}
                  />
                  <TextField
                    label="Password (min 6 characters)"
                    type="password"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 3 }}
                    size={isMobile ? "small" : "medium"}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={submitting}
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      mb: 2,
                      py: isMobile ? 1 : 1.5,
                      fontWeight: 600,
                      textTransform: 'none'
                    }}
                  >
                    {submitting ? <CircularProgress size={24} /> : 'Register'}
                  </Button>
                </Box>

                <Divider sx={{ my: 2 }}>OR</Divider>

                <Button
                  variant="outlined"
                  fullWidth
                  size={isMobile ? "medium" : "large"}
                  onClick={handleGuestMode}
                  sx={{
                    py: isMobile ? 1 : 1.5,
                    fontWeight: 600,
                    textTransform: 'none'
                  }}
                >
                  Continue as Guest
                </Button>

                <Typography sx={{
                  mt: 3,
                  textAlign: 'center',
                  fontSize: isMobile ? '0.9rem' : '1rem'
                }}>
                  Already have an account?{' '}
                  <RouterLink to="/login" style={{
                    textDecoration: 'none',
                    fontWeight: 600,
                    color: theme.palette.primary.main
                  }}>
                    Sign in here
                  </RouterLink>
                </Typography>
              </Box>
            </Fade>
          </Box>
        </AuthFormContainer>
      </AuthContainer>
    </motion.div>
  );
}
