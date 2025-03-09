import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from './queryClient';
import { User as SelectUser, InsertUser } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

type LoginData = {
  username: string;
  password: string;
};

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: InsertUser) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<SelectUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/user', {
          credentials: 'include',
        });
        
        if (response.status === 401) {
          setUser(null);
          return;
        }
        
        if (!response.ok) {
          console.error('Auth error:', response.statusText);
          setUser(null);
          return;
        }
        
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error('Auth fetch error:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest('POST', '/api/login', credentials);
      return await res.json();
    },
    onSuccess: (userData: SelectUser) => {
      setUser(userData);
      toast({
        title: 'Login successful',
        description: `Welcome back, ${userData.name}!`,
      });
    },
    onError: (err: Error) => {
      toast({
        title: 'Login failed',
        description: err.message,
        variant: 'destructive',
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const res = await apiRequest('POST', '/api/register', userData);
      return await res.json();
    },
    onSuccess: (userData: SelectUser) => {
      setUser(userData);
      toast({
        title: 'Registration successful',
        description: `Welcome to Portfolio CMS, ${userData.name}!`,
      });
    },
    onError: (err: Error) => {
      toast({
        title: 'Registration failed',
        description: err.message,
        variant: 'destructive',
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/logout');
    },
    onSuccess: () => {
      setUser(null);
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    },
    onError: (err: Error) => {
      toast({
        title: 'Logout failed',
        description: err.message,
        variant: 'destructive',
      });
    },
  });

  // Simplified interface for auth operations
  const login = async (data: LoginData) => {
    await loginMutation.mutateAsync(data);
  };

  const register = async (data: InsertUser) => {
    await registerMutation.mutateAsync(data);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}