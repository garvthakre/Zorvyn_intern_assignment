import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import { requireRole } from '../../middleware/requireRole.js'
import { validate } from '../../middleware/validate.js'
import { createRecordSchema, updateRecordSchema } from './records.validator.js'
import * as RecordsController from './records.controller.js'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Records
 *   description: Financial records management
 */

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get all records with optional filters
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           example: 2024-01-01
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           example: 2024-12-31
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Records fetched
 */
router.get('/', authenticate, RecordsController.getRecords)

/**
 * @swagger
 * /api/records/{id}:
 *   get:
 *     summary: Get single record
 *     tags: [Records]
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
 *         description: Record fetched
 *       404:
 *         description: Record not found
 */
router.get('/:id', authenticate, RecordsController.getRecordById)

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a new record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, type, category, date]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *                 example: salary
 *               date:
 *                 type: string
 *                 example: 2024-01-15
 *               notes:
 *                 type: string
 *                 example: January salary
 *     responses:
 *       201:
 *         description: Record created
 *       403:
 *         description: Forbidden
 */
router.post('/', authenticate, requireRole('admin'), validate(createRecordSchema), RecordsController.createRecord)

/**
 * @swagger
 * /api/records/{id}:
 *   patch:
 *     summary: Update a record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated
 *       404:
 *         description: Record not found
 */
router.patch('/:id', authenticate, requireRole('admin'), validate(updateRecordSchema), RecordsController.updateRecord)

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     summary: Soft delete a record
 *     tags: [Records]
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
 *         description: Record deleted
 *       404:
 *         description: Record not found
 */
router.delete('/:id', authenticate, requireRole('admin'), RecordsController.deleteRecord)

export default router