import React, { useState, useEffect } from 'react';
import {
  Box, Typography, List, ListItemButton, ListItemText, ListItemIcon,
  Collapse, Chip, LinearProgress, Tooltip, useTheme, Divider, IconButton
} from '@mui/material';
import {
  ExpandLess, ExpandMore, CheckCircleOutline,
  Dashboard as DashboardIcon, MenuBook as GlossaryIcon,
  Close as CloseIcon, Quiz as QuizIcon
} from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import lessonIndex from '../data/lesson-index.json';
import { useMediaQuery } from '@mui/material';

const difficultyColors = {
  'Easy': 'success', 'Beginner': 'success',
  'Intermediate': 'warning', 'Advanced': 'error', 'Hard': 'error',
};

export default function LessonSidebar({ lessons, mobileOpen, handleDrawerToggle }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { completedExercises } = useProgress();
  const { id: currentLessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    const activeSection = lessonIndex.find(section => section.topics.includes(currentLessonId));
    if (activeSection) {
      setOpenSections(prev => ({ ...prev, [activeSection.section]: true }));
    }
  }, [currentLessonId]);

  if (!Array.isArray(lessons)) {
    return (
      <Box sx={{ width: 280, p: 2, borderRight: `1px solid ${theme.palette.divider}` }}>
        <Typography sx={{ mb: 1 }}>Loading Lessons...</Typography>
        <LinearProgress />
      </Box>
    );
  }

  const lessonMap = lessons.reduce((map, lesson) => {
    map[lesson.id] = lesson;
    return map;
  }, {});

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) handleDrawerToggle();
  };

  return (
    <Box
      sx={{
        width: { xs: '100%', md: 270 },
        height: '100%',
        bgcolor: 'background.paper',
        borderRight: { md: `1px solid ${theme.palette.divider}` },
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: `${theme.palette.primary.main} ${theme.palette.background.paper}`,
        '&::-webkit-scrollbar': {
          width: '6px'
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: theme.palette.background.paper
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.primary.main,
          borderRadius: '10px'
        }
      }}
    >
      {isMobile && (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="h6">Menu</Typography>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1 }}>
        <List component="nav">
          <ListItemButton
            selected={location.pathname === '/dashboard' || location.pathname === '/'}
            onClick={() => handleNavigation('/dashboard')}
            sx={{
              borderRadius: 2,
              mb: 1,
              bgcolor: 'rgba(0, 0, 0, 0.04)',
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                '&:hover': { bgcolor: 'primary.light' }
              }
            }}
          >
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="My Dashboard" primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>

          <ListItemButton
            selected={location.pathname === '/glossary'}
            onClick={() => handleNavigation('/glossary')}
            sx={{
              borderRadius: 2,
              mb: 1,
              bgcolor: 'rgba(0, 0, 0, 0.04)',
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                '&:hover': { bgcolor: 'primary.light' }
              }
            }}
          >
            <ListItemIcon><GlossaryIcon /></ListItemIcon>
            <ListItemText primary="Glossary" primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>

          <ListItemButton
            selected={location.pathname === '/sql-interview-preparation'}
            onClick={() => handleNavigation('/sql-interview-preparation')}
            sx={{
              borderRadius: 2,
              mb: 1,
              bgcolor: 'rgba(0, 0, 0, 0.04)',
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                '&:hover': { bgcolor: 'primary.light' }
              }
            }}
          >
            <ListItemIcon><QuizIcon /></ListItemIcon>
            <ListItemText primary="SQL Interview Prep" primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>

          <Divider sx={{ my: 1 }} />

          {lessonIndex.map(section => {
            let totalExercisesInSection = 0;
            let completedExercisesInSection = 0;
            section.topics.forEach(topicId => {
              const lesson = lessonMap[topicId];
              if (lesson?.practice?.length) {
                totalExercisesInSection += lesson.practice.length;
                completedExercisesInSection += lesson.practice.filter(ex => completedExercises[ex.id]).length;
              }
            });

            const progressValue = totalExercisesInSection > 0 ?
              (completedExercisesInSection / totalExercisesInSection) * 100 : 0;

            return (
              <Box key={section.section} sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => toggleSection(section.section)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    px: 2,
                    bgcolor: 'rgba(0, 0, 0, 0.03)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    '&:hover': { bgcolor: theme.palette.action.hover }
                  }}
                >
                  <ListItemText
                    primary={section.section}
                    primaryTypographyProps={{ fontWeight: 600 }}
                    secondary={`${completedExercisesInSection} / ${totalExercisesInSection} exercises`}
                  />
                  {openSections[section.section] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <LinearProgress
                  variant="determinate"
                  value={progressValue}
                  sx={{ mx: 2, mb: 1, height: 6, borderRadius: 3 }}
                />

                <Collapse in={!!openSections[section.section]} timeout={300} unmountOnExit>
                  <List dense disablePadding>
                    {section.topics.map(topicId => {
                      const lesson = lessonMap[topicId];
                      if (!lesson) return null;
                      const practiceCount = lesson.practice?.length || 0;
                      const completedCount = lesson.practice?.reduce((acc, ex) => completedExercises[ex.id] ? acc + 1 : acc, 0);
                      const isFullyCompleted = practiceCount > 0 && completedCount === practiceCount;
                      const isSelected = lesson.id === currentLessonId;

                      return (
                        <ListItemButton
                          key={lesson.id}
                          selected={isSelected}
                          onClick={() => handleNavigation(`/lesson/${lesson.id}`)}
                          sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            pl: 4,
                            bgcolor: isSelected ? 'action.selected' : 'transparent',
                            borderLeft: isSelected ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
                            '&:hover': { bgcolor: theme.palette.action.hover }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            {isFullyCompleted ? <CheckCircleOutline color="success" fontSize="small" /> : <Box sx={{ width: 24 }} />}
                          </ListItemIcon>
                          <ListItemText
                            primary={<Tooltip title={lesson.title}><Typography fontWeight={500} fontSize='0.95rem'>{lesson.title}</Typography></Tooltip>}
                            secondary={
                              <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                                <Chip label={lesson.difficulty} color={difficultyColors[lesson.difficulty] || 'default'} size="small" />
                                {practiceCount > 0 && (
                                  <Typography variant="caption" color="text.secondary">
                                    {completedCount} / {practiceCount} exercises
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}