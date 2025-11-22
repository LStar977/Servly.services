import { createContext, useContext, useState, ReactNode } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedInUser = await authAPI.login(email, password);
      setUser(loggedInUser);
      toast({
        title: "Welcome back!",
        description: `Logged in as ${loggedInUser.name}`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
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
      toast({
        title: "Account created",
        description: "Welcome to Servly!",
      });
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Could not create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "See you soon!",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
