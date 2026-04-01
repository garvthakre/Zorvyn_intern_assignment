import bcrypt from 'bcryptjs'
import { db } from '../../config/db.js'
import { ApiError } from '../../utils/ApiError.js'
import { generateToken } from '../../utils/generateToken.js'

export const register = async (dto) => {
  // Check if email already exists
  const { rows: existing } = await db.query(
    `SELECT id FROM users WHERE email = $1`,
    [dto.email]
  )
  if (existing[0]) {
    throw new ApiError(409, 'Email already registered')
  }

  // Hash password
  const password_hash = await bcrypt.hash(dto.password, 10)

  // Insert user
  const { rows } = await db.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, status, created_at`,
    [dto.name, dto.email, password_hash, dto.role]
  )

  const user = rows[0]

  const token = generateToken({ id: user.id, email: user.email, role: user.role })

  return { user, token }
}

export const login = async (dto) => {
  // Find user by email
  const { rows } = await db.query(
    `SELECT * FROM users WHERE email = $1`,
    [dto.email]
  )
  const user = rows[0]

  if (!user) {
    throw new ApiError(401, 'Invalid email or password')
  }

  // Check if account is active
  if (user.status === 'inactive') {
    throw new ApiError(403, 'Your account has been deactivated')
  }

  // Compare password
  const isMatch = await bcrypt.compare(dto.password, user.password_hash)
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password')
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role })

  const { password_hash, ...safeUser } = user

  return { user: safeUser, token }
}

export const getMe = async (userId) => {
  const { rows } = await db.query(
    `SELECT id, name, email, role, status, created_at FROM users WHERE id = $1`,
    [userId]
  )
  if (!rows[0]) throw new ApiError(404, 'User not found')
  return rows[0]
}