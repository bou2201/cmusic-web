'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'searchHistoryCmusic';
const MAX_HISTORY_ITEMS = 10;

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load search history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  }, []);

  // Add a new search term to history
  const addToHistory = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    const newHistory = [searchTerm, ...searchHistory.filter((item) => item !== searchTerm)].slice(
      0,
      MAX_HISTORY_ITEMS,
    );

    setSearchHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  // Delete a specific item from history
  const deleteFromHistory = (searchTerm: string) => {
    const newHistory = searchHistory.filter((item) => item !== searchTerm);
    setSearchHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    searchHistory,
    addToHistory,
    deleteFromHistory,
    clearHistory,
  };
}
