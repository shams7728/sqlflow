import React from 'react';
import { Box, Typography, LinearProgress, Paper, useMediaQuery, useTheme } from '@mui/material';
import { useProgress } from '../context/ProgressContext';

export default function ProgressDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { xp, level, streak, leveledUp } = useProgress();

  const xpForNextLevel = level * 100;
  const xpForCurrentLevel = (level - 1) * 100;
  const progressInLevel = xp - xpForCurrentLevel;
  const xpToNextLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = (progressInLevel / xpToNextLevel) * 100;

  return (
    <Paper sx={{ 
      p: isMobile ? 2 : 3, 
      mb: 3, 
      border: '1px solid', 
      borderColor: 'divider',
      borderRadius: 2
    }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          fontSize: isMobile ? '1.25rem' : '1.5rem'
        }}
      >
        🎓 Your Learning Progress
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 1 
      }}>
        <Typography 
          variant="h6"
          sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}
        >
          Level {level}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}
        >
          {xp} XP
        </Typography>
      </Box>
      
      <LinearProgress 
        variant="determinate" 
        value={progressPercentage} 
        sx={{ 
          height: 8, 
          borderRadius: 5, 
          mb: 1,
          '& .MuiLinearProgress-bar': {
            borderRadius: 5
          }
        }}
      />
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: 1
      }}>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}
        >
          {xpForNextLevel - xp} XP to next level
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          🔥 {streak} day streak
        </Typography>
      </Box>

      {leveledUp && (
        <Box sx={{ 
          mt: 2, 
          p: isMobile ? 1.5 : 2, 
          bgcolor: 'success.light', 
          borderRadius: 2 
        }}>
          <Typography 
            variant="h6" 
            color="success.dark" 
            sx={{ 
              textAlign: 'center',
              fontSize: isMobile ? '1rem' : '1.25rem'
            }}
          >
            🎉 Level Up! You are now Level {level} 🎉
          </Typography>
        </Box>
      )}
    </Paper>
  );
}