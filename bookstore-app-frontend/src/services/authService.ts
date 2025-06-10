
// src/services/authService.ts
import apiClient from '../utils/api';

export interface User {
  id: string; 
  username: string;
  email: string;
  name: string;
  favoriteBooks: string[];
}

interface AuthResponse {
  token: string;
  user: User;
}

interface UserCredentials {
  email: string;
  password: string;
}

export const loginUser = async ({ email, password }: UserCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const registerUser = async (
  userInfo: UserCredentials & { name: string; username: string }
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', userInfo);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  try {

    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Failed to get current user from API:', error);
    localStorage.removeItem('token'); // Token might be invalid
    return null;
  }
};

export const logoutUser = (): void => {
  localStorage.removeItem('token');
  
};

export const updateUserProfile = async (updates: Partial<Omit<User, 'id' | 'favoriteBooks' | 'email'>> & { email?: string }): Promise<User> => {
    const response = await apiClient.put<User>('/users/profile', updates);
    return response.data;
  };


// --- Favorite Books --- 

export const getFavoriteBooks = async (): Promise<string[]> => {
 const user = await getCurrentUser();
  return user?.favoriteBooks || [];
};

export const addToFavorites = async (bookId: string): Promise<string[]> => {
  const response = await apiClient.post<string[]>(`/users/favorites/${bookId}`);
  return response.data; 
};

export const removeFromFavorites = async (bookId: string): Promise<string[]> => {
  const response = await apiClient.delete<string[]>(`/users/favorites/${bookId}`);
  return response.data; 
};

export const isBookInFavorites = (bookId: string, currentFavoriteIds: string[]): boolean => {
  return currentFavoriteIds.includes(bookId);
};
