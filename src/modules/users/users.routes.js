import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import { requireRole } from '../../middleware/requireRole.js'
import { validate } from '../../middleware/validate.js'
import { updateRoleSchema, updateStatusSchema } from './users.validator.js'
import * as UsersController from './users.controller.js'

const router = Router()

// All admin only
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management — admin only
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched
 *       403:
 *         description: Forbidden
 */
router.get('/', authenticate, requireRole('admin'), UsersController.getAllUsers)

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get single user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User fetched
 *       404:
 *         description: User not found
 */
router.get('/:id', authenticate, requireRole('admin'), UsersController.getUserById)

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     summary: Update user role
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [viewer, analyst, admin]
 *     responses:
 *       200:
 *         description: Role updated
 *       404:
 *         description: User not found
 */
router.patch('/:id/role', authenticate, requireRole('admin'), validate(updateRoleSchema), UsersController.updateUserRole)

/**
 * @swagger
 * /api/users/{id}/status:
 *   patch:
 *     summary: Activate or deactivate user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', authenticate, requireRole('admin'), validate(updateStatusSchema), UsersController.updateUserStatus)

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete('/:id', authenticate, requireRole('admin'), UsersController.deleteUser)

export default router