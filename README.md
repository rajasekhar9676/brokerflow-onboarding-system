# BrokerFlow Onboarding System

Production-ready MERN-style SaaS onboarding system with role-based access (ADMIN, BROKER), JWT auth, and customer onboarding.

## Tech Stack

**Backend:** Node.js, Express, PostgreSQL (Prisma), JWT, bcrypt  
**Frontend:** React (Vite), Tailwind CSS, React Router, Axios, React Hook Form, Zod

## Prerequisites

- Node.js 18+
- PostgreSQL database ([Neon](https://neon.tech) recommended for hosting)
- npm or yarn

### Database: Neon (PostgreSQL)

1. Sign up at [neon.tech](https://neon.tech) and create a project.
2. Open **Dashboard → your project → Connection details**.
3. Copy **Pooled connection** string → use as `DATABASE_URL` in `backend/.env`.
4. Copy **Direct connection** string → use as `DIRECT_URL` in `backend/.env`.
5. Both URLs must include `?sslmode=require` (Neon includes this by default).

**Shortcut:** If you only copy one Neon URL (direct, non-pooler), paste it into **both** `DATABASE_URL` and `DIRECT_URL` in `.env`.

Then run migrations or push schema (see Backend setup below).

## Setup Instructions

### 1. Backend

```bash
cd backend
npm install
```

Create `.env` in `backend/` with `DATABASE_URL`, `DIRECT_URL`, and JWT (see [Backend .env](#backend-env)).

```bash
npx prisma generate
npx prisma migrate deploy
# or first-time: npx prisma db push
npm run dev
```

API runs at `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
```

Create `.env` in `frontend/` (see [Frontend .env](#frontend-env) below).

```bash
npm run dev
```

App runs at `http://localhost:5173`.

### 3. First-time usage

1. Open `http://localhost:5173/register`.
2. Register with role **Admin** to get admin access, or **Broker** for broker access.
3. **Admin:** Dashboard shows all users.
4. **Broker:** Dashboard shows your customers; use "New Customer" to onboard (name, email, GSTIN).

## API Overview

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/register` | No | - | Register |
| POST | `/api/auth/login` | No | - | Login |
| GET | `/api/auth/me` | JWT | Any | Current user |
| POST | `/api/customers` | JWT | Broker/Admin | Create customer |
| GET | `/api/customers` | JWT | Broker/Admin | List my customers |
| GET | `/api/users` | JWT | Admin | List all users |

## Project Structure

```
backend/
  controllers/   # auth, customer, user
  routes/
  middleware/    # authMiddleware (JWT, adminOnly, brokerOnly)
  prisma/        # schema.prisma
  lib/           # prisma client
  app.js

frontend/
  src/
    pages/       # Login, Register, Dashboard, CreateCustomer
    components/  # Navbar, ProtectedRoute
    context/     # AuthContext
    services/    # api.js (Axios + token)
```

## Sample .env Files

**Backend (`backend/.env`)** – copy from `backend/.env.example`.

**Neon:**

```env
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:5173"
PORT=5000
```

**Local PostgreSQL:** set `DIRECT_URL` to the **same** value as `DATABASE_URL`.

**Frontend (`frontend/.env`)** – copy from `frontend/.env.example`:

```env
VITE_API_URL=/api
```

Use `/api` when running frontend with `npm run dev` (Vite proxies to the backend). For a separate deployment, set `VITE_API_URL` to the full API URL (e.g. `https://api.yourdomain.com/api`).

## Scripts

**Backend**

- `npm run dev` – run with watch
- `npm start` – run production
- `npx prisma studio` – DB GUI

**Frontend**

- `npm run dev` – dev server
- `npm run build` – production build
- `npm run preview` – preview build
