import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { achievementsList } from '../data/achievements';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const ProgressContext = createContext();

export function ProgressProvider({ children, lessons }) {
    const { isAuthenticated } = useAuth();
    const [progress, setProgress] = useState(null); // Start as null to indicate it's not loaded
    const [leveledUp, setLeveledUp] = useState(false);
    const [newAchievements, setNewAchievements] = useState([]);
    
    // Refs for debouncing and audio playback
    const saveTimeout = useRef();
    const levelUpAudioRef = useRef(null);

    // Effect to fetch progress from the backend when the user logs in
    useEffect(() => {
        if (isAuthenticated) {
            api.fetchProgress()
                .then(data => setProgress(data))
                .catch(err => console.error("Failed to fetch progress", err));
        } else {
            setProgress(null); // Clear progress on logout
        }
    }, [isAuthenticated]);

    // Effect to automatically save progress to the backend after changes
    useEffect(() => {
        // Don't save if progress isn't loaded or user isn't logged in
        if (progress && isAuthenticated) {
            // Debounce the save to avoid spamming the backend on every small change
            if (saveTimeout.current) {
                clearTimeout(saveTimeout.current);
            }
            saveTimeout.current = setTimeout(() => {
                api.saveProgress(progress).catch(err => console.error("Failed to save progress", err));
            }, 1500); // Save 1.5 seconds after the last change
        }
        
        // Cleanup timeout on component unmount
        return () => {
            if (saveTimeout.current) {
                clearTimeout(saveTimeout.current);
            }
        }
    }, [progress, isAuthenticated]);

    // Memoized function to check for new achievements
    const checkAchievements = useCallback((currentProgress) => {
        if (!lessons || lessons.length === 0 || !currentProgress) return {};
        const newlyUnlocked = [];
        achievementsList.forEach(ach => {
            if (!currentProgress.unlockedAchievements[ach.id] && ach.condition(currentProgress, lessons)) {
                newlyUnlocked.push(ach);
            }
        });
        if (newlyUnlocked.length > 0) {
            setNewAchievements(prev => [...prev, ...newlyUnlocked]);
            return newlyUnlocked.reduce((acc, ach) => ({...acc, [ach.id]: true}), {});
        }
        return {};
    }, [lessons]);

    // Memoized function to update the progress state
    const updateProgress = useCallback((updates) => {
        setProgress(currentProgress => {
            if (!currentProgress) return null; // Safety check
            const updatedProgress = {
                ...currentProgress,
                ...updates,
                completedExercises: { ...currentProgress.completedExercises, ...updates.completedExercises },
                completedQuizzes: { ...currentProgress.completedQuizzes, ...updates.completedQuizzes },
                completedChallenges: { ...currentProgress.completedChallenges, ...updates.completedChallenges },
            };
            const unlocked = checkAchievements(updatedProgress);
            updatedProgress.unlockedAchievements = { ...currentProgress.unlockedAchievements, ...unlocked };
            return updatedProgress;
        });
    }, [checkAchievements]);

    // Memoized function to handle level-ups and play sound
    const levelUpCheck = useCallback((gainedXP) => {
        if (!progress) return {};
        const newXP = progress.xp + gainedXP;
        const newLevel = Math.floor(newXP / 100) + 1;
        const leveledUpNow = newLevel > progress.level;
        if (leveledUpNow) {
            setLeveledUp(true);
            if (levelUpAudioRef.current) {
                levelUpAudioRef.current.currentTime = 0;
                levelUpAudioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
            setTimeout(() => setLeveledUp(false), 4000);
        }
        return { newXP, newLevel };
    }, [progress]);

    const completeExercise = useCallback((exerciseId) => {
        if (progress && !progress.completedExercises[exerciseId]) {
            const { newXP, newLevel } = levelUpCheck(20);
            updateProgress({ completedExercises: { [exerciseId]: true }, xp: newXP, level: newLevel });
        }
    }, [progress, levelUpCheck, updateProgress]);

    const completeQuiz = useCallback((quizId) => {
        if (progress && !progress.completedQuizzes[quizId]) {
            const { newXP, newLevel } = levelUpCheck(10);
            updateProgress({ completedQuizzes: { [quizId]: true }, xp: newXP, level: newLevel });
        }
    }, [progress, levelUpCheck, updateProgress]);

    const completeChallengeStep = useCallback((stepId) => {
        if (progress && !progress.completedChallenges[stepId]) {
            const { newXP, newLevel } = levelUpCheck(30);
            updateProgress({ completedChallenges: { [stepId]: true }, xp: newXP, level: newLevel });
        }
    }, [progress, levelUpCheck, updateProgress]);

    const clearNewAchievements = useCallback(() => setNewAchievements([]), []);

    // Memoize the entire context value to prevent unnecessary re-renders of consumer components
    const contextValue = React.useMemo(() => ({
        // Use default empty values if progress is not loaded yet to prevent crashes in consumers
        completedExercises: progress?.completedExercises || {},
        completedQuizzes: progress?.completedQuizzes || {},
        completedChallenges: progress?.completedChallenges || {},
        unlockedAchievements: progress?.unlockedAchievements || {},
        xp: progress?.xp || 0,
        level: progress?.level || 1,
        streak: progress?.streak || 1,
        lastLogin: progress?.lastLogin,
        loading: progress === null, // Provide a loading state for consumers
        completeExercise,
        completeQuiz,
        completeChallengeStep,
        leveledUp,
        newAchievements,
        clearNewAchievements,
    }), [progress, leveledUp, newAchievements, completeExercise, completeQuiz, completeChallengeStep, clearNewAchievements]);

    return (
        <ProgressContext.Provider value={contextValue}>
            {/* Hidden audio player for sound effects */}
            {/* Show a loading spinner while fetching initial progress */}
            {contextValue.loading ? <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}><CircularProgress/></Box> : children}
        </ProgressContext.Provider>
    );
}

export const useProgress = () => useContext(ProgressContext);