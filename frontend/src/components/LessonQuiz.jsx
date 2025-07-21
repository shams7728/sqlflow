import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import QuizQuestion from './QuizQuestion';
import { useProgress } from '../context/ProgressContext';

export default function LessonQuiz({ lesson }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { completedQuizzes = {}, completeQuiz } = useProgress();

  if (!lesson.quiz || !Array.isArray(lesson.quiz) || lesson.quiz.length === 0) {
    return null;
  }

  return (
    <Box sx={{ 
      mt: isMobile ? 3 : 5,
      '& > *:not(:last-child)': {
        mb: isMobile ? 2 : 3
      }
    }}>
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
      
      {lesson.quiz.map((question, i) => (
        <QuizQuestion
          key={question?.id || i}
          question={question}
          onAnswer={completeQuiz}
          answered={!!completedQuizzes[question?.id]}
        />
      ))}
    </Box>
  );
}