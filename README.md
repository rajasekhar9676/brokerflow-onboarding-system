# 🚀 BrokerFlow Onboarding System

> Built with production practices: security, RBAC, validation, clean structure.

BrokerFlow is a full-stack SaaS onboarding system for brokers to onboard customers with secure authentication and role-based access control.

---

## 🌐 Live Demo

- **Frontend**: (add your Vercel URL)
- **Backend API**: `https://brokerflow-onboarding-system.onrender.com`
  - **Health**: `https://brokerflow-onboarding-system.onrender.com/api/health`

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Axios
- React Hook Form + Zod

### Backend
- Node.js + Express
- PostgreSQL (Neon) + Prisma ORM

### Authentication & Security
- JWT authentication (Authorization: Bearer token)
- bcrypt password hashing
- Role-based access control (ADMIN, BROKER)
- Backend request validation (express-validator)

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: Neon (PostgreSQL)

---

## ✨ Features

- **Authentication**: Register/Login, hashed passwords, JWT token
- **RBAC**:
  - **ADMIN**: view all users
  - **BROKER**: create customers and view own customers
- **Customer onboarding**: name, email, gstin; linked to the logged-in broker
- **Dashboards**:
  - Broker dashboard: customer list
  - Admin dashboard: all users + customers created by admin
- **Validation**:
  - Frontend: Zod
  - Backend: express-validator
- **UX**: loading states + error handling

---

## 🧱 Architecture Overview

Frontend (Vercel) → Backend API (Render) → PostgreSQL (Neon)

---

## 📁 Project Structure

```text
brokerflow-onboarding-system/
  backend/
    controllers/
    routes/
    middleware/
    prisma/
    lib/
    app.js
  frontend/
    public/
    src/
      pages/
      components/
      context/
      services/
```

---

## 🗄 Database Schema (Prisma)

### User
- id
- name
- email (unique)
- password (hashed)
- role (ADMIN / BROKER)
- createdAt, updatedAt

### Customer
- id
- name
- email
- gstin
- brokerId (linked to User)
- createdAt, updatedAt

---

## 📦 API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)

### Customers (protected: BROKER/ADMIN)
- `POST /api/customers`
- `GET /api/customers` (my customers)

### Admin (protected: ADMIN)
- `GET /api/users`

---

## ⚙️ Local Setup

### 1) Clone

```bash
git clone https://github.com/rajasekhar9676/brokerflow-onboarding-system
cd brokerflow-onboarding-system
```

### 2) Backend setup (`backend/`)

```bash
cd backend
npm install
```

Create `backend/.env` (copy from `backend/.env.example`).

Run Prisma and start API:

```bash
npx prisma generate
npx prisma db push
npm run dev
```

Backend runs at `http://localhost:5000`.

### 3) Frontend setup (`frontend/`)

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## 🌐 Deployment Guide

### Backend (Render)

- Create a Render **Web Service** from this repo.
- Set **Root Directory** to `backend` (or set build/start commands accordingly).
- Set environment variables (Render → Service → Environment):
  - `DATABASE_URL` and `DIRECT_URL` (from Neon)
  - `JWT_SECRET`
  - `FRONTEND_URL` = your Vercel frontend URL (recommended)

Then deploy.

### Database (Neon)

- Create a Neon project
- Copy:
  - **Pooled** connection → `DATABASE_URL`
  - **Direct** connection → `DIRECT_URL`

### Frontend (Vercel)

- Import the repo in Vercel.
- Set **Root Directory** to `frontend`.
- Add environment variable:
  - `VITE_API_URL` = `https://brokerflow-onboarding-system.onrender.com/api`

For SPA routing on Vercel (`/login`, `/register` refresh), this repo includes `frontend/vercel.json` rewrites.

---

## 🔐 Security Implementation

- Password hashing with bcrypt
- JWT auth middleware to protect routes
- Role checks for admin-only APIs
- Input validation on frontend (Zod) and backend (express-validator)

---

## 🧪 Testing Checklist

- Register user (BROKER)
- Login user
- Verify JWT token persists (localStorage)
- Create customer
- Fetch customers
- Register/Login as ADMIN
- Admin can fetch all users (`/api/users`)
- Unauthorized access blocked (no token / wrong role)