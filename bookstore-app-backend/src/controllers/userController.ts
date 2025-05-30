import { Response } from 'express';
import User from '../models/User';
import Book from '../models/Book';
import { AuthRequest } from '../middleware/authMiddleware';
import mongoose from 'mongoose';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    // req.user is populated by authMiddleware and passwordHash is already excluded
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    res.json(req.user);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  const { name, username, email } = req.body;
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if new username or email is already taken by another user
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      user.username = username;
    }
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      user.email = email;
    }
    if (name) {
      user.name = name;
    }

    const updatedUser = await user.save();
    const { passwordHash, ...userResponse } = updatedUser.toObject();
    res.json(userResponse);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get user's favorite books
// @route   GET /api/users/favorites
// @access  Private
export const getFavoriteBooks = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const user = await User.findById(req.user.id).populate('favoriteBooks');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.favoriteBooks);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add a book to favorites
// @route   POST /api/users/favorites/:bookId
// @access  Private
export const addFavoriteBook = async (req: AuthRequest, res: Response) => {
  const { bookId } = req.params;
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: 'Invalid book ID format' });
  }

  try {
    const user = await User.findById(req.user.id);
    const book = await Book.findById(bookId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (user.favoriteBooks.includes(book._id)) {
      return res.status(400).json({ message: 'Book already in favorites', favorites: user.favoriteBooks });
    }

    user.favoriteBooks.push(book._id);
    await user.save();
    res.json(user.favoriteBooks);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Remove a book from favorites
// @route   DELETE /api/users/favorites/:bookId
// @access  Private
export const removeFavoriteBook = async (req: AuthRequest, res: Response) => {
  const { bookId } = req.params;
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: 'Invalid book ID format' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const bookObjectId = new mongoose.Types.ObjectId(bookId);
    if (!user.favoriteBooks.some(favId => favId.equals(bookObjectId))) {
      return res.status(400).json({ message: 'Book not in favorites', favorites: user.favoriteBooks });
    }

    user.favoriteBooks = user.favoriteBooks.filter(
      (favBookId) => !favBookId.equals(bookObjectId)
    );
    await user.save();
    res.json(user.favoriteBooks);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
