import express from "express";
import dotenv from "dotenv";
import orchestratorRoutes from "./routes/orchestrator.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/", orchestratorRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Orchestrator running on port ${process.env.PORT}`);
});
