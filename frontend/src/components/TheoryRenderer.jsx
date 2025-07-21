import React from 'react';
import { 
  Box, Typography, List, ListItem, ListItemIcon, 
  ListItemText, Paper, useMediaQuery, useTheme 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const renderQAList = (text) => {
  const qaBlocks = text.split(/\n(?=\d+\.\s)/).filter(Boolean);

  return (
    <Box sx={{ mt: 2 }}>
      {qaBlocks.map((block, index) => {
        const lines = block.trim().split('\n');
        const questionLine = lines[0] || '';
        const answerLines = lines.slice(1).join(' ').trim();
        const questionMatch = questionLine.match(/^(\d+\.\s)(.*?\?)\s?(.*)?$/);

        const questionNumber = questionMatch?.[1] || '';
        const questionText = questionMatch?.[2] || '';
        const inlineAnswer = questionMatch?.[3] || '';

        return (
          <Paper 
            key={index} 
            variant="outlined" 
            sx={{ 
              p: { xs: 1.5, sm: 2 },
              mb: 2, 
              borderRadius: 2 
            }}
          >
            <Typography 
              variant="subtitle1" 
              fontWeight={600} 
              gutterBottom
              sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
            >
              {questionNumber} {questionText}
            </Typography>
            {inlineAnswer && (
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: answerLines ? 1 : 0,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                {inlineAnswer}
              </Typography>
            )}
            {answerLines && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
              >
                {answerLines}
              </Typography>
            )}
          </Paper>
        );
      })}
    </Box>
  );
};

const TheoryRenderer = ({ theory }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ '& > *:not(:last-child)': { mb: 3 } }}>
      {theory.map((block, i) => {
        if (block.type === 'paragraph') {
          const qaList = renderQAList(block.text);
          if (qaList) return <Box key={i}>{qaList}</Box>;

          return (
            <Typography 
              key={i} 
              paragraph
              sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
            >
              {block.text}
            </Typography>
          );
        }

        if (block.type === 'code') {
          return (
            <Box 
              key={i} 
              sx={{ 
                bgcolor: 'background.default',
                p: 2, 
                borderRadius: 2, 
                my: 2,
                overflowX: 'auto'
              }}
            >
              <Box 
                component="pre" 
                sx={{ 
                  margin: 0,
                  fontFamily: 'monospace',
                  fontSize: { xs: '0.8rem', sm: '0.9rem' }
                }}
              >
                <code>{block.text}</code>
              </Box>
            </Box>
          );
        }

        if (block.type === 'note') {
          return (
            <Box
              key={i}
              sx={{
                p: 2,
                my: 2,
                bgcolor: 'warning.light',
                border: `1px solid ${theme.palette.warning.main}`,
                borderRadius: 2
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'warning.dark',
                  fontSize: { xs: '0.85rem', sm: '0.9rem' }
                }}
              >
                💡 {block.text}
              </Typography>
            </Box>
          );
        }

        if (block.type === 'table') {
          return (
            <Box
              key={i}
              sx={{
                width: '100%',
                overflowX: 'auto',
                my: 3
              }}
            >
              <Box
                component="table"
                sx={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  minWidth: isMobile ? '600px' : '100%',
                  '& th, & td': {
                    border: `1px solid ${theme.palette.divider}`,
                    p: { xs: '8px', sm: '12px' },
                    textAlign: 'left',
                    fontSize: { xs: '0.8rem', sm: '0.9rem' }
                  },
                  '& th': {
                    backgroundColor: 'background.default',
                    fontWeight: 'bold'
                  }
                }}
              >
                <thead>
                  <tr>
                    {block.columns.map((col, idx) => (
                      <th key={idx}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, ridx) => (
                    <tr key={ridx}>
                      {row.map((cell, cidx) => (
                        <td key={cidx}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Box>
            </Box>
          );
        }

        if (block.type === 'images') {
          return (
            <Box
              key={i}
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr 1fr'
                },
                gap: { xs: 2, sm: 3 },
                my: 3
              }}
            >
              {block.images.map((img, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <Box
                    component="img"
                    src={img.src}
                    alt={img.alt || `Diagram ${idx + 1}`}
                    sx={{
                      width: '100%',
                      maxWidth: 300,
                      height: 'auto',
                      borderRadius: 2,
                      boxShadow: 3,
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': { transform: 'scale(1.03)' }
                    }}
                  />
                  {img.caption && (
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        fontStyle: 'italic',
                        color: 'text.secondary',
                        textAlign: 'center',
                        fontSize: { xs: '0.75rem', sm: '0.8rem' }
                      }}
                    >
                      {img.caption}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          );
        }

        if (block.type === 'image') {
          return (
            <Box
              key={i}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                my: 3
              }}
            >
              <Box
                component="img"
                src={block.src}
                alt={block.alt || 'Image'}
                sx={{
                  maxWidth: '100%',
                  width: { xs: '100%', sm: '80%' },
                  maxHeight: 400,
                  borderRadius: 2,
                  boxShadow: 3,
                  objectFit: 'contain'
                }}
              />
            </Box>
          );
        }
        
        return null;
      })}
    </Box>
  );
};

export default TheoryRenderer;