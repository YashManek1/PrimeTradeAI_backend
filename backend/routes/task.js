import express from "express";
import { body } from "express-validator";
import validate from "../middlewares/validate.js";
import { authenticate, requireRole } from "../middlewares/auth.js";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getAllTasks,
  deleteAnyTask,
} from "../controllers/task.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create a new task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete assignment
 *               description:
 *                 type: string
 *                 example: Finish backend module
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  [
    body("title").isLength({ min: 3, max: 100 }),
    body("description").isLength({ min: 1 }),
    body("status").optional().isIn(["pending", "in-progress", "completed"]),
  ],
  validate,
  authenticate,
  createTask
);

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get all tasks for the current user
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's tasks
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, getTasks);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     summary: Update a user's task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated assignment
 *               description:
 *                 type: string
 *                 example: Changed description
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *     responses:
 *       200:
 *         description: Task updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:id",
  [
    body("title").optional().isLength({ min: 3, max: 100 }),
    body("description").optional().isLength({ min: 1 }),
    body("status").optional().isIn(["pending", "in-progress", "completed"]),
  ],
  validate,
  authenticate,
  updateTask
);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete user's task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", authenticate, deleteTask);

/**
 * @swagger
 * /api/v1/tasks/admin/all:
 *   get:
 *     summary: Get all tasks (admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tasks
 *       403:
 *         description: Admin access required
 */
router.get("/admin/all", authenticate, requireRole(["admin"]), getAllTasks);

/**
 * @swagger
 * /api/v1/tasks/admin/{id}:
 *   delete:
 *     summary: Delete any task (admin only)
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
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       403:
 *         description: Admin access required
 */
router.delete(
  "/admin/:id",
  authenticate,
  requireRole(["admin"]),
  deleteAnyTask
);

export default router;
