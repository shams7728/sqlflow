import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Collapse, 
  useMediaQuery, useTheme, CircularProgress
} from '@mui/material';

export default function ChallengeStep({ step, onCompleted, completed }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateStep = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: input,
          lessonId: step.lessonId,
          exerciseId: step.stepId
        })
      }); 
      
      const data = await response.json();
      setResult(data);
      if (data.valid) onCompleted(step.stepId);
    } catch (error) {
      setResult({ valid: false, message: 'Validation failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      mb: isMobile ? 3 : 4, 
      p: isMobile ? 1.5 : 2, 
      border: '1px solid', 
      borderColor: 'divider', 
      borderRadius: 2,
      bgcolor: 'background.paper'
    }}>
      <Typography 
        variant="subtitle1" 
        gutterBottom
        sx={{
          fontSize: isMobile ? '0.95rem' : '1rem',
          fontWeight: 500
        }}
      >
        {step.description}
      </Typography>

      <TextField
        multiline
        fullWidth
        minRows={isMobile ? 2 : 3}
        maxRows={8}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={completed}
        placeholder="Write your SQL here"
        sx={{ 
          mt: 1, 
          mb: 2,
          '& .MuiInputBase-root': {
            fontSize: isMobile ? '0.85rem' : '0.9rem'
          }
        }}
        InputProps={{
          sx: {
            fontFamily: 'monospace'
          }
        }}
      />

      {!completed && (
        <Button
          variant="contained"
          onClick={validateStep}
          disabled={loading || !input.trim()}
          fullWidth={isMobile}
          sx={{
            py: isMobile ? 0.75 : 1,
            fontSize: isMobile ? '0.85rem' : '0.9rem'
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Checking...
            </>
          ) : 'Submit Step'}
        </Button>
      )}

      <Collapse in={!!result}>
        <Typography
          sx={{ 
            mt: 2,
            fontSize: isMobile ? '0.85rem' : '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
          color={result?.valid ? 'success.main' : 'error.main'}
        >
          {result?.valid ? '✅' : '❌'} {result?.message}
        </Typography>
      </Collapse>

      {completed && (
        <Typography 
          sx={{ 
            mt: 2, 
            fontSize: isMobile ? '0.85rem' : '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }} 
          color="success.main"
        >
          ✅ Step Completed
        </Typography>
      )}
    </Box>
  );
}