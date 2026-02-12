import express from "express";
import { body } from "express-validator";
import validate from "../middlewares/validate.js";
import { authenticate, requireRole } from "../middlewares/auth.js";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  getAllUsers,
  changeUserRole,
} from "../controllers/user.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@email.com
 *               password:
 *                 type: string
 *                 example: StrongPass123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 */
router.post(
  "/register",
  [
    body("username").isAlphanumeric().isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isStrongPassword(),
  ],
  validate,
  registerUser
);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Login with email and password
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 8 })],
  validate,
  loginUser
);

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Get current user's profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *       404:
 *         description: User not found
 */
router.get("/me", authenticate, getCurrentUser);

/**
 * @swagger
 * /api/v1/users/me:
 *   put:
 *     summary: Update current user's profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: newname
 *     responses:
 *       200:
 *         description: Updated user profile
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */
router.put(
  "/me",
  [body("username").isAlphanumeric().isLength({ min: 3 })],
  validate,
  authenticate,
  updateProfile
);

/**
 * @swagger
 * /api/v1/users/admin/all:
 *   get:
 *     summary: Get all users (admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Admin access required
 */
router.get("/admin/all", authenticate, requireRole(["admin"]), getAllUsers);

/**
 * @swagger
 * /api/v1/users/admin/{id}/role:
 *   patch:
 *     summary: Change a user's role (admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: User role updated
 *       400:
 *         description: Invalid role
 *       404:
 *         description: User not found
 *       403:
 *         description: Admin access required
 */
router.patch(
  "/admin/:id/role",
  [body("role").isIn(["user", "admin"])],
  validate,
  authenticate,
  requireRole(["admin"]),
  changeUserRole
);

export default router;
