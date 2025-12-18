const { fetchKunna } = require("../services/kunnaService");
const AcquireLog = require("../models/AcquireLog");

// --------------------------
// 1. Función principal /data
// --------------------------
async function acquireData(req, res) {
  try {
    // El contrato NO permite body → usamos últimos días automáticamente
    const now = new Date();
    const timeEnd = now;
    const timeStart = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // últimos 3 días

    // 1) Llamar a Kunna
    const result = await fetchKunna(timeStart, timeEnd);
    const { columns, values } = result;

    // Localizar columna "value"
    const indexValue = columns.indexOf("value");
    if (indexValue === -1) throw new Error("Missing 'value' column");

    const dailyValues = values.map(row => row[indexValue]);

    // Necesitamos al menos 3 valores para consumo_t, t-1, t-2
    if (dailyValues.length < 3) {
      return res.status(502).json({
        error: "Not enough data from external API"
      });
    }

    // --------------------------
    // 2) Construir las 7 features
    // --------------------------
    const consumo_t = dailyValues[dailyValues.length - 1];
    const consumo_t_1 = dailyValues[dailyValues.length - 2];
    const consumo_t_2 = dailyValues[dailyValues.length - 3];

    const nowDate = new Date();
    const hora = nowDate.getHours();
    const dia_semana = nowDate.getDay();    // 0=domingo
    const mes = nowDate.getMonth() + 1;     // 1-12
    const dia_mes = nowDate.getDate();      // 1-31

    const features = [
      consumo_t,
      consumo_t_1,
      consumo_t_2,
      hora,
      dia_semana,
      mes,
      dia_mes
    ];

    // --------------------------
    // 3) Guardar en MongoDB
    // --------------------------
    const saved = await AcquireLog.create({
      features,
      featureCount: 7,
      scalerVersion: "v1",
      createdAt: new Date()
    });

    // --------------------------
    // 4) Respuesta EXACTA contrato
    // --------------------------
    return res.status(201).json({
      dataId: saved._id,
      features: saved.features,
      featureCount: saved.featureCount,
      scalerVersion: saved.scalerVersion,
      createdAt: saved.createdAt
    });

  } catch (err) {
    console.error("[ACQUIRE /data] ERROR:", err);
    return res.status(500).json({
      error: "Acquire failed",
      details: err.message
    });
  }
}

module.exports = { acquireData };

