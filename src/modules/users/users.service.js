import { db } from '../../config/db.js'
import { ApiError } from '../../utils/ApiError.js'

export const getAllUsers = async () => {
  const { rows } = await db.query(
    `SELECT id, name, email, role, status, created_at
     FROM users
     ORDER BY created_at DESC`
  )
  return rows
}

export const getUserById = async (id) => {
  const { rows } = await db.query(
    `SELECT id, name, email, role, status, created_at
     FROM users WHERE id = $1`,
    [id]
  )
  if (!rows[0]) throw new ApiError(404, 'User not found')
  return rows[0]
}

export const updateUserRole = async (id, role) => {
  await getUserById(id) // throws 404 if not found

  const { rows } = await db.query(
    `UPDATE users
     SET role = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, name, email, role, status`,
    [role, id]
  )
  return rows[0]
}

export const updateUserStatus = async (id, status) => {
  await getUserById(id) // throws 404 if not found

  const { rows } = await db.query(
    `UPDATE users
     SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, name, email, role, status`,
    [status, id]
  )
  return rows[0]
}

export const deleteUser = async (id) => {
  await getUserById(id) // throws 404 if not found

  await db.query(`DELETE FROM users WHERE id = $1`, [id])
}