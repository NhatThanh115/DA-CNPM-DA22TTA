import express from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBookCategories
} from '../controllers/bookController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management and retrieval
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BookListItem:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         title: { type: string }
 *         author: { type: string }
 *         price: { type: number }
 *         imageUrl: { type: string }
 *         category: { type: string }
 *         rating: { type: number }
 *         featured: { type: boolean }
 *
 *     BooksPaginatedResponse:
 *       type: object
 *       properties:
 *         books:
 *           type: array
 *           items: { $ref: '#/components/schemas/BookListItem' }
 *         currentPage: { type: integer }
 *         totalPages: { type: integer }
 *         totalBooks: { type: integer }
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Retrieve a list of books with optional filters and pagination
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filter books by category slug (e.g., 'sci-fi')
 *       - in: query
 *         name: featured
 *         schema: { type: boolean }
 *         description: Filter for featured books
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Number of books per page
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [createdAt, title, price, rating, publicationDate], default: createdAt }
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/BooksPaginatedResponse' }
 *       500:
 *         description: Server error
 */
router.get('/', getBooks);

/**
 * @swagger
 * /books/categories:
 *   get:
 *     summary: Get a list of all distinct book categories
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: A list of category names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { type: string, example: "Fiction" }
 *       500:
 *         description: Server error
 */
router.get('/categories', getBookCategories);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Retrieve a single book by its ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: The ID of the book to retrieve
 *     responses:
 *       200:
 *         description: Detailed information about the book
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Book' }
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error
 */
router.get('/:id', getBookById);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book (requires authentication)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             # Assuming a schema for book creation, excluding _id, createdAt, updatedAt
 *             type: object
 *             properties:
 *               title: { type: string, example: 'New Adventure Novel' }
 *               author: { type: string, example: 'Jane Author' }
 *               description: { type: string, example: 'An exciting new story.' }
 *               price: { type: number, example: 19.99 }
 *               imageUrl: { type: string, example: 'http://example.com/newbook.jpg' }
 *               category: { type: string, example: 'fiction' }
 *               rating: { type: number, example: 0 }
 *               featured: { type: boolean, example: false }
 *               inStock: { type: boolean, example: true }
 *               publicationDate: { type: string, format: date, example: '2024-01-01' }
 *             required: [title, author, description, price, imageUrl, category, publicationDate]
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Book' }
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, createBook);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update an existing book (requires authentication)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: The ID of the book to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             # Schema for updating a book, fields are optional
 *             type: object
 *             properties:
 *               title: { type: string }
 *               author: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               imageUrl: { type: string }
 *               category: { type: string }
 *               rating: { type: number }
 *               featured: { type: boolean }
 *               inStock: { type: boolean }
 *               publicationDate: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Book' }
 *       400:
 *         description: Invalid input data or invalid ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authMiddleware, updateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book (requires authentication)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: The ID of the book to delete
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: 'Book removed' }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, deleteBook);

export default router;
