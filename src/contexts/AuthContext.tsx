import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
  addToFavorites as addToFavoritesService,
  removeFromFavorites as removeFromFavoritesService,
  isBookInFavorites as isBookInFavoritesService,
  getFavoriteBooks as getFavoriteBooksService
} from '../services/authService';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  favoriteBooks: string[];
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  addToFavorites: (bookId: string) => Promise<void>;
  removeFromFavorites: (bookId: string) => Promise<void>;
  isBookInFavorites: (bookId: string) => boolean;
  favoriteBooks: string[];
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteBooks, setFavoriteBooks] = useState<string[]>([]);

  // Check if user is already logged in
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setFavoriteBooks(user.favoriteBooks || []);
    }
    setLoading(false);
  }, []);

  const clearError = () => {
    setError(null);
  };

  const register = async (email: string, password: string, name: string, username: string) => {
    try {
      setLoading(true);
      setError(null);

      const { user } = await registerUser({ email, password, name, username });
      setCurrentUser(user);
      setFavoriteBooks(user.favoriteBooks || []);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error registering:', error);
      setError(error.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { user } = await loginUser({ email, password });
      setCurrentUser(user);
      setFavoriteBooks(user.favoriteBooks || []);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error logging in:', error);
      setError(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      logoutUser();
      setCurrentUser(null);
      setFavoriteBooks([]);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error logging out:', error);
      setError(error.message || 'Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);

      const updatedUser = await updateUserProfile(updates);
      setCurrentUser(updatedUser);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (bookId: string) => {
    try {
      setLoading(true);
      setError(null);

      const updatedFavorites = await addToFavoritesService(bookId);
      setFavoriteBooks(updatedFavorites);

      // Update current user
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          favoriteBooks: updatedFavorites
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error adding to favorites:', error);
      setError(error.message || 'Failed to add to favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (bookId: string) => {
    try {
      setLoading(true);
      setError(null);

      const updatedFavorites = await removeFromFavoritesService(bookId);
      setFavoriteBooks(updatedFavorites);

      // Update current user
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          favoriteBooks: updatedFavorites
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error removing from favorites:', error);
      setError(error.message || 'Failed to remove from favorites');
    } finally {
      setLoading(false);
    }
  };

  const isBookInFavorites = (bookId: string): boolean => {
    return isBookInFavoritesService(bookId);
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    addToFavorites,
    removeFromFavorites,
    isBookInFavorites,
    favoriteBooks,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
