import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loadingSession: boolean;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  checkAuthSession: () => Promise<void>;
  handleLoginSuccess: (data: { token: string; user: User }) => void;
  savedModalOpen: boolean;
  setSavedModalOpen: (open: boolean) => void;
  language: 'en' | 'hi';
  toggleLanguage: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [savedModalOpen, setSavedModalOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const checkAuthSession = async () => {
    const token = localStorage.getItem('cookjr_token');
    if (!token) {
      setLoadingSession(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('cookjr_token');
      }
    } catch (err) {
      console.error('Session check failed:', err);
    } finally {
      setLoadingSession(false);
    }
  };

  useEffect(() => {
    checkAuthSession();
  }, []);

  const handleLoginSuccess = (data: { token: string; user: User }) => {
    localStorage.setItem('cookjr_token', data.token);
    setUser(data.user);
    setAuthModalOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('cookjr_token');
    setUser(null);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loadingSession,
        logout,
        setUser,
        authModalOpen,
        setAuthModalOpen,
        checkAuthSession,
        handleLoginSuccess,
        savedModalOpen,
        setSavedModalOpen,
        language,
        toggleLanguage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      loadingSession: false,
      logout: () => {},
      setUser: () => {},
      authModalOpen: false,
      setAuthModalOpen: () => {},
      checkAuthSession: async () => {},
      handleLoginSuccess: () => {},
      savedModalOpen: false,
      setSavedModalOpen: () => {},
      language: 'en' as const,
      toggleLanguage: () => {},
    };
  }
  return context;
}
