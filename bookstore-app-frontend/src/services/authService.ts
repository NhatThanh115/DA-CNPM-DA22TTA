// Instructions: Update frontend authService to use the new backend API

// src/services/authService.ts
import apiClient from '../utils/api';

export interface User {
  id: string; // In MongoDB, this will be _id
  username: string;
  email: string;
  name: string;
  favoriteBooks: string[]; // Array of Book IDs
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
    // The token itself might be enough for some checks, but usually, you'd fetch user profile
    // This endpoint verifies the token and returns the user data
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
  // Optionally, you could call a backend endpoint to invalidate the token server-side if needed
};

export const updateUserProfile = async (updates: Partial<Omit<User, 'id' | 'favoriteBooks' | 'email'>> & { email?: string }): Promise<User> => {
    const response = await apiClient.put<User>('/users/profile', updates);
    return response.data;
  };


// --- Favorite Books --- (These now interact with the backend)

export const getFavoriteBooks = async (): Promise<string[]> => {
  // This is now managed by the User object fetched via getCurrentUser or from user profile updates.
  // Or, if you have a dedicated endpoint:
  // const response = await apiClient.get<Book[]>('/users/favorites');
  // return response.data.map(book => book._id); // Assuming Book interface has _id
  // For now, we assume favoriteBooks are part of the User object from /auth/me or profile updates.
  const user = await getCurrentUser();
  return user?.favoriteBooks || [];
};

export const addToFavorites = async (bookId: string): Promise<string[]> => {
  const response = await apiClient.post<string[]>(`/users/favorites/${bookId}`);
  return response.data; // Backend should return the updated list of favorite book IDs
};

export const removeFromFavorites = async (bookId: string): Promise<string[]> => {
  const response = await apiClient.delete<string[]>(`/users/favorites/${bookId}`);
  return response.data; // Backend should return the updated list of favorite book IDs
};

// This will now rely on the currentUser object in AuthContext which gets its data from the backend
// No direct call needed here if AuthContext is up-to-date.
export const isBookInFavorites = (bookId: string, currentFavoriteIds: string[]): boolean => {
  return currentFavoriteIds.includes(bookId);
};
