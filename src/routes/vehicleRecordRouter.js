import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  createVehicleEntryController,
  createVehicleExitController,
  getActiveRecordsController,
  getRecordsHistoryController,
  updateVehicleRecordController,
} from "../controllers/vehicleRecord.js";

const router = express.Router();

router.post("/entry", verifyToken, createVehicleEntryController); // Registrar ingreso de un vehículo

router.post("/exit", verifyToken, createVehicleExitController); // Registrar salida de un vehículo

router.get("/active/:id", verifyToken, getActiveRecordsController); // Obtener ingresos activos de iuna sede

router.put("/:id", verifyToken, updateVehicleRecordController); // Actualizar registro

router.get("/filtered", verifyToken, getRecordsHistoryController); // Obtener registros filtrados

export default router;
