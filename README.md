# Finance Dashboard API

Backend for a role-based finance dashboard. Users can track income and expenses, view summaries, and manage financial records — but what they can actually do depends on their role.

Built with Node.js, Express, and PostgreSQL.

---

## Why I built it this way

Went with plain SQL instead of an ORM like Prisma or Sequelize. ORMs are great but they abstract away too much when you're doing aggregations and conditional sums. For the dashboard queries especially, writing raw SQL gave me more control and made the logic clearer.

Kept the folder structure modular — each feature (auth, users, records, dashboard) owns its own routes, controller, service and validator. Makes it easy to find things and easy to extend later without touching unrelated code.

---

## Stack

- Node.js (ES Modules)
- Express
- PostgreSQL
- JWT for auth
- Zod for validation
- bcryptjs for password hashing

---

## Project structure
```
src/
├── modules/
│   ├── auth/          
│   ├── users/         
│   ├── records/       
│   └── dashboard/     
├── middleware/        
├── config/            
├── utils/             
└── app.js             
```

Each module has its own routes, controller, service and validator. Middleware, config and utils are shared across modules.

---

## Roles

## Roles

Three roles in the system — **viewer**, **analyst**, and **admin**.

Viewer is the default. They can browse records and see dashboard summaries
but cannot modify anything.

Analyst gets everything a viewer has plus access to monthly trends and
insights — useful for someone who needs to analyze the data but shouldn't
be touching it.

Admin has full access. Creating, updating and deleting records, managing
users, changing roles — all of that is admin only.

Role checks are handled in middleware via a `requireRole()` guard so the
controllers stay clean and the access logic lives in one place.

Role checks happen at the middleware level using a `requireRole()` guard so the controller stays clean.

---

## Getting started

You'll need Node.js and PostgreSQL installed locally.
```bash
git clone https://github.com/yourusername/zorvyn_intern_assignment
cd zorvyn_intern_assignment
npm install
```

Create a `.env` file in the root:
```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/finance_dashboard
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

Create the database and run the schema:
```bash
psql -U postgres -c "CREATE DATABASE finance_dashboard"
psql -U postgres -d finance_dashboard -f src/config/schema.sql
```

Start the dev server:
```bash
npm run dev
```

Hit `http://localhost:5000/health` to confirm it's running.

---

## API overview

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Users (admin only)
```
GET    /api/users
GET    /api/users/:id
PATCH  /api/users/:id/role
PATCH  /api/users/:id/status
DELETE /api/users/:id
```

### Records
```
GET    /api/records              → all roles
GET    /api/records/:id          → all roles
POST   /api/records              → admin only
PATCH  /api/records/:id          → admin only
DELETE /api/records/:id          → admin only (soft delete)
```

Supports filtering:
```
?type=income|expense
?category=salary
?from=2024-01-01&to=2024-12-31
?page=1&limit=10
```

### Dashboard
```
GET    /api/dashboard/summary       → all roles
GET    /api/dashboard/by-category   → all roles
GET    /api/dashboard/recent        → all roles
GET    /api/dashboard/trends        → analyst and admin only
```

---

## Quick test flow

Register an admin account first:
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "admin"
}
```

Use the token from the response in the Authorization header:
```
Authorization: Bearer <your_token>
```

Create a record:
```json
POST /api/records
{
  "amount": 5000,
  "type": "income",
  "category": "salary",
  "date": "2024-01-15",
  "notes": "January salary"
}
```

Check the dashboard summary:
```
GET /api/dashboard/summary
```

---

## A few things worth noting

- During registration any role can be assigned. In a real app only admins would be able to create other admins — kept it open here for easier testing.
- Soft delete on records means deleted entries stay in the database with a `deleted_at` timestamp. All queries filter these out automatically.
- Monthly trends go back 6 months from the current date. The window is dynamic so no hardcoded dates anywhere.
- Tokens expire in 7 days. No refresh token for now — kept auth simple intentionally.
- Chose LEFT JOIN when fetching records with creator info so records don't disappear if the creator account gets deleted.

---

## If I were to extend this

- Add refresh tokens
- Rate limiting on auth routes
- More granular permissions (analyst creating draft records for example)
- Unit tests on service layer
 