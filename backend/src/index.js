const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const clientRoutes = require("./routes/clients");
const vehicleRoutes = require("./routes/vehicles");
const repairRoutes = require("./routes/repairs");
const partRoutes = require("./routes/parts");
const invoiceRoutes = require("./routes/invoices");
const appointmentRoutes = require("./routes/appointments");
const userRoutes = require("./routes/users");

const db = require("./config/database");

const app = express();
const PORT = process.env.PORT || 3001;

function getCorsOrigins() {
  const raw = process.env.CORS_ORIGIN || "";
  const envOrigins = raw
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  // Always allow common localhost dev ports
  const defaultOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:8080",
    "http://localhost:8081",
    "http://localhost:8082",
    "http://localhost:8083",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
    "http://127.0.0.1:3003",
  ];
  return [...new Set([...defaultOrigins, ...envOrigins])];
}

// Middleware
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      const allowed = getCorsOrigins();
      if (!origin || allowed.includes("*") || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origine non autorisée (${origin})`));
      }
    },
    credentials: true,
  }),
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/repairs", repairRoutes);
app.use("/api/parts", partRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);

/** Vérifie que l’API tourne et que PostgreSQL répond (utile pour diagnostiquer « erreur à l’ajout client »). */
app.get("/api/health", async (req, res) => {
  const payload = {
    ok: true,
    service: "e-garage-backend",
    database: "unknown",
  };
  try {
    await db.query("SELECT 1 AS ok");
    payload.database = "connected";
    return res.json(payload);
  } catch (err) {
    console.error("Health check DB error:", err);
    payload.ok = false;
    payload.database = "disconnected";
    payload.error = err instanceof Error ? err.message : "PostgreSQL inaccessible";
    return res.status(503).json(payload);
  }
});

// Route de base
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur l'API E-Garage" });
});

// Gestion des erreurs 404
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erreur serveur interne" });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

// Trigger nodemon reload — CORS updated

