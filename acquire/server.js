require("dotenv").config();
const express = require("express");

const { connectDB } = require("./services/mongoDBService");
const acquireRoutes = require("./routes/acquireRoutes");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Registrar rutas (lo que va antes de la ruta)
app.use("/", acquireRoutes);


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[ACQUIRE] escuchando en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("[ACQUIRE] Error al iniciar servicio:", err.message);
    process.exit(1); // Importante: si falla Mongo, apagar contenedor
  });
