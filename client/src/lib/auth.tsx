import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { User } from "./data";
import { authAPI } from "./api";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: { username?: string; email: string; password: string; name: string; role: User['role']; country?: string; province?: string; city?: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  let toast: ReturnType<typeof useToast> | null = null;
  try {
    toast = useToast();
  } catch (e) {
    // useToast not available yet, will be used in pages instead
  }

  // Check if user is already logged in via OAuth or session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/user', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to check auth status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedInUser = await authAPI.login(email, password);
      setUser(loggedInUser);
      if (toast) {
        toast({
          title: "Welcome back!",
          description: `Logged in as ${loggedInUser.name}`,
        });
      }
    } catch (error) {
      if (toast) {
        toast({
          title: "Login failed",
          description: error instanceof Error ? error.message : "Invalid credentials",
          variant: "destructive",
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: { username?: string; email: string; password: string; name: string; role: User['role']; country?: string; province?: string; city?: string }) => {
    setIsLoading(true);
    try {
      const newUser = await authAPI.signup(userData);
      setUser(newUser);
      if (toast) {
        toast({
          title: "Account created",
          description: "Welcome to Servly!",
        });
      }
    } catch (error) {
      if (toast) {
        toast({
          title: "Signup failed",
          description: error instanceof Error ? error.message : "Could not create account",
          variant: "destructive",
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // Redirect to logout endpoint to clear server session
    window.location.href = '/api/logout';
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a default context with null user instead of throwing
    // This prevents errors during initial app load
    return {
      user: null,
      login: async () => { throw new Error("AuthProvider not initialized"); },
      signup: async () => { throw new Error("AuthProvider not initialized"); },
      logout: () => { throw new Error("AuthProvider not initialized"); },
      isLoading: true,
    };
  }
  return context;
}
