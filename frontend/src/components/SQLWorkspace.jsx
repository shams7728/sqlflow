import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import {
  Box, Typography, Button, CircularProgress,
  Paper, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, useMediaQuery, useTheme
} from '@mui/material';
import PracticeExercise from './PracticeExercise';
import { useProgress } from '../context/ProgressContext';
import LessonQuiz from './LessonQuiz';
import ChallengeMode from './ChallengeMode';
import TheoryRenderer from './TheoryRenderer';
import { motion } from 'framer-motion';

export default function SQLWorkspace({ lesson }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [query, setQuery] = useState(lesson?.starterQuery || '');
  const [results, setResults] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { completeExercise, completedExercises } = useProgress();
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    setQuery(lesson?.starterQuery || '');
    const timer = setTimeout(() => setShowEditor(true), 100);
    return () => {
      clearTimeout(timer);
      setShowEditor(false);
    };
  }, [lesson?.id, lesson?.starterQuery]);

  if (!lesson || typeof lesson !== 'object' || !lesson.id) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="error">
          ⚠️ Lesson not found or improperly loaded.
        </Typography>
      </Box>
    );
  }

  const executeQuery = async () => {
    setLoading(true);
    setError(null);
    setResults([]);
    setColumns([]);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id, query })
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.data);
        setColumns(data.columns);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      {Array.isArray(lesson.theory) && lesson.theory.length > 0 && (
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Typography variant="h5" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            📘 Lesson Explanation
          </Typography>
          <TheoryRenderer theory={lesson.theory} />
        </Box>
      )}

      {'starterQuery' in lesson && showEditor && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            SQL Editor
          </Typography>
          <Box sx={{ 
            height: { xs: '200px', sm: '300px' },
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            overflow: 'hidden'
          }}>
            <Editor
              height="100%"
              language="sql"
              value={query}
              onChange={setQuery}
              options={{ 
                minimap: { enabled: false }, 
                fontSize: isMobile ? 12 : 14,
                lineNumbersMinChars: isMobile ? 3 : 5
              }}
            />
          </Box>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={executeQuery}
            disabled={loading}
            fullWidth={isMobile}
          >
            {loading ? <CircularProgress size={24} /> : 'Run Query'}
          </Button>
        </Box>
      )}

      {error && (
        <Typography sx={{ 
          mt: 2,
          p: 1,
          bgcolor: 'error.light',
          borderRadius: 1,
          fontSize: { xs: '0.875rem', sm: '1rem' }
        }} color="error.main">
          Error: {error}
        </Typography>
      )}

      {columns.length > 0 && (
        <Box sx={{ 
          mt: 3,
          width: '100%',
          overflowX: 'auto'
        }}>
          <TableContainer component={Paper}>
            <Table size="small" sx={{ minWidth: isMobile ? 600 : 'auto' }}>
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={col} sx={{ fontWeight: 'bold' }}>
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((row, i) => (
                  <TableRow key={i}>
                    {columns.map((col) => (
                      <TableCell key={col} sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        whiteSpace: 'nowrap'
                      }}>
                        {row[col]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {Array.isArray(lesson.schema?.tables) && lesson.schema.tables.length > 0 && (
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          sx={{ mt: 4 }}
        >
          <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            📊 Schema
          </Typography>
          {lesson.schema.tables.map((table) => (
            <Box key={table.name} sx={{ 
              mt: 2,
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 1
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Table: {table.name}
              </Typography>
              <Box component="ul" sx={{ 
                pl: 2,
                mt: 1,
                '& li': { 
                  mb: 0.5,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}>
                {table.columns.map((col) => (
                  <li key={col.name}>
                    <Box component="code" sx={{ 
                      fontFamily: 'monospace',
                      bgcolor: 'action.hover',
                      p: 0.5,
                      borderRadius: 0.5
                    }}>
                      {col.name}
                    </Box> - {col.type} {col.constraints ? `(${col.constraints})` : ''}
                  </li>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {Array.isArray(lesson.practice) && lesson.practice.length > 0 && (
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          sx={{ mt: 4 }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            🧪 Practice Exercises
          </Typography>
          {lesson.practice.map((exercise) => (
            <PracticeExercise
              key={exercise.id}
              exercise={exercise}
              lessonId={lesson.id}
              onCompleted={completeExercise}
              completed={!!completedExercises[exercise.id]}
            />
          ))}
        </Box>
      )}

      {Array.isArray(lesson.quiz) && lesson.quiz.length > 0 && (
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          sx={{ mt: 4 }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            🧠 Quiz
          </Typography>
          <LessonQuiz lesson={lesson} />
        </Box>
      )}

      {Array.isArray(lesson.challenges) && lesson.challenges.length > 0 && (
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          sx={{ mt: 4 }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            🎯 Challenge Mode
          </Typography>
          <ChallengeMode lesson={lesson} />
        </Box>
      )}
    </Box>
  );
}