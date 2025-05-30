// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  getCurrentUser as getCurrentUserFromService,
  loginUser as loginUserService,
  logoutUser as logoutUserService,
  registerUser as registerUserService,
  updateUserProfile as updateUserProfileService,
  addToFavorites as addToFavoritesService,
  removeFromFavorites as removeFromFavoritesService,
  // isBookInFavorites is now handled internally by checking currentUser.favoriteBooks
} from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, username: string) => Promise<void>;
  logout: () => Promise<void>; // Kept async for potential future backend logout calls
  updateProfile: (updates: Partial<Omit<User, 'id' | 'favoriteBooks' | 'email'>> & { email?: string }) => Promise<void>;
  addToFavorites: (bookId: string) => Promise<void>;
  removeFromFavorites: (bookId: string) => Promise<void>;
  isBookInFavorites: (bookId: string) => boolean;
  favoriteBooks: string[]; // This will be derived from currentUser
  clearError: () => void;
  fetchCurrentUser: () => Promise<void>; // Added to re-fetch user if needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // favoriteBooks are now part of the currentUser object from the backend
  const favoriteBooks = currentUser?.favoriteBooks || [];

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUserFromService();
      setCurrentUser(user);
    } catch (err) {
      setCurrentUser(null);
      // Don't set global error on initial load if user is simply not logged in
      console.info('Fetch current user: No user logged in or token invalid.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const clearError = () => {
    setError(null);
  };

  const register = async (email: string, password: string, name: string, username: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user } = await registerUserService({ email, password, name, username });
      setCurrentUser(user);
    } catch (err: unknown) {
      const e = err as Error;
      console.error('Error registering:', e);
      setError(e.message || 'Failed to register');
      throw e; // Re-throw to be caught by form if needed
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user } = await loginUserService({ email, password });
      setCurrentUser(user);
    } catch (err: unknown) {
      const e = err as Error;
      console.error('Error logging in:', e);
      setError(e.message || 'Failed to login');
      throw e; // Re-throw to be caught by form if needed
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // Frontend logout is synchronous with current setup
    logoutUserService();
    setCurrentUser(null);
    // No loading or error state needed for this simple logout
  };

  const updateProfile = async (updates: Partial<Omit<User, 'id' | 'favoriteBooks' | 'email'>> & { email?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await updateUserProfileService(updates);
      setCurrentUser(updatedUser);
    } catch (err: unknown) {
      const e = err as Error;
      console.error('Error updating profile:', e);
      setError(e.message || 'Failed to update profile');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (bookId: string) => {
    if (!currentUser) {
      setError('User not logged in');
      throw new Error('User not logged in');
    }
    try {
      setLoading(true);
      setError(null);
      const updatedFavoriteIds = await addToFavoritesService(bookId);
      setCurrentUser(prevUser => prevUser ? { ...prevUser, favoriteBooks: updatedFavoriteIds } : null);
    } catch (err: unknown) {
      const e = err as Error;
      console.error('Error adding to favorites:', e);
      setError(e.message || 'Failed to add to favorites');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (bookId: string) => {
    if (!currentUser) {
      setError('User not logged in');
      throw new Error('User not logged in');
    }
    try {
      setLoading(true);
      setError(null);
      const updatedFavoriteIds = await removeFromFavoritesService(bookId);
      setCurrentUser(prevUser => prevUser ? { ...prevUser, favoriteBooks: updatedFavoriteIds } : null);
    } catch (err: unknown) {
      const e = err as Error;
      console.error('Error removing from favorites:', e);
      setError(e.message || 'Failed to remove from favorites');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const isBookInFavorites = (bookId: string): boolean => {
    return currentUser?.favoriteBooks.includes(bookId) || false;
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
    favoriteBooks, // Derived from currentUser
    clearError,
    fetchCurrentUser
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
