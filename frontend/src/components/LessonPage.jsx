// ✅ LessonPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import SQLWorkspace from './SQLWorkspace';

export default function LessonPage({ lessons }) {
  const { id } = useParams();
  const lesson = lessons.find(l => l.id === id);

  if (!lesson) {
    return (
      <Typography color="error" variant="h6">
        ❌ Lesson not found: <code>{id}</code>
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{lesson.title}</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>{lesson.description}</Typography>
      <SQLWorkspace lesson={lesson} />
    </Box>
  );
}
