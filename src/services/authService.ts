import { jwtDecode } from 'jwt-decode';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  favoriteBooks: string[];
}

interface UserCredentials {
  email: string;
  password: string;
}

interface UserData {
  id: string;
  username: string;
  email: string;
  name: string;
  password: string;
  favoriteBooks: string[];
}

// Mock user data
const mockUsers: Record<string, UserData> = {
  'user1@example.com': {
    id: '1',
    username: 'user1',
    email: 'user1@example.com',
    password: '$2a$10$k7LkQEMbZkH.a0Kmnd3uOeH01OW5FgJUZEr5MhqFW/nGUn8JZgV/C', // hashed 'password123'
    name: 'John Doe',
    favoriteBooks: ['1', '3', '7']
  },
  'user2@example.com': {
    id: '2',
    username: 'user2',
    email: 'user2@example.com',
    password: '$2a$10$k7LkQEMbZkH.a0Kmnd3uOeH01OW5FgJUZEr5MhqFW/nGUn8JZgV/C', // hashed 'password123'
    name: 'Jane Smith',
    favoriteBooks: ['2', '5', '9']
  }
};

// JWT secret would normally be in environment variables
const JWT_SECRET = 'bookhaven-secret-key';
const TOKEN_EXPIRY = '24h';

// Generate JWT token
const generateToken = (user: User): string => {
  // In a real application, you would use the jsonwebtoken library
  // Here we're creating a mock token
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username
  };

  // Mock creating a JWT
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa(JWT_SECRET);

  return `${header}.${encodedPayload}.${signature}`;
};

// Validate user credentials
export const loginUser = async ({ email, password }: UserCredentials): Promise<{ user: User; token: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const user = mockUsers[email.toLowerCase()];

  // For demo purposes, we're not actually checking the password
  // In a real app, you would use bcrypt.compare
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Remove password before sending back user info
  const { password: _, ...userWithoutPassword } = user;
  const token = generateToken(userWithoutPassword);

  // Save token to localStorage
  localStorage.setItem('token', token);

  return {
    user: userWithoutPassword as User,
    token
  };
};

// Register a new user
export const registerUser = async (userInfo: UserCredentials & { name: string; username: string }): Promise<{ user: User; token: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const { email, password, name, username } = userInfo;

  // Check if user already exists
  if (mockUsers[email.toLowerCase()]) {
    throw new Error('User already exists');
  }

  // Create a new user
  const newUser: UserData = {
    id: `${Object.keys(mockUsers).length + 1}`,
    username,
    email: email.toLowerCase(),
    name,
    // In a real app, you would hash the password using bcrypt
    password: `hashed_${password}`,
    favoriteBooks: []
  };

  // Add to mock database
  mockUsers[email.toLowerCase()] = newUser;

  // Remove password before sending back user info
  const { password: _, ...userWithoutPassword } = newUser;
  const token = generateToken(userWithoutPassword);

  // Save token to localStorage
  localStorage.setItem('token', token);

  return {
    user: userWithoutPassword as User,
    token
  };
};

// Get current user from token
export const getCurrentUser = (): User | null => {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  try {
    // In a real app, you would verify the token
    // Here we just decode it to get the user info
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));

    // Fetch the full user data (in a real app, this would be from your backend)
    const userEmail = payload.email;
    const user = mockUsers[userEmail];

    if (!user) {
      return null;
    }

    // Remove password before returning user info
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  } catch (error) {
    console.error('Failed to decode token', error);
    return null;
  }
};

// Logout user
export const logoutUser = (): void => {
  localStorage.removeItem('token');
};

// Update user profile
export const updateUserProfile = async (updates: Partial<User>): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const currentUser = getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  // Update user info in mock database
  const userEmail = currentUser.email;
  mockUsers[userEmail] = {
    ...mockUsers[userEmail],
    ...updates
  };

  // Remove password before returning user info
  const { password: _, ...updatedUser } = mockUsers[userEmail];
  return updatedUser as User;
};

// Add book to favorites
export const addToFavorites = async (bookId: string): Promise<string[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const currentUser = getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  const userEmail = currentUser.email;
  const user = mockUsers[userEmail];

  // Check if book is already in favorites
  if (!user.favoriteBooks.includes(bookId)) {
    user.favoriteBooks.push(bookId);
  }

  return user.favoriteBooks;
};

// Remove book from favorites
export const removeFromFavorites = async (bookId: string): Promise<string[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const currentUser = getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  const userEmail = currentUser.email;
  const user = mockUsers[userEmail];

  // Remove book from favorites
  user.favoriteBooks = user.favoriteBooks.filter(id => id !== bookId);

  return user.favoriteBooks;
};

// Check if a book is in favorites
export const isBookInFavorites = (bookId: string): boolean => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return false;
  }

  return currentUser.favoriteBooks.includes(bookId);
};

// Get favorite books
export const getFavoriteBooks = (): string[] => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return [];
  }

  return currentUser.favoriteBooks;
};
