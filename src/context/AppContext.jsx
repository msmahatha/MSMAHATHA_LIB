import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => localStorage.getItem('msmahatha_user') || null);
  const [stash, setStash] = useState(() => JSON.parse(localStorage.getItem('msmahatha_stash')) || []);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('msmahatha_history')) || []);
  const [query, setQuery] = useState('science fiction');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [crtEnabled, setCrtEnabled] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem('msmahatha_user', user);
    } else {
      localStorage.removeItem('msmahatha_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('msmahatha_stash', JSON.stringify(stash));
  }, [stash]);

  useEffect(() => {
    localStorage.setItem('msmahatha_history', JSON.stringify(history));
  }, [history]);

  const login = (username) => {
    setUser(username.toUpperCase());
  };

  const logout = () => {
    setUser(null);
  };

  const addToStash = (book) => {
    if (!stash.some(b => b.id === book.id)) {
      setStash([...stash, book]);
    }
  };

  const removeFromStash = (bookId) => {
    setStash(stash.filter(b => b.id !== bookId));
  };

  const isInStash = (bookId) => {
    return stash.some(b => b.id === bookId);
  };

  const addToHistory = (book) => {
    setHistory(prev => {
      const filtered = prev.filter(b => b.id !== book.id);
      return [book, ...filtered];
    });
  };

  const value = {
    user,
    login,
    logout,
    stash,
    addToStash,
    removeFromStash,
    isInStash,
    history,
    addToHistory,
    query,
    setQuery,
    page,
    setPage,
    isLoading,
    setIsLoading,
    viewMode,
    setViewMode,
    soundEnabled,
    setSoundEnabled,
    crtEnabled,
    setCrtEnabled
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
