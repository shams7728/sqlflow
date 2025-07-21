import React, { useState } from 'react';
import { 
  Box, Fab, Modal, TextField, Button, 
  Typography, useTheme, useMediaQuery, Snackbar, Alert,
  IconButton, Tooltip, Divider, MenuItem, CircularProgress
} from '@mui/material';
import {
  Help as HelpIcon,
  Report as ReportIcon,
  Send as SendIcon,
  Close as CloseIcon,
  BugReport as BugReportIcon,
  Feedback as FeedbackIcon
} from '@mui/icons-material';
import { api } from '../services/api'; // Import your API service

const HelpFab = () => {
  // State management
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    issueType: 'bug',
    
    
  });
  const [status, setStatus] = useState({
    open: false,
    severity: 'success',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    message: ''
  });
  
  // UI helpers
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {
      email: '',
      message: ''
    };
    
    let isValid = true;
    
    // Validate email format if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Validate message length
    if (!formData.message || formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await api.submitFeedback({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        issueType: formData.issueType
      });

      setStatus({
        open: true,
        severity: 'success',
        message: response.message || 'Thank you! Your feedback has been submitted.'
      });
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        message: '',
        issueType: 'bug',
        pageUrl: window.location.href
      });
      setOpen(false);
      
    } catch (error) {
      let errorMessage = 'Server error occurred. Please try again later.';
      
      // Handle specific error cases
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message && !error.message.includes('<!DOCTYPE html>')) {
        errorMessage = error.message;
      }

      setStatus({
        open: true,
        severity: 'error',
        message: errorMessage
      });
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <Box
        sx={{
          position: 'fixed',
          bottom: isMobile ? 16 : 24,
          right: isMobile ? 16 : 24,
          zIndex: theme.zIndex.speedDial,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        <Tooltip title="Help & Feedback" arrow>
          <Fab
            color="primary"
            aria-label="help"
            onClick={() => {
              setFormData(prev => ({ ...prev, issueType: 'feedback' }));
              setOpen(true);
            }}
            sx={{
              bgcolor: theme.palette.primary.main,
              '&:hover': { bgcolor: theme.palette.primary.dark },
              transition: 'all 0.3s ease'
            }}
          >
            <FeedbackIcon />
          </Fab>
        </Tooltip>
        
        <Tooltip title="Report Bug" arrow>
          <Fab
            color="error"
            aria-label="report"
            onClick={() => {
              setFormData(prev => ({ ...prev, issueType: 'bug' }));
              setOpen(true);
            }}
            sx={{
              bgcolor: theme.palette.error.main,
              '&:hover': { bgcolor: theme.palette.error.dark },
              transition: 'all 0.3s ease'
            }}
          >
            <BugReportIcon />
          </Fab>
        </Tooltip>
      </Box>

      {/* Feedback Modal */}
      <Modal
        open={open}
        onClose={() => !isSubmitting && setOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          backdropFilter: 'blur(2px)'
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            width: isMobile ? '90%' : '450px',
            maxHeight: '90vh',
            overflow: 'auto',
            outline: 'none'
          }}
        >
          {/* Modal Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {formData.issueType === 'bug' ? (
                <><BugReportIcon color="error" /> Report a Bug</>
              ) : (
                <><FeedbackIcon color="primary" /> Send Feedback</>
              )}
            </Typography>
            <IconButton 
              onClick={() => setOpen(false)} 
              disabled={isSubmitting}
              size="small"
              sx={{ color: theme.palette.text.secondary }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          {/* Name Field */}
          <TextField
            label="Your Name (optional)"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            disabled={isSubmitting}
          />
          
          {/* Email Field */}
          <TextField
            label="Your Email (optional)"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            size="small"
            placeholder="For follow-up if needed"
            sx={{ mb: 2 }}
            disabled={isSubmitting}
            error={!!errors.email}
            helperText={errors.email}
            inputProps={{
              autoComplete: 'email'
            }}
          />
          
          {/* Issue Type Selector */}
          <TextField
            select
            label="Type of Report"
            name="issueType"
            value={formData.issueType}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            disabled={isSubmitting}
          >
            <MenuItem value="bug">Bug Report</MenuItem>
            <MenuItem value="feedback">General Feedback</MenuItem>
            <MenuItem value="feature">Feature Request</MenuItem>
            <MenuItem value="ui">UI/UX Suggestion</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
          
          {/* Message Field */}
          <TextField
            label={`Describe the ${formData.issueType === 'bug' ? 'issue' : 'feedback'}`}
            name="message"
            multiline
            minRows={4}
            maxRows={8}
            fullWidth
            variant="outlined"
            value={formData.message}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
            disabled={isSubmitting}
            error={!!errors.message}
            helperText={errors.message}
            inputProps={{
              'aria-label': 'Description of the issue'
            }}
          />
          
          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color={formData.issueType === 'bug' ? 'error' : 'primary'}
            fullWidth
            endIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
            disabled={isSubmitting || !formData.message}
            sx={{ 
              py: 1.5,
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </Box>
      </Modal>

      {/* Status Snackbar */}
      <Snackbar
        open={status.open}
        autoHideDuration={6000}
        onClose={() => setStatus(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ bottom: { xs: 90, sm: 100 } }} // Avoids overlapping with FABs
      >
        <Alert 
          severity={status.severity}
          sx={{ width: '100%' }}
          variant="filled"
          onClose={() => setStatus(prev => ({ ...prev, open: false }))}
          iconMapping={{
            success: <SendIcon fontSize="inherit" />,
            error: <ReportIcon fontSize="inherit" />
          }}
        >
          {status.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default HelpFab;