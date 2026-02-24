import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'mindspo_suggestions';
const REVIEWS_KEY = 'mindspo_dashboard_reviews';

const getInitialSuggestions = () => [];
const getInitialReviews = () => ({});

export default function useSuggestions() {
  const [suggestions, setSuggestions] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load suggestions:', e);
    }
    return getInitialSuggestions();
  });

  const [reviews, setReviews] = useState(() => {
    try {
      const stored = localStorage.getItem(REVIEWS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load reviews:', e);
    }
    return getInitialReviews();
  });

  // Save suggestions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(suggestions));
    } catch (e) {
      console.error('Failed to save suggestions:', e);
    }
  }, [suggestions]);

  // Save reviews to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error('Failed to save reviews:', e);
    }
  }, [reviews]);

  const addSuggestion = useCallback((message, department) => {
    const suggestion = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      department,
      message,
    };
    setSuggestions(prev => [suggestion, ...prev]);
    return suggestion;
  }, []);

  const getUserSuggestions = useCallback((limit = 5) => {
    // For the user view, return their recent submissions
    return suggestions.slice(0, limit);
  }, [suggestions]);

  const getAllSuggestions = useCallback(() => {
    // For the dashboard, return all suggestions
    return suggestions;
  }, [suggestions]);

  const markAsReviewed = useCallback((suggestionId) => {
    setReviews(prev => ({
      ...prev,
      [suggestionId]: true
    }));
  }, []);

  const unmarkAsReviewed = useCallback((suggestionId) => {
    setReviews(prev => {
      const next = { ...prev };
      delete next[suggestionId];
      return next;
    });
  }, []);

  const isReviewed = useCallback((suggestionId) => {
    return !!reviews[suggestionId];
  }, [reviews]);

  const getUnreviewedCount = useCallback(() => {
    return suggestions.filter(s => !reviews[s.id]).length;
  }, [suggestions, reviews]);

  return {
    suggestions,
    reviews,
    addSuggestion,
    getUserSuggestions,
    getAllSuggestions,
    markAsReviewed,
    unmarkAsReviewed,
    isReviewed,
    getUnreviewedCount,
  };
}
