// controllers/predictController.js
const { getModelInfo, predict } = require("../services/tfModelService");
const PredictionLog = require("../connect_mongo/PredictionLog");


// FUNCION VICTORIA DEL TIEMPO IMPORTANTE
// Si son 23:00 o más → predecimos mañana
//Si no → predecimos hoy

function getTargetDates() {
  const now = new Date();
  const target = new Date();

  if (now.getHours() >= 23) {
    target.setDate(target.getDate() + 1);
  }

  const time_end = new Date(target);
  time_end.setDate(time_end.getDate() - 1);

  const time_start = new Date(time_end);
  time_start.setDate(time_start.getDate() - 3);

  return { target, time_start, time_end };
}

function health(req, res) {
  res.json({
    status: "ok",
    service: "predict"
  });
}

function ready(req, res) {
  const info = getModelInfo();

  if (!info.ready) {
    return res.status(503).json({
      ready: false,
      modelVersion: info.modelVersion,
      message: "Model is still loading"
    });
  }

  res.json({
    ready: true,
    modelVersion: info.modelVersion
  });
}

async function doPredict(req, res) {
  const start = Date.now();

  try {
    const info = getModelInfo();
    if (!info.ready) {
      return res.status(503).json({
        error: "Model not ready",
        ready: false
      });
    }

    // BODY DEL CONTRATO
  
    const { features, meta } = req.body;

    if (!features) {
      return res.status(400).json({ error: "Missing features" });
    }
    if (!meta || typeof meta !== "object") {
      return res.status(400).json({ error: "Missing meta object" });
    }

    // Validar featureCount EXACTO del contrato
    const { featureCount } = meta;

    if (featureCount !== info.inputDim) {
      return res.status(400).json({
        error: `featureCount must be ${info.inputDim}, received ${featureCount}`
      });
    }

    // Validar array de features
    if (!Array.isArray(features) || features.length !== info.inputDim) {
      return res.status(400).json({
        error: `features must be an array of ${info.inputDim} numbers`
      });
    }

    // CÁLCULO AUTOMÁTICO DE FECHAS

    const { target, time_start, time_end } = getTargetDates();

    // Guardamos las fechas como metadatos
    meta.targetDate = target.toISOString();
    meta.timeStart = time_start.toISOString();
    meta.timeEnd = time_end.toISOString();

    // HACER PREDICCIÓN

    const prediction = await predict(features);
    const latencyMs = Date.now() - start;
    const timestamp = new Date().toISOString();

    let predictionId = null;

    try {
      // Guardar predicción en MongoDB 
      const savedLog = await PredictionLog.create({
        modelVersion: info.modelVersion,
        latencyMs,
        timestamp,
        features,
        meta,       
        prediction
      });

      predictionId = savedLog._id;
      console.log(`Log de predicción guardado con ID: ${predictionId}`);

    } catch (dbError) {
      console.error("Advertencia: No se pudo guardar el log en MongoDB:", dbError.message);
    }

    // RESPUESTA EXACTA DEL CONTRATO

    res.status(201).json({
      predictionId,
      prediction,
      timestamp,
      latencyMs
    });
    
  } catch (err) {
    console.error("Error en /predict:", err);
    res.status(500).json({ error: "Internal error" });
  }
}

module.exports = {
  health,
  ready,
  doPredict
};
