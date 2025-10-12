import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  createVehicleEntryController,
  createVehicleExitController,
  getActiveRecordsController,
} from "../controllers/vehicleRecord.js";

const router = express.Router();

router.post("/entry", verifyToken, createVehicleEntryController); // Registrar ingreso de un vehículo

router.post("/exit", verifyToken, createVehicleExitController); // Registrar salida de un vehículo

router.get("/active", verifyToken, getActiveRecordsController); // Obtener ingresos activos

export default router;
