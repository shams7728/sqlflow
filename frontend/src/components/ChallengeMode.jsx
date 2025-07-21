import React from 'react';
import { Box, Typography, Divider, useMediaQuery, useTheme } from '@mui/material';
import ChallengeStep from './ChallengeStep';
import { useProgress } from '../context/ProgressContext';

export default function ChallengeMode({ lesson }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { completedChallenges = {}, completeChallengeStep } = useProgress();

  if (!lesson.challenges || lesson.challenges.length === 0) return null;

  return (
    <Box sx={{ mt: isMobile ? 4 : 6 }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          fontSize: isMobile ? '1.25rem' : '1.5rem',
          mb: isMobile ? 2 : 3
        }}
      >
      </Typography>

      {lesson.challenges.map((challenge) => (
        <Box key={challenge.id} sx={{ mt: isMobile ? 3 : 4 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              fontSize: isMobile ? '1.1rem' : '1.25rem',
              fontWeight: 600
            }}
          >
            {challenge.title}
          </Typography>

          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? 2 : 3
          }}>
            {challenge.steps.map((step) => (
              <ChallengeStep
                key={step.stepId}
                step={{ ...step, lessonId: lesson.id }}
                onCompleted={completeChallengeStep}
                completed={!!completedChallenges[step.stepId]}
              />
            ))}
          </Box>

          <Divider 
            sx={{ 
              mt: isMobile ? 2 : 3, 
              mb: isMobile ? 3 : 4,
              borderColor: 'divider'
            }} 
          />
        </Box>
      ))}
    </Box>
  );
}