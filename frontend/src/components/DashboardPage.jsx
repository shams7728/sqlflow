import React from 'react';
import {
  Box, Typography, Grid, Paper, Tooltip,
  useMediaQuery, useTheme, LinearProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import ProgressDashboard from './ProgressDashboard';
import { achievementsList } from '../data/achievements';

const MotionPaper = motion(Paper);

const AchievementBadge = ({ achievement, unlocked }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Tooltip title={achievement.description} arrow>
      <MotionPaper
        whileHover={unlocked ? { scale: 1.05 } : {}}
        elevation={unlocked ? 3 : 1}
        sx={{
          p: isMobile ? 1.5 : 2,
          textAlign: 'center',
          height: '100%',
          minHeight: 120,
          borderRadius: 3,
          bgcolor: unlocked ? 'background.paper' : 'action.hover',
          opacity: unlocked ? 1 : 0.4,
          filter: unlocked ? 'none' : 'grayscale(80%)',
          border: unlocked ? `2px solid ${theme.palette.success.main}` : `1px solid ${theme.palette.divider}`,
          transition: 'all 0.3s ease'
        }}
      >
        <Typography sx={{
          fontSize: isMobile ? '2rem' : '2.5rem',
        }}>
          {achievement.icon}
        </Typography>
        <Typography sx={{
          fontWeight: 'bold',
          mt: 1,
          fontSize: isMobile ? '0.8rem' : '0.9rem'
        }}>
          {achievement.title}
        </Typography>
      </MotionPaper>
    </Tooltip>
  );
};

export default function DashboardPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { unlockedAchievements, xp } = useProgress();

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            fontSize: isMobile ? '1.5rem' : '2rem'
          }}
        >
          🚀 My Dashboard
        </Typography>
      </motion.div>

      {/* Progress Overview */}
      <Box mb={4}>
        <ProgressDashboard />

        <Box mt={3}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Total XP: {xp.current} / {xp.goal}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(xp.current / xp.goal) * 100}
            sx={{ height: 10, borderRadius: 5 }}
            color="primary"
          />
        </Box>
      </Box>

      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            fontSize: isMobile ? '1.25rem' : '1.5rem'
          }}
        >
          🏅 My Achievements
        </Typography>
      </motion.div>

      <Grid container spacing={isMobile ? 1.5 : 2}>
        {achievementsList.map((ach) => (
          <Grid item xs={6} sm={4} md={3} lg={2.4} key={ach.id}>
            <AchievementBadge
              achievement={ach}
              unlocked={!!unlockedAchievements[ach.id]}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
