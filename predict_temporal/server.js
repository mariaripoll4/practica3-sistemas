// server.js
// Entry point del servicio PREDICT

// Cargar variable de entorno (.env)
require("dotenv").config(); 

const express = require("express");
const path = require("path");

// Rutas del servicio
const predictRoutes = require("./routes/predictRoutes");
const { initModel } = require("./services/tfModelService");

// Puerto 
const PORT = process.env.PORT || 3002;
const { connectDB } = require("./services/mongoDBService");


const app = express();
app.use(express.json());

// Servir la carpeta del modelo TFJS (model/model.json + pesos)
const modelDir = path.resolve(__dirname, "model");
app.use("/model", express.static(modelDir));

// Rutas del servicio PREDICT
app.use("/", predictRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, async () => {
      const serverUrl = `http://localhost:${PORT}`;
      console.log(`[PREDICT] Servicio escuchando en ${serverUrl}`);

      try {
        // Cargar modelo TFJS una vez arranca el server
        await initModel(serverUrl);
      } catch (err) {
        console.error("Error al inicializar el modelo:", err);
        process.exit(1);
      }
    });
  })
  .catch(err => {
    console.error("No se pudo conectar a MongoDB:", err.message);
    process.exit(1); // Detener servicio si la DB falla
  });

