import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { Code, TableChart } from '@mui/icons-material';
import GlossarySidebar from './GlossarySidebar';
import sqlInterviewData from '../data/sqlInterviewData.json';

const SQLInterviewPreparation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const renderAnswerContent = (content) => {
    if (!content) return null;
    
    if (typeof content === 'string') {
      return content.split('\n').map((paragraph, index) => (
        <Typography key={index} variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
          {paragraph}
        </Typography>
      ));
    }
    
    if (typeof content === 'object' && !Array.isArray(content)) {
      return Object.entries(content).map(([key, value]) => (
        <Box key={key} sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: '500' }}>{key}:</Typography>
          {renderAnswerContent(value)}
        </Box>
      ));
    }
    
    return null;
  };

  const renderExample = (example) => {
    if (!example) return null;
    
    if (typeof example === 'string') {
      return (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 3 }}>
            <Code color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>
              Example
            </Typography>
          </Box>
          <Paper 
            sx={{ 
              p: 2, 
              mb: 3,
              bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
              borderRadius: 1,
              overflowX: 'auto'
            }}
          >
            <code style={{ 
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark
            }}>
              {example}
            </code>
          </Paper>
        </>
      );
    }

    if (typeof example === 'object') {
      return (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 3 }}>
            <Code color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>
              Example
            </Typography>
          </Box>
          {Object.entries(example).map(([key, value]) => (
            <Box key={key} sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: '500' }}>{key}:</Typography>
              <Paper 
                sx={{ 
                  p: 2,
                  mt: 1,
                  bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
                  borderRadius: 1,
                  overflowX: 'auto'
                }}
              >
                <code style={{ 
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                  color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark
                }}>
                  {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                </code>
              </Paper>
            </Box>
          ))}
        </>
      );
    }

    return null;
  };

  const renderTable = (tableData) => {
    if (!tableData || !Array.isArray(tableData)) return null;
    
    const headers = tableData[0] || [];
    const rows = tableData.slice(1) || [];

    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 3 }}>
          <TableChart color="primary" sx={{ mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>
            Comparison
          </Typography>
        </Box>
        <TableContainer 
          component={Paper}
          sx={{ 
            mb: 3,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1
          }}
        >
          <Table>
            <TableHead sx={{ 
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText
            }}>
              <TableRow>
                {headers.map((header) => (
                  <TableCell 
                    key={header}
                    sx={{ 
                      fontWeight: '500',
                      color: 'inherit'
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow 
                  key={index}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    bgcolor: index % 2 === 0 ? 'inherit' : theme.palette.action.hover
                  }}
                >
                  {row.map((cell, cellIndex) => (
                    <TableCell key={`${index}-${cellIndex}`}>
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  const renderDifferences = (differences) => {
    if (!differences) return null;
    
    if (Array.isArray(differences)) {
      return renderTable(differences);
    }
    
    if (typeof differences === 'object' && differences.table) {
      return renderTable(differences.table);
    }
    
    return null;
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row', 
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default
    }}>
      {/* Sidebar */}
      <Box sx={{ 
        width: isMobile ? '100%' : '350px',
        borderRight: isMobile ? 'none' : `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        boxShadow: isMobile ? 'none' : theme.shadows[2],
        overflowY: 'auto',
        maxHeight: isMobile ? '40vh' : '100vh'
      }}>
        <Typography variant="h5" sx={{ 
          p: 3, 
          fontWeight: 'bold',
          color: theme.palette.primary.main,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          SQL Interview Prep
        </Typography>
        
        <GlossarySidebar 
          categories={sqlInterviewData.categories} 
          onQuestionSelect={setSelectedQuestion}
          selectedQuestionId={selectedQuestion?.id}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        p: isMobile ? 2 : 4,
        bgcolor: 'background.default',
        overflowY: 'auto',
        maxHeight: isMobile ? '60vh' : '100vh'
      }}>
        {selectedQuestion ? (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: theme.shadows[2]
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip 
                label={sqlInterviewData.categories.find(c => 
                  c.questions.some(q => q.id === selectedQuestion.id))?.name}
                color="primary"
                size="small"
                sx={{ mr: 1 }}
              />
              <Typography variant="h5" sx={{ fontWeight: '600' }}>
                {selectedQuestion.question}
              </Typography>
            </Box>

            {renderAnswerContent(selectedQuestion.answer)}
            {renderDifferences(selectedQuestion.differences)}
            {renderExample(selectedQuestion.example)}
          </Paper>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '70vh',
            textAlign: 'center'
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
              👈 Select a question from the sidebar
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Browse through SQL interview questions by category
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SQLInterviewPreparation;