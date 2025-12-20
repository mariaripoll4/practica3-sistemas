// connect_mongo/PredictionLog.js

// Importamos mongoose, librería para conectar Node.js con MongDB
const mongoose = require('mongoose');

// Definimos el formato de cada documento guardado en MongoDB
const PredictionLogSchema = new mongoose.Schema({

    // Fecha y hora de la predicción
    timestamp: {
        type: Date,
        default: Date.now,
        index: true 
    },

    // Que modelo de la IA estamos usando 
    modelVersion: { 
        type: String, 
        required: true,
        index: true 
    },
    
    // Cuántos milisegundos tardó la IA en hacer la predicción
    latencyMs: { 
        type: Number, 
        required: true 
    },

    // Datos de entrada
    features: {
        type: [Number],
        required: true  // aseguramos que haya datos de entrada
    },

    // meta: información del cliente que pidió la predicción 
    meta: {
        dataId: { type: String, required: false },
        source: { type: String, required: false },
        correlationId: { type: String, required: false }
    },

    // Resultado
    prediction: {
        type: Number,
        required: true  // guardar si hay resultado 
  }
});

// Crea un modelo (PredictionLog) y lo exporta para que otros archivos puedan usarlo
module.exports = mongoose.model("PredictionLog", PredictionLogSchema);

