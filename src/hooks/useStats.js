import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'braindefragger_stats';

const getInitialStats = () => ({
  sessions: [],
  totalMinutes: 0,
  totalSessions: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastSessionDate: null,
});

const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() === d2.toDateString();
};

const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
};

const isToday = (date) => {
  return isSameDay(date, new Date());
};

export default function useStats() {
  const [stats, setStats] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load stats:', e);
    }
    return getInitialStats();
  });

  // Save to localStorage whenever stats change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save stats:', e);
    }
  }, [stats]);

  // Record a completed session
  const recordSession = useCallback((sessionData) => {
    setStats(prev => {
      const now = new Date().toISOString();
      const today = new Date().toDateString();

      // Check if we already had a session today
      const hadSessionToday = prev.lastSessionDate && isToday(prev.lastSessionDate);

      // Calculate streak
      let newStreak = prev.currentStreak;
      if (!hadSessionToday) {
        if (prev.lastSessionDate && isYesterday(prev.lastSessionDate)) {
          // Continuing streak from yesterday
          newStreak = prev.currentStreak + 1;
        } else if (!prev.lastSessionDate || !isToday(prev.lastSessionDate)) {
          // Starting new streak (either first session or gap in days)
          newStreak = prev.lastSessionDate && isYesterday(prev.lastSessionDate)
            ? prev.currentStreak + 1
            : 1;
        }
      }

      const session = {
        id: Date.now(),
        date: now,
        emotion: sessionData.emotion,
        beforeScore: sessionData.beforeScore,
        afterScore: sessionData.afterScore,
        duration: sessionData.duration,
        trackTitle: sessionData.trackTitle,
        improvement: sessionData.beforeScore - sessionData.afterScore,
      };

      return {
        ...prev,
        sessions: [session, ...prev.sessions].slice(0, 100), // Keep last 100 sessions
        totalMinutes: prev.totalMinutes + sessionData.duration,
        totalSessions: prev.totalSessions + 1,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastSessionDate: now,
      };
    });
  }, []);

  // Get sessions for a specific time period
  const getRecentSessions = useCallback((days = 7) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return stats.sessions.filter(s => new Date(s.date) > cutoff);
  }, [stats.sessions]);

  // Calculate average improvement
  const getAverageImprovement = useCallback(() => {
    if (stats.sessions.length === 0) return 0;
    const totalImprovement = stats.sessions.reduce((sum, s) => sum + s.improvement, 0);
    return Math.round((totalImprovement / stats.sessions.length) * 10) / 10;
  }, [stats.sessions]);

  // Get most practiced emotion
  const getMostPracticedEmotion = useCallback(() => {
    if (stats.sessions.length === 0) return null;
    const counts = {};
    stats.sessions.forEach(s => {
      counts[s.emotion] = (counts[s.emotion] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  }, [stats.sessions]);

  // Check if user practiced today
  const hasPracticedToday = useCallback(() => {
    return stats.lastSessionDate && isToday(stats.lastSessionDate);
  }, [stats.lastSessionDate]);

  // Reset all stats (for debugging/user request)
  const resetStats = useCallback(() => {
    setStats(getInitialStats());
  }, []);

  return {
    stats,
    recordSession,
    getRecentSessions,
    getAverageImprovement,
    getMostPracticedEmotion,
    hasPracticedToday,
    resetStats,
  };
}
