import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import errorHandler from "./src/middlewares/errorHandler.js";
import authRouter from "./src/routes/authRouter.js";
import userRouter from "./src/routes/userRouter.js";
import branchRouter from "./src/routes/branchRouter.js";
import vehicleTypeRouter from "./src/routes/vehicleTypeRouter.js";
import zoneRouter from "./src/routes/zoneRouter.js";
import spaceRouter from "./src/routes/spaceRouter.js";
import vehicleRecordRouter from "./src/routes/vehicleRecordRouter.js";
import scheduleRouter from "./src/routes/scheduleRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta base
app.get("/", (req, res) => {
  res.send("🚗 SICAP Backend is running!");
});

// Rutas
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/branches", branchRouter);
app.use("/api/vehicleTypes", vehicleTypeRouter);
app.use("/api/zones", zoneRouter);
app.use("/api/spaces", spaceRouter);
app.use("/api/vehicleRecords", vehicleRecordRouter);
app.use("/api/schedules", scheduleRouter);

// Middleware de manejo de errores (al final)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
