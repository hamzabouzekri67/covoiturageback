require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Utils
const AppError = require("./utils/appError"); // 👈 important

// Middlewares
const errorHandler = require("./middleware/errorHandler");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const trajetRoutes = require("./routes/trajetRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();

// Middlewares de sécurité
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Connexion MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 MongoDB connecté avec succès"))
  .catch((err) => {
    console.error("🔴 Erreur de connexion à MongoDB:", err.message);
    process.exit(1);
  });

// Routes API
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/trajets", trajetRoutes);
app.use("/api/v1/reservations", reservationRoutes);
app.use("/api/v1/feedbacks", feedbackRoutes);

// Route de santé
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API opérationnelle",
    timestamp: new Date().toISOString(),
  });
});

// Gestion des routes non définies (404)
app.all("*", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} introuvable`, 404));
});

// Middleware de gestion d'erreurs 
app.use(errorHandler);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🌐 API disponible à l'adresse: http://localhost:${PORT}/api/v1`);
});

// Gestion des promesses non gérées
process.on("unhandledRejection", (err) => {
  console.error("🔴 Erreur non gérée:", err.name, err.message);
  server.close(() => process.exit(1));
}); 
 
// Signal d'arrêt propre 
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM reçu. Arrêt propre du serveur"); 
  server.close(() => console.log("🛑 Process terminé"));
});
 