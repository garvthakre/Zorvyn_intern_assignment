import * as DashboardService from './dashboard.service.js'
import { ApiResponse } from '../../utils/ApiResponse.js'

// Controller functions for dashboard routes
export const getSummary = async (req, res, next) => {
  try {
    const summary = await DashboardService.getSummary()
    res.json(new ApiResponse(200, summary, 'Summary fetched'))
  } catch (error) {
    next(error)
  }
}

// Controller function to get totals by category for dashboard
export const getCategoryTotals = async (req, res, next) => {
  try {
    const totals = await DashboardService.getCategoryTotals()
    res.json(new ApiResponse(200, totals, 'Category totals fetched'))
  } catch (error) {
    next(error)
  }
}

// Controller function to get monthly trends for dashboard
export const getMonthlyTrends = async (req, res, next) => {
  try {
    const trends = await DashboardService.getMonthlyTrends()
    res.json(new ApiResponse(200, trends, 'Monthly trends fetched'))
  } catch (error) {
    next(error)
  }
}

// Controller function to get recent activity for dashboard
export const getRecentActivity = async (req, res, next) => {
  try {
    const activity = await DashboardService.getRecentActivity()
    res.json(new ApiResponse(200, activity, 'Recent activity fetched'))
  } catch (error) {
    next(error)
  }
}