// This file defines all possible achievements in the platform.
// The `condition` function for each achievement takes the user's progress object
// and the list of all lessons, and returns true if the achievement is earned.

export const achievementsList = [
    {
      id: 'first_step',
      title: 'First Step',
      description: 'Complete your first practice exercise.',
      icon: '🚀',
      condition: (progress) => Object.keys(progress.completedExercises).length >= 1,
    },
    {
      id: 'quiz_master_1',
      title: 'Quiz Whiz',
      description: 'Correctly answer your first quiz question.',
      icon: '🧠',
      condition: (progress) => Object.keys(progress.completedQuizzes).length >= 1,
    },
    {
      id: 'level_3',
      title: 'Level 3 Reached',
      description: 'Reach learning level 3.',
      icon: '🥉',
      condition: (progress) => progress.level >= 3,
    },
    {
      id: 'join_master',
      title: 'Join Master',
      description: 'Complete the "INNER JOIN" lesson.',
      icon: '🔗',
      condition: (progress, lessons) => {
          const joinLesson = lessons.find(l => l.id === 'inner-join');
          if (!joinLesson || !joinLesson.practice) return false;
          return joinLesson.practice.every(p => progress.completedExercises[p.id]);
      }
    },
    {
      id: 'streak_3',
      title: 'On a Roll',
      description: 'Maintain a 3-day learning streak.',
      icon: '🔥',
      condition: (progress) => progress.streak >= 3,
    },
    {
      id: 'level_5',
      title: 'Level 5 Reached',
      description: 'Reach learning level 5.',
      icon: '🥈',
      condition: (progress) => progress.level >= 5,
    },
    {
      id: 'completionist_1',
      title: 'Topic Completionist',
      description: 'Fully complete all exercises in any single lesson.',
      icon: '🏆',
      condition: (progress, lessons) => {
          return lessons.some(lesson => {
              if (!lesson.practice || lesson.practice.length === 0) return false;
              return lesson.practice.every(p => progress.completedExercises[p.id]);
          });
      }
    },
    {
      id: 'level_10',
      title: 'SQL Star',
      description: 'Reach learning level 10. Impressive!',
      icon: '⭐',
      condition: (progress) => progress.level >= 10,
    },
  ];
  