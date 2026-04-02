import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import { requireRole } from '../../middleware/requireRole.js'
import * as DashboardController from './dashboard.controller.js'

const router = Router()

// All authenticated users
router.get('/summary',   authenticate, DashboardController.getSummary)
router.get('/by-category', authenticate, DashboardController.getCategoryTotals)
router.get('/recent',    authenticate, DashboardController.getRecentActivity)

// Analyst and admin only
router.get('/trends', authenticate, requireRole('analyst', 'admin'), DashboardController.getMonthlyTrends)

export default router