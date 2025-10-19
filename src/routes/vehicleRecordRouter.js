import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  createVehicleEntryController,
  createVehicleExitController,
  getActiveRecordsByBranchController,
  getDailySummaryController,
  getRecordsHistoryController,
  updateVehicleRecordController,
} from "../controllers/vehicleRecord.js";

const router = express.Router();

router.post("/entry", verifyToken, createVehicleEntryController); // Registrar ingreso de un vehículo

router.post("/exit", verifyToken, createVehicleExitController); // Registrar salida de un vehículo

router.get("/active/:id", verifyToken, getActiveRecordsByBranchController); // Obtener ingresos activos de una sede

router.put("/:id", verifyToken, updateVehicleRecordController); // Actualizar registro

router.post("/filtered", verifyToken, getRecordsHistoryController); // Obtener registros filtrados

router.post("/dailySummary/:id", verifyToken, getDailySummaryController); // Obtener resumen diario de una sede

export default router;
