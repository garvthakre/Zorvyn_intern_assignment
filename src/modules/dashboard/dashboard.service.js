import { db } from '../../config/db.js'

// Service functions for dashboard logic
export const getSummary = async () => {
  const { rows } = await db.query(`
    SELECT
      COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0) AS total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses,
      COALESCE(SUM(CASE WHEN type = 'income'  THEN amount
                        WHEN type = 'expense' THEN -amount END), 0)       AS net_balance
    FROM financial_records
    WHERE deleted_at IS NULL
  `)
  return rows[0]
}

// Service function to get totals by category for dashboard
export const getCategoryTotals = async () => {
  const { rows } = await db.query(`
    SELECT
      category,
      type,
      COALESCE(SUM(amount), 0) AS total,
      COUNT(*) AS count
    FROM financial_records
    WHERE deleted_at IS NULL
    GROUP BY category, type
    ORDER BY total DESC
  `)
  return rows
}

// Service function to get monthly trends for dashboard
export const getMonthlyTrends = async () => {
  const { rows } = await db.query(`
    SELECT
      TO_CHAR(DATE_TRUNC('month', date), 'YYYY-MM') AS month,
      COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0) AS income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expenses,
      COALESCE(SUM(CASE WHEN type = 'income'  THEN amount
                        WHEN type = 'expense' THEN -amount END), 0)       AS net
    FROM financial_records
    WHERE
      deleted_at IS NULL
      AND date >= DATE_TRUNC('month', NOW()) - INTERVAL '5 months'
    GROUP BY DATE_TRUNC('month', date)
    ORDER BY DATE_TRUNC('month', date) ASC
  `)
  return rows
}

// Service function to get recent activity for dashboard
export const getRecentActivity = async () => {
  const { rows } = await db.query(`
    SELECT
      fr.id,
      fr.amount,
      fr.type,
      fr.category,
      fr.date,
      fr.notes,
      u.name AS created_by_name
    FROM financial_records fr
    LEFT JOIN users u ON fr.created_by = u.id
    WHERE fr.deleted_at IS NULL
    ORDER BY fr.created_at DESC
    LIMIT 10
  `)
  return rows
}