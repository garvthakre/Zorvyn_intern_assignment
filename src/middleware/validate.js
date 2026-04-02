import { ApiError } from '../utils/ApiError.js'

// Middleware to validate request bodies against a Zod schema
export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const message = result.error.errors?.[0]?.message || "Invalid Request"
      return next(new ApiError(400, message))
    }
    req.body = result.data
    next()
  }
}