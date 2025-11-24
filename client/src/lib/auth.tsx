import { createContext, useContext, useState, ReactNode, useEffect } from "react";
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

  // Check if user is already logged in via OAuth or session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/user', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          console.log("Auth check successful:", data);
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
      console.log("Attempting login with email:", email);
      const loggedInUser = await authAPI.login(email, password);
      console.log("Login successful:", loggedInUser);
      setUser(loggedInUser);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: { username?: string; email: string; password: string; name: string; role: User['role']; country?: string; province?: string; city?: string }) => {
    setIsLoading(true);
    try {
      console.log("Attempting signup with email:", userData.email);
      const newUser = await authAPI.signup(userData);
      console.log("Signup successful:", newUser);
      setUser(newUser);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    console.log("Logging out...");
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
