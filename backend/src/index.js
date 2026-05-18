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

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
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
