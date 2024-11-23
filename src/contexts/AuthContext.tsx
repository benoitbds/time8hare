import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase/config';
import { authService } from '../services/firebase/auth';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      try {
        if (firebaseUser) {
          const userData = await authService.getCurrentUser(firebaseUser.uid);
          setUser(userData);
          setError(null);
        } else {
          setUser(null);
          setError(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await authService.login(email, password);
      const userData = await authService.getCurrentUser(userCredential.user.uid);
      setUser(userData);
    } catch (error) {
      setError('Invalid email or password');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    try {
      const userData = await authService.loginWithGoogle();
      setUser(userData);
    } catch (error) {
      setError('Failed to sign in with Google');
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await authService.register(email, password, username);
      setUser(userData);
    } catch (error) {
      setError('Failed to create account');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      setError('Failed to log out');
      throw error;
    }
  };

  const value = {
    user,
    login,
    loginWithGoogle,
    register,
    logout,
    isLoading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}