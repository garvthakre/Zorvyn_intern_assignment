import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import { requireRole } from '../../middleware/requireRole.js'
import * as DashboardController from './dashboard.controller.js'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Summary and analytics endpoints
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get total income, expenses and net balance
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary fetched
 */
router.get('/summary', authenticate, DashboardController.getSummary)

/**
 * @swagger
 * /api/dashboard/by-category:
 *   get:
 *     summary: Get totals grouped by category
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category totals fetched
 */
router.get('/by-category', authenticate, DashboardController.getCategoryTotals)

/**
 * @swagger
 * /api/dashboard/recent:
 *   get:
 *     summary: Get last 10 transactions
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent activity fetched
 */
router.get('/recent', authenticate, DashboardController.getRecentActivity)

/**
 * @swagger
 * /api/dashboard/trends:
 *   get:
 *     summary: Get monthly trends for last 6 months
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trends fetched
 *       403:
 *         description: Analyst or admin only
 */
router.get('/trends', authenticate, requireRole('analyst', 'admin'), DashboardController.getMonthlyTrends)

export default router