# BrokerFlow Onboarding System

Production-ready MERN-style SaaS onboarding system with role-based access (ADMIN, BROKER), JWT auth, and customer onboarding.

## Tech Stack

**Backend:** Node.js, Express, PostgreSQL (Prisma), JWT, bcrypt  
**Frontend:** React (Vite), Tailwind CSS, React Router, Axios, React Hook Form, Zod

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

## Setup Instructions

### 1. Backend

```bash
cd backend
npm install
```

Create `.env` in `backend/` (see [Backend .env](#backend-env) below).

```bash
npx prisma generate
npx prisma db push
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

**Backend (`backend/.env`)** – copy from `backend/.env.example`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/brokerflow?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:5173"
PORT=5000
```

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
