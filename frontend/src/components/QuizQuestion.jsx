import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Collapse,
  useMediaQuery,
  useTheme
} from '@mui/material';

export default function QuizQuestion({ question, onAnswer, answered }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!question || typeof question !== 'object' || !question.question || !question.type) {
    return (
      <Box sx={{ 
        p: 2, 
        mb: 2, 
        border: '1px solid', 
        borderColor: 'error.main', 
        borderRadius: 1 
      }}>
        <Typography color="error.main">⚠️ Invalid quiz question format</Typography>
      </Box>
    );
  }

  const handleSubmit = () => {
    if (submitted || answered) return;

    let correct = false;

    if (question.type === 'mcq' || question.type === 'fill') {
      correct =
        input.trim().toLowerCase() ===
        question.answer.toString().trim().toLowerCase();
    } else if (question.type === 'truefalse') {
      correct = (input === 'true') === Boolean(question.answer);
    }

    setIsCorrect(correct);
    setSubmitted(true);
    if (correct) onAnswer(question.id);
  };

  return (
    <Box sx={{ 
      mb: 3, 
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
          fontWeight: 600,
          fontSize: isMobile ? '1rem' : '1.1rem'
        }}
      >
        {question.question}
      </Typography>

      {/* MCQ Option */}
      {question.type === 'mcq' && Array.isArray(question.options) && (
        <RadioGroup value={input} onChange={(e) => setInput(e.target.value)}>
          {question.options.map((opt, idx) => (
            <FormControlLabel
              key={idx}
              value={opt}
              control={<Radio size={isMobile ? 'small' : 'medium'} />}
              label={
                <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  {opt}
                </Typography>
              }
              disabled={submitted || answered}
              sx={{
                '& .MuiFormControlLabel-label': {
                  mt: isMobile ? 0.5 : 0
                }
              }}
            />
          ))}
        </RadioGroup>
      )}

      {/* Fill in the blank */}
      {question.type === 'fill' && (
        <TextField
          fullWidth
          disabled={submitted || answered}
          placeholder="Type your answer"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{ mt: 1 }}
          size={isMobile ? 'small' : 'medium'}
          InputProps={{
            sx: {
              fontSize: isMobile ? '0.9rem' : '1rem'
            }
          }}
        />
      )}

      {/* True / False */}
      {question.type === 'truefalse' && (
        <RadioGroup value={input} onChange={(e) => setInput(e.target.value)}>
          <FormControlLabel
            value="true"
            control={<Radio size={isMobile ? 'small' : 'medium'} />}
            label={
              <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                True
              </Typography>
            }
            disabled={submitted || answered}
          />
          <FormControlLabel
            value="false"
            control={<Radio size={isMobile ? 'small' : 'medium'} />}
            label={
              <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                False
              </Typography>
            }
            disabled={submitted || answered}
          />
        </RadioGroup>
      )}

      {/* Submit */}
      {!answered && !submitted && (
        <Button
          variant="contained"
          sx={{ 
            mt: 2,
            py: isMobile ? 0.75 : 1,
            px: isMobile ? 1.5 : 2,
            fontSize: isMobile ? '0.9rem' : '1rem'
          }}
          onClick={handleSubmit}
          disabled={!input.trim()}
          fullWidth={isMobile}
        >
          Submit
        </Button>
      )}

      {/* Feedback */}
      {(submitted || answered) && (
        <Collapse in={true}>
          {isCorrect || answered ? (
            <Typography 
              sx={{ 
                mt: 2,
                fontSize: isMobile ? '0.9rem' : '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }} 
              color="success.main"
            >
              ✅ Correct!
            </Typography>
          ) : (
            <Typography 
              sx={{ 
                mt: 2,
                fontSize: isMobile ? '0.9rem' : '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }} 
              color="error.main"
            >
              ❌ Incorrect. The correct answer is: <strong>{question.answer.toString()}</strong>
            </Typography>
          )}
        </Collapse>
      )}
    </Box>
  );
}