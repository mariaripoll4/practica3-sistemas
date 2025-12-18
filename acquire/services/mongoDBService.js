require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("[ACQUIRE] MongoDB conectado");
  } catch (err) {
    console.error("[ACQUIRE] Error al conectar MongoDB:", err.message);
    process.exit(1);
  }
}

module.exports = { connectDB };
