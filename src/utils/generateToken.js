import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

// Utility function to generate a JWT token for a given payload
export const generateToken = (payload) => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  })
}