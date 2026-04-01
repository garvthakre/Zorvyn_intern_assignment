import pg from 'pg'
import { env } from './env.js'

const { Pool } = pg

export const db = new Pool({
  connectionString: env.databaseUrl,
})

export const connectDB = async () => {
  try {
    await db.query('SELECT 1')
    console.log('PostgreSQL connected')
  } catch (error) {
    console.error('Database connection failed:', error.message)
    process.exit(1)
  }
}