import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export const runPipeline = async (req, res) => {
  try {
    const acquireResp = await fetch(process.env.ACQUIRE_URL, { method: "POST" });

    if (!acquireResp.ok) {
      return res.status(502).json({
        error: "Acquire service failed",
        status: acquireResp.status,
      });
    }

    const acquireData = await acquireResp.json();
    const { dataId, features, featureCount} = acquireData;

    const predictResp = await fetch(process.env.PREDICT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        features,
        meta: {
          featureCount,
          dataId,
          source: "orchestrator"
        }
      })
    });


    if (!predictResp.ok) {
      return res.status(502).json({
        error: "Predict service failed",
        status: predictResp.status,
      });
    }

    const pred = await predictResp.json();

    return res.json({
      dataId,
      predictionId: pred.predictionId,
      prediction: pred.prediction,
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    return res.status(500).json({
      error: "Internal orchestrator error",
      details: err.message,
    });
  }
};
