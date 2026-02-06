import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { demoAPI } from '../mock/api';
import { demoCustomer } from '../mock/data';

// Demo mode is always on for the TestFlight build.
// When connecting to a real backend, swap demoAPI for the real API client.
const IS_DEMO_MODE = true;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isDemoMode: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { email: string; password: string; name: string; role: User['role'] }) => Promise<void>;
  loginAsDemo: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Auto-login in demo mode for smoother TestFlight experience
    if (IS_DEMO_MODE) {
      setUser(demoCustomer);
      setIsLoading(false);
    } else {
      // In production, check for stored token/session
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedInUser = await demoAPI.auth.login(email, password);
      setUser(loggedInUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (data: { email: string; password: string; name: string; role: User['role'] }) => {
    setIsLoading(true);
    try {
      const newUser = await demoAPI.auth.signup(data);
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAsDemo = useCallback(async () => {
    setIsLoading(true);
    try {
      const demoUser = await demoAPI.auth.getUser();
      setUser(demoUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isDemoMode: IS_DEMO_MODE, login, signup, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
