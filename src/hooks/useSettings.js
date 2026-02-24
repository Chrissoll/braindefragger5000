import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'mindspo_settings';

const getInitialSettings = () => ({
  theme: 'light', // 'light' or 'dark'
  completedTracks: [], // Track IDs the user has completed
});

export default function useSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
    return getInitialSettings();
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }, [settings]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  const setTheme = useCallback((theme) => {
    setSettings(prev => ({ ...prev, theme }));
  }, []);

  const toggleTheme = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  }, []);

  const markTrackCompleted = useCallback((trackId) => {
    setSettings(prev => ({
      ...prev,
      completedTracks: prev.completedTracks.includes(trackId)
        ? prev.completedTracks
        : [...prev.completedTracks, trackId]
    }));
  }, []);

  const isTrackCompleted = useCallback((trackId) => {
    return settings.completedTracks.includes(trackId);
  }, [settings.completedTracks]);

  const resetSettings = useCallback(() => {
    setSettings(getInitialSettings());
  }, []);

  return {
    settings,
    theme: settings.theme,
    isDarkMode: settings.theme === 'dark',
    setTheme,
    toggleTheme,
    markTrackCompleted,
    isTrackCompleted,
    resetSettings,
  };
}
