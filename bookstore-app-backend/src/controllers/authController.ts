import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';

const generateToken = (userId: string) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '24h' });
};

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, name, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    user = new User({
      username,
      email,
      name,
      passwordHash: password, // The pre-save hook in User model will hash this
      favoriteBooks: []
    });

    await user.save();

    const token = generateToken(user.id);
    const { passwordHash, ...userResponse } = user.toObject();

    res.status(201).json({
      token,
      user: userResponse,
    });
  } catch (err: any) {
    console.error('Registration error:', err.message);
    res.status(500).send('Server error during registration');
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials (email not found)' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials (password mismatch)' });
    }

    const token = generateToken(user.id);
    const { passwordHash, ...userResponse } = user.toObject();

    res.json({
      token,
      user: userResponse,
    });
  } catch (err: any) {
    console.error('Login error:', err.message);
    res.status(500).send('Server error during login');
  }
};

export const getCurrentAuthenticatedUser = async (req: AuthRequest, res: Response) => {
  try {
    // req.user is populated by the authMiddleware
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    // The passwordHash is already excluded by the middleware's select('-passwordHash')
    res.json(req.user);
  } catch (err: any) {
    console.error('Get current user error:', err.message);
    res.status(500).send('Server error');
  }
};
