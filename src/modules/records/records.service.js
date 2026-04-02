import { db } from '../../config/db.js'
import { ApiError } from '../../utils/ApiError.js'

// Service functions for financial records
export const createRecord = async (dto, userId) => {
  const { rows } = await db.query(
    `INSERT INTO financial_records (amount, type, category, date, notes, created_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [dto.amount, dto.type, dto.category, dto.date, dto.notes ?? null, userId]
  )
  return rows[0]
}

// Service function to get records with optional filters and pagination
export const getRecords = async (filters) => {
  const conditions = ['deleted_at IS NULL']
  const values = []
  let idx = 1

  if (filters.type) {
    conditions.push(`type = $${idx++}`)
    values.push(filters.type)
  }
  if (filters.category) {
    conditions.push(`category ILIKE $${idx++}`)
    values.push(`%${filters.category}%`)
  }
  if (filters.from) {
    conditions.push(`date >= $${idx++}`)
    values.push(filters.from)
  }
  if (filters.to) {
    conditions.push(`date <= $${idx++}`)
    values.push(filters.to)
  }

  const page = filters.page ?? 1
  const limit = filters.limit ?? 10
  const offset = (page - 1) * limit

  values.push(limit, offset)

  const query = `
    SELECT
      fr.*,
      u.name as created_by_name
    FROM financial_records fr
    LEFT JOIN users u ON fr.created_by = u.id
    WHERE ${conditions.join(' AND ')}
    ORDER BY fr.date DESC
    LIMIT $${idx++} OFFSET $${idx++}
  `

  const { rows } = await db.query(query, values)

  // get total count for pagination meta
  const countQuery = `
    SELECT COUNT(*) FROM financial_records
    WHERE ${conditions.slice(0, conditions.length).join(' AND ')}
  `
  const { rows: countRows } = await db.query(
    countQuery,
    values.slice(0, values.length - 2)
  )

  return {
    records: rows,
    pagination: {
      total: parseInt(countRows[0].count),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countRows[0].count) / limit),
    },
  }
}

// Service function to get a single record by ID
export const getRecordById = async (id) => {
  const { rows } = await db.query(
    `SELECT
      fr.*,
      u.name as created_by_name
     FROM financial_records fr
     LEFT JOIN users u ON fr.created_by = u.id
     WHERE fr.id = $1 AND fr.deleted_at IS NULL`,
    [id]
  )
  if (!rows[0]) throw new ApiError(404, 'Record not found')
  return rows[0]
}

// Service function to update a record by ID
export const updateRecord = async (id, dto) => {
  await getRecordById(id)

  const fields = Object.keys(dto)
  const setClause = fields.map((key, i) => `${key} = $${i + 1}`).join(', ')
  const values = [...Object.values(dto), id]

  const { rows } = await db.query(
    `UPDATE financial_records
     SET ${setClause}, updated_at = NOW()
     WHERE id = $${fields.length + 1}
     RETURNING *`,
    values
  )
  return rows[0]
}

// Service function to delete a record by ID (soft delete)
export const deleteRecord = async (id) => {
  await getRecordById(id)
  await db.query(
    `UPDATE financial_records
     SET deleted_at = NOW()
     WHERE id = $1`,
    [id]
  )
}