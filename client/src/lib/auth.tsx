import { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, mockUsers, mockProviders } from "./data";
import { supabase } from "./supabase";

type AuthContextType = {
  user: User | null;
  login: (email: string, role?: User['role']) => Promise<void>;
  signup: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const login = async (email: string, role?: User['role']) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      toast({
        title: "Welcome back!",
        description: `Logged in as ${foundUser.name} (${foundUser.role})`,
      });
    } else {
      // For demo purposes, create a mock user if not found
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        role: role || 'customer',
        createdAt: new Date().toISOString()
      };
      setUser(newUser);
      
      // Also add to waitlist since this is a new mock user
      try {
        await supabase
          .from('waitlist')
          .insert([{ email, role: role || 'customer' }]);
      } catch (err) {
        console.error("Failed to add to waitlist", err);
      }

      toast({
        title: "Welcome!",
        description: `Created new demo account for ${email}`,
      });
    }
    setIsLoading(false);
  };

  const signup = async (userData: Partial<User>) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name || 'New User',
      email: userData.email || 'user@example.com',
      role: userData.role || 'customer',
      createdAt: new Date().toISOString(),
      ...userData
    };
    
    setUser(newUser);
    
    // Add to Supabase Waitlist for marketing
    if (userData.email) {
      try {
        await supabase
          .from('waitlist')
          .insert([{ email: userData.email, role: userData.role || 'customer' }]);
      } catch (err) {
        console.error("Failed to add to waitlist", err);
      }
    }

    toast({
      title: "Account created",
      description: "Welcome to Servly!",
    });
    setIsLoading(false);
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
