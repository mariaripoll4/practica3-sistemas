const express = require("express");
const router = express.Router();

const { acquireData } = require("../controllers/acquireController");

// Healthcheck
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "acquire"
  });
});

// Endpoint oficial del contrato
router.post("/data", acquireData);

module.exports = router;
