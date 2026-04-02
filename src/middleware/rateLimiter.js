import rateLimit from 'express-rate-limit'

// strict limiter for auth routes
// prevents brute force attacks on login and register
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // 10 requests per 15 mins
  message: {
    success: false,
    message: 'Too many attempts, please try again after 15 minutes',
  },
  standardHeaders: true,     // adds RateLimit headers to response
  legacyHeaders: false,
})

// relaxed limiter for general API routes
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute
  max: 60,                   // 60 requests per minute
  message: {
    success: false,
    message: 'Too many requests, please slow down',
  },
  standardHeaders: true,
  legacyHeaders: false,
})