const express = require("express");
const router = express.Router();

const { acquireData } = require("../controllers/acquireController");

// Health
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "acquire"
  });
});

router.post("/data", acquireData);

module.exports = router;
