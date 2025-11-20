import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [stash, setStash] = useState([]);
  const [history, setHistory] = useState([]);
  const [query, setQuery] = useState('science fiction');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [useBackend, setUseBackend] = useState(true);

  // Load user data from backend on mount
  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (token && useBackend) {
        try {
          const response = await apiService.getCurrentUser();
          setUser(response.user);
          setStash(response.user.stash || []);
          setHistory(response.user.history || []);
          setSoundEnabled(response.user.settings?.soundEnabled ?? true);
          setCrtEnabled(response.user.settings?.crtEffect ?? true);
          localStorage.setItem('user', JSON.stringify(response.user));
        } catch (error) {
          console.error('Failed to load user data:', error);
          // Fallback to localStorage if backend fails
          setUseBackend(false);
          loadLocalData();
        }
      } else {
        // Load from localStorage if no backend
        loadLocalData();
      }
    };

    const loadLocalData = () => {
      const savedStash = localStorage.getItem('msmahatha_stash');
      const savedHistory = localStorage.getItem('msmahatha_history');
      if (savedStash) setStash(JSON.parse(savedStash));
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    };

    loadUserData();
  }, []);

  // Save to localStorage as backup
  useEffect(() => {
    if (!useBackend) {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }
  }, [user, useBackend]);

  useEffect(() => {
    if (!useBackend) {
      localStorage.setItem('msmahatha_stash', JSON.stringify(stash));
    }
  }, [stash, useBackend]);

  useEffect(() => {
    if (!useBackend) {
      localStorage.setItem('msmahatha_history', JSON.stringify(history));
    }
  }, [history, useBackend]);

  const login = async (username, password, isRegistration = false, email = '', confirmPassword = '') => {
    if (useBackend) {
      try {
        let response;
        if (isRegistration) {
          response = await apiService.register(username, email, password, confirmPassword);
        } else {
          response = await apiService.login(username, password);
        }
        
        setUser(response.user);
        setStash(response.user.stash || []);
        setHistory(response.user.history || []);
        setSoundEnabled(response.user.settings?.soundEnabled ?? true);
        setCrtEnabled(response.user.settings?.crtEffect ?? true);
        localStorage.setItem('user', JSON.stringify(response.user));
        return { success: true, message: response.message };
      } catch (error) {
        return { success: false, message: error.message };
      }
    } else {
      // Local mode fallback
      const userData = { username: username.toUpperCase() };
      setUser(userData);
      return { success: true, message: 'Logged in locally' };
    }
  };

  const logout = () => {
    if (useBackend) {
      apiService.logout();
    }
    setUser(null);
    setStash([]);
    setHistory([]);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  const addToStash = async (book) => {
    if (useBackend && user) {
      try {
        const response = await apiService.addToStash(book);
        setStash(response.stash);
      } catch (error) {
        console.error('Failed to add to stash:', error);
        // Fallback to local
        if (!stash.some(b => b.bookId === book.id)) {
          setStash([...stash, { bookId: book.id, ...book }]);
        }
      }
    } else {
      if (!stash.some(b => (b.id === book.id || b.bookId === book.id))) {
        setStash([...stash, book]);
      }
    }
  };

  const removeFromStash = async (bookId) => {
    if (useBackend && user) {
      try {
        const response = await apiService.removeFromStash(bookId);
        setStash(response.stash);
      } catch (error) {
        console.error('Failed to remove from stash:', error);
        // Fallback to local
        setStash(stash.filter(b => b.bookId !== bookId && b.id !== bookId));
      }
    } else {
      setStash(stash.filter(b => b.id !== bookId && b.bookId !== bookId));
    }
  };

  const isInStash = (bookId) => {
    return stash.some(b => b.id === bookId || b.bookId === bookId);
  };

  const addToHistory = async (book) => {
    if (useBackend && user) {
      try {
        const response = await apiService.addToHistory(book);
        setHistory(response.history);
      } catch (error) {
        console.error('Failed to add to history:', error);
        // Fallback to local
        setHistory(prev => {
          const filtered = prev.filter(b => b.bookId !== book.id && b.id !== book.id);
          return [{ bookId: book.id, ...book }, ...filtered];
        });
      }
    } else {
      setHistory(prev => {
        const filtered = prev.filter(b => b.id !== book.id && b.bookId !== book.id);
        return [book, ...filtered];
      });
    }
  };

  const updateSettings = async (newSettings) => {
    if (useBackend && user) {
      try {
        const response = await apiService.updateSettings(newSettings);
        if (newSettings.soundEnabled !== undefined) setSoundEnabled(newSettings.soundEnabled);
        if (newSettings.crtEffect !== undefined) setCrtEnabled(newSettings.crtEffect);
      } catch (error) {
        console.error('Failed to update settings:', error);
        // Still update locally
        if (newSettings.soundEnabled !== undefined) setSoundEnabled(newSettings.soundEnabled);
        if (newSettings.crtEffect !== undefined) setCrtEnabled(newSettings.crtEffect);
      }
    } else {
      if (newSettings.soundEnabled !== undefined) setSoundEnabled(newSettings.soundEnabled);
      if (newSettings.crtEffect !== undefined) setCrtEnabled(newSettings.crtEffect);
    }
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
    setCrtEnabled,
    updateSettings,
    useBackend
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
