import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  createVehicleEntryController,
  createVehicleExitController,
  getActiveRecordsController,
  updateVehicleRecordController,
} from "../controllers/vehicleRecord.js";

const router = express.Router();

router.post("/entry", verifyToken, createVehicleEntryController); // Registrar ingreso de un vehículo

router.post("/exit", verifyToken, createVehicleExitController); // Registrar salida de un vehículo

router.get("/active", verifyToken, getActiveRecordsController); // Obtener ingresos activos

router.put("/:id", verifyToken, updateVehicleRecordController); // Actualizar registro

export default router;
