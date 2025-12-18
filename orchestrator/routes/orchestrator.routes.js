import { Router } from "express";
import { runPipeline } from "../controller/controller.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", service: "orchestrator" });
});

router.post("/run", runPipeline);

export default router;
