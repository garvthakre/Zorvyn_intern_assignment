import bcrypt from 'bcryptjs'
import { db, connectDB } from '../db.js'

const users = [
  {
    name: 'Alex Morgan',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Sarah Chen',
    email: 'analyst@example.com',
    password: 'analyst123',
    role: 'analyst',
  },
  {
    name: 'Raj Patel',
    email: 'viewer@example.com',
    password: 'viewer123',
    role: 'viewer',
  },
]

const records = [
  { amount: 75000, type: 'income',  category: 'salary',      date: '2024-10-01', notes: 'October salary' },
  { amount: 1200,  type: 'expense', category: 'rent',        date: '2024-10-02', notes: 'Monthly rent' },
  { amount: 300,   type: 'expense', category: 'utilities',   date: '2024-10-05', notes: 'Electricity and water' },
  { amount: 5000,  type: 'income',  category: 'freelance',   date: '2024-10-08', notes: 'Website project' },
  { amount: 150,   type: 'expense', category: 'groceries',   date: '2024-10-10', notes: null },
  { amount: 800,   type: 'expense', category: 'transport',   date: '2024-10-12', notes: 'Car service' },
  { amount: 75000, type: 'income',  category: 'salary',      date: '2024-11-01', notes: 'November salary' },
  { amount: 1200,  type: 'expense', category: 'rent',        date: '2024-11-02', notes: 'Monthly rent' },
  { amount: 2000,  type: 'income',  category: 'freelance',   date: '2024-11-15', notes: 'Logo design project' },
  { amount: 450,   type: 'expense', category: 'groceries',   date: '2024-11-18', notes: null },
  { amount: 200,   type: 'expense', category: 'utilities',   date: '2024-11-20', notes: 'Internet bill' },
  { amount: 75000, type: 'income',  category: 'salary',      date: '2024-12-01', notes: 'December salary' },
  { amount: 1200,  type: 'expense', category: 'rent',        date: '2024-12-02', notes: 'Monthly rent' },
  { amount: 3500,  type: 'expense', category: 'shopping',    date: '2024-12-15', notes: 'Christmas gifts' },
  { amount: 1000,  type: 'income',  category: 'freelance',   date: '2024-12-20', notes: 'Content writing' },
  { amount: 75000, type: 'income',  category: 'salary',      date: '2025-01-01', notes: 'January salary' },
  { amount: 1200,  type: 'expense', category: 'rent',        date: '2025-01-02', notes: 'Monthly rent' },
  { amount: 600,   type: 'expense', category: 'transport',   date: '2025-01-10', notes: 'Flight tickets' },
  { amount: 75000, type: 'income',  category: 'salary',      date: '2025-02-01', notes: 'February salary' },
  { amount: 1200,  type: 'expense', category: 'rent',        date: '2025-02-02', notes: 'Monthly rent' },
  { amount: 4000,  type: 'income',  category: 'freelance',   date: '2025-02-14', notes: 'Mobile app project' },
  { amount: 350,   type: 'expense', category: 'groceries',   date: '2025-02-20', notes: null },
  { amount: 75000, type: 'income',  category: 'salary',      date: '2025-03-01', notes: 'March salary' },
  { amount: 1200,  type: 'expense', category: 'rent',        date: '2025-03-02', notes: 'Monthly rent' },
  { amount: 900,   type: 'expense', category: 'utilities',   date: '2025-03-10', notes: 'Quarterly maintenance' },
]

const seed = async () => {
  await connectDB()

  console.log('Seeding started...')

  // clear existing data in correct order
  await db.query('DELETE FROM financial_records')
  await db.query('DELETE FROM users')

  // seed users
  const createdUsers = []

  for (const user of users) {
    const password_hash = await bcrypt.hash(user.password, 10)
    const { rows } = await db.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [user.name, user.email, password_hash, user.role]
    )
    createdUsers.push(rows[0])
    console.log(`  created user → ${rows[0].email} (${rows[0].role})`)
  }

  // admin user creates all records
  const adminUser = createdUsers.find((u) => u.role === 'admin')

  // seed records
  for (const record of records) {
    await db.query(
      `INSERT INTO financial_records (amount, type, category, date, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [record.amount, record.type, record.category, record.date, record.notes, adminUser.id]
    )
  }

  console.log(`  created ${records.length} financial records`)
  console.log('Seeding complete.')
  console.log('')
  console.log('Test credentials:')
  console.log('  admin    → admin@example.com    / admin123')
  console.log('  analyst  → analyst@example.com  / analyst123')
  console.log('  viewer   → viewer@example.com   / viewer123')

  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})