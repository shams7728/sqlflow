import React, { useState } from 'react';
import {
  Box, Typography, Button, Collapse, Paper, Table, TableContainer,
  TableHead, TableRow, TableCell, TableBody, Grid, Tooltip, IconButton
} from '@mui/material';
import { LightbulbOutlined as HintIcon } from '@mui/icons-material';
import { useProgress } from '../context/ProgressContext'; // Assuming you'll add useHint here later

// A reusable component to render a results table
const ResultsTable = ({ title, data, columns }) => (
  <Box>
    <Typography variant="subtitle2" gutterBottom>{title}</Typography>
    {data.length === 0 ? (
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>No rows returned.</Typography>
    ) : (
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map(col => <TableCell key={col} sx={{ fontWeight: 'bold' }}>{col}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                {columns.map(col => <TableCell key={col}>{String(row[col])}</TableCell>)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </Box>
);

export default function PracticeExercise({ exercise, lessonId, onCompleted, completed }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  // const { useHint } = useProgress(); // Placeholder for XP penalty

  const validate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, exerciseId: exercise.id, query: input })
      });
      const data = await response.json();
      setResult(data);
      if (data.valid) {
        onCompleted(exercise.id);
      }
    } catch (err) {
      setResult({ valid: false, message: 'Validation failed. Could not connect to the server.' });
    } finally {
      setLoading(false);
    }
  };

  const handleShowHint = () => {
    setShowHint(true);
    // if (!showHint) {
    //   useHint(exercise.id); // Call this to apply XP penalty
    // }
  };

  const userResultColumns = result?.userResult?.length > 0 ? Object.keys(result.userResult[0]) : [];
  const correctResultColumns = result?.correctResult?.length > 0 ? Object.keys(result.correctResult[0]) : [];

  return (
    <Paper sx={{ p: 2, border: '1px solid #ddd', mt: 2, borderRadius: 2 }} variant="outlined">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{exercise.challenge}</Typography>
        {exercise.hint && (
          <Tooltip title="Show Hint">
            <IconButton onClick={handleShowHint} size="small">
              <HintIcon color={showHint ? 'warning.main' : 'action'} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Collapse in={showHint}>
        <Paper sx={{ p: 1.5, my: 1.5, bgcolor: 'action.hover' }} variant="outlined">
          <Typography variant="body2" color="text.secondary">
            <strong>Hint:</strong> {exercise.hint}
          </Typography>
        </Paper>
      </Collapse>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Write your SQL query here..."
        disabled={completed}
        style={{ width: '100%', minHeight: '100px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc', padding: '8px', fontFamily: 'monospace' }}
      />
      
      {!completed && (
        <Button
          variant="contained"
          onClick={validate}
          disabled={loading || !input.trim()}
        >
          {loading ? 'Validating...' : 'Check Answer'}
        </Button>
      )}

      {completed && (
         <Typography sx={{ mt: 2, fontWeight: 'bold' }} color="success.main">
            ✅ Correct! You have completed this exercise.
         </Typography>
      )}

      <Collapse in={!!result && !result.valid}>
        <Box sx={{ mt: 3 }}>
          <Typography
            sx={{ mb: 2, fontWeight: 'bold' }}
            color={result?.valid ? 'success.main' : 'error.main'}
          >
            {result?.message}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <ResultsTable title="Your Output" data={result?.userResult || []} columns={userResultColumns} />
            </Grid>
            <Grid item xs={12} md={6}>
              <ResultsTable title="Expected Output" data={result?.correctResult || []} columns={correctResultColumns} />
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
}
