import express from 'express';
import type { Request, Response } from 'express';
import Book from '../models/Book.js';
import type { IBook } from '../models/Book.js';

// @desc    Get all books with optional category filter and pagination
// @route   GET /api/books
// @access  Public
export const getBooks = async (req: Request, res: Response) => {
  const { category, featured, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
  const query: any = {};

  if (category && typeof category === 'string' && category.toLowerCase() !== 'all') {
    query.category = category;
  }
  if (featured === 'true') {
    query.featured = true;
  }

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  const sortOptions: any = {};
  if (typeof sortBy === 'string' && typeof order === 'string') {
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;
  } else {
    sortOptions.createdAt = -1; // Default sort
  }

  try {
    const books = await Book.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalBooks = await Book.countDocuments(query);

    res.json({
      books,
      currentPage: pageNum,
      totalPages: Math.ceil(totalBooks / limitNum),
      totalBooks
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a single book by ID
// @route   GET /api/books/:id
// @access  Public
export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (err: any) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Book not found (invalid ID format)' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Private (Admin later)
export const createBook = async (req: Request, res: Response) => {
  const {
    title,
    author,
    description,
    price,
    imageUrl,
    category,
    rating,
    featured,
    inStock,
    publicationDate,
  } = req.body;

  try {
    const newBook = new Book({
      title,
      author,
      description,
      price,
      imageUrl,
      category,
      rating,
      featured,
      inStock,
      publicationDate,
    });

    const book = await newBook.save();
    res.status(201).json(book);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private (Admin later)
export const updateBook = async (req: Request, res: Response) => {
  try {
    let book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // For now, allow any authenticated user to update, later restrict to admin
    book = await Book.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(book);
  } catch (err: any) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Book not found (invalid ID format)' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private (Admin later)
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // For now, allow any authenticated user to delete, later restrict to admin
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book removed' });
  } catch (err: any) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Book not found (invalid ID format)' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Get distinct categories
// @route   GET /api/books/categories
// @access  Public
export const getBookCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Book.distinct('category');
    res.json(categories);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
