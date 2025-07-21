import React, { useState } from 'react';
import {
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
  Chip,
  useTheme,
  ListItemIcon,
  Typography,
  Box
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  QuestionAnswer
} from '@mui/icons-material';

const GlossarySidebar = ({ categories, onQuestionSelect, selectedQuestionId }) => {
  const theme = useTheme();
  const [openCategories, setOpenCategories] = useState(() => {
    const initialState = {};
    if (categories.length > 0) {
      initialState[categories[0].name] = true;
    }
    return initialState;
  });

  const handleCategoryClick = (categoryName) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  return (
    <List
      component="nav"
      className="custom-scroll"
      sx={{
        width: '100%',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        bgcolor: 'background.paper',
        pr: 1,
        '& .MuiListItemButton-root': {
          borderRadius: 1,
          mx: 1,
        },
        '& .MuiListItemText-primary': {
          fontWeight: 500,
        }
      }}
    >
      {categories.map((category) => (
        <React.Fragment key={category.name}>
          <ListItemButton
            onClick={() => handleCategoryClick(category.name)}
            aria-expanded={openCategories[category.name]}
            aria-controls={`${category.name}-questions`}
            sx={{
              bgcolor: openCategories[category.name] ? theme.palette.action.hover : 'transparent',
              transition: 'all 0.3s ease'
            }}
          >
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="medium">
                  {category.name}
                </Typography>
              }
            />

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip
                label={category.questions.length}
                size="small"
                sx={{
                  mr: 1,
                  bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200',
                  color: theme.palette.text.primary
                }}
              />
              {openCategories[category.name] ? <ExpandLess /> : <ExpandMore />}
            </Box>
          </ListItemButton>

          <Collapse
            in={openCategories[category.name]}
            timeout="auto"
            unmountOnExit
            id={`${category.name}-questions`}
          >
            <List component="div" disablePadding dense>
              {category.questions.map((question) => (
                <ListItemButton
                  key={question.id}
                  onClick={() => onQuestionSelect(question)}
                  selected={selectedQuestionId === question.id}
                  sx={{
                    pl: 4,
                    py: 1.2,
                    borderLeft: selectedQuestionId === question.id
                      ? `3px solid ${theme.palette.primary.main}`
                      : '3px solid transparent',
                    bgcolor: selectedQuestionId === question.id
                      ? theme.palette.action.selected
                      : 'transparent',
                    '&:hover': {
                      bgcolor: theme.palette.action.hover
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <QuestionAnswer fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: selectedQuestionId === question.id ? 500 : 400,
                          color: selectedQuestionId === question.id
                            ? theme.palette.primary.main
                            : theme.palette.text.primary,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '180px'
                        }}
                      >
                        {question.id}. {question.question}
                      </Typography>
                    }
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
          <Divider sx={{ my: 1 }} />
        </React.Fragment>
      ))}
    </List>
  );
};

export default GlossarySidebar;
