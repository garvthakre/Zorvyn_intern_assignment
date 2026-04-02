import { ApiError } from '../utils/ApiError.js'

// Middleware to check if the authenticated user has the required role(s)
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Not authenticated'))
    }
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action'))
    }
    next()
  }
}