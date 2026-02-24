import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'mindspo_user';

// Word lists for generating usernames
const ADJECTIVES = [
  'Calm', 'Quiet', 'Gentle', 'Bright', 'Clear', 'Soft', 'Kind', 'Warm',
  'Still', 'Deep', 'Pure', 'Free', 'Light', 'Swift', 'Bold', 'Wise',
  'Fair', 'True', 'Fresh', 'Cool', 'Noble', 'Keen', 'Mild', 'Safe'
];

const NOUNS = [
  'River', 'Moss', 'Stone', 'Cloud', 'Wave', 'Moon', 'Star', 'Wind',
  'Lake', 'Peak', 'Grove', 'Fern', 'Brook', 'Leaf', 'Rain', 'Dawn',
  'Sage', 'Cedar', 'Oak', 'Pine', 'Meadow', 'Shore', 'Cliff', 'Vale'
];

export function generateUsername() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 90) + 10; // 10-99
  return `${adj}${noun}${num}`;
}

const getInitialUser = () => ({
  username: null,
  department: null,
  onboardingComplete: false,
  createdAt: null,
});

export default function useUser() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load user:', e);
    }
    return getInitialUser();
  });

  // Save to localStorage whenever user changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user:', e);
    }
  }, [user]);

  const completeOnboarding = useCallback((username, department) => {
    setUser({
      username,
      department,
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
    });
  }, []);

  const updateDepartment = useCallback((department) => {
    setUser(prev => ({ ...prev, department }));
  }, []);

  const resetUser = useCallback(() => {
    setUser(getInitialUser());
    // Also clear related data
    localStorage.removeItem('mindspo_sessions');
    localStorage.removeItem('mindspo_suggestions');
    localStorage.removeItem('braindefragger_stats');
  }, []);

  return {
    user,
    isOnboarded: user.onboardingComplete,
    completeOnboarding,
    updateDepartment,
    resetUser,
    generateUsername,
  };
}
