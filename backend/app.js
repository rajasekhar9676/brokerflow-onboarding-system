import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Request logging (method, url, then status after response)
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    const log = `${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`;
    if (res.statusCode >= 400) {
      console.error("[ERROR]", log);
    } else {
      console.log("[REQUEST]", log);
    }
  });
  next();
});

// CORS: handle preflight first so OPTIONS never hits a 404 without headers.
// Echo request Origin so Vercel preview URLs (any *.vercel.app) always work.
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

app.use(express.json());

// Root route so GET / doesn't return "Cannot GET /"
app.get("/", (req, res) => {
  res.json({
    name: "BrokerFlow Onboarding API",
    docs: "API base: /api",
    health: "/api/health",
    auth: "/api/auth (register, login, me)",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "BrokerFlow API is running" });
});

// Central error logger: log full error so you can see why it failed
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  console.error("---------- BACKEND ERROR ----------");
  console.error("Message:", err.message);
  console.error("Status:", status);
  console.error("Stack:", err.stack);
  if (err.name) console.error("Name:", err.name);
  if (err.code) console.error("Code:", err.code);
  if (err.meta) console.error("Meta:", err.meta);
  console.error("-----------------------------------");
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`BrokerFlow API running on http://localhost:${PORT}`);
  if (!process.env.JWT_SECRET) {
    console.warn("WARN: JWT_SECRET is not set in .env - auth will fail");
  }
  if (!process.env.DATABASE_URL) {
    console.warn("WARN: DATABASE_URL is not set in .env - DB will fail");
  }
});
