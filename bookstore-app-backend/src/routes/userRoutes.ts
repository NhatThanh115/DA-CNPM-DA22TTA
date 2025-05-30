import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getFavoriteBooks,
  addFavoriteBook,
  removeFavoriteBook,
} from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile and favorites management (requires authentication for all routes)
 * security:
 *   - bearerAuth: [] # Applies to all operations in this tag unless overridden
 */

router.use(authMiddleware); // All routes below are protected

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' } # Defined in swaggerConfig or User model
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/profile', getUserProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update current user's profile
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UserProfileUpdate' }
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Invalid input data (e.g., username/email taken)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/profile', updateUserProfile);

/**
 * @swagger
 * /users/favorites:
 *   get:
 *     summary: Get current user's list of favorite books
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of favorite books (populated with book details)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Book' }
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/favorites', getFavoriteBooks);

/**
 * @swagger
 * /users/favorites/{bookId}:
 *   post:
 *     summary: Add a book to the current user's favorites
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema: { type: string }
 *         description: The ID of the book to add to favorites
 *     responses:
 *       200:
 *         description: Book added to favorites, returns updated list of favorite book IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { type: string, description: "Book ID" }
 *       400:
 *         description: Invalid book ID or book already in favorites
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book or User not found
 *       500:
 *         description: Server error
 */
router.post('/favorites/:bookId', addFavoriteBook);

/**
 * @swagger
 * /users/favorites/{bookId}:
 *   delete:
 *     summary: Remove a book from the current user's favorites
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema: { type: string }
 *         description: The ID of the book to remove from favorites
 *     responses:
 *       200:
 *         description: Book removed from favorites, returns updated list of favorite book IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { type: string, description: "Book ID" }
 *       400:
 *         description: Invalid book ID or book not in favorites
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete('/favorites/:bookId', removeFavoriteBook);

export default router;
