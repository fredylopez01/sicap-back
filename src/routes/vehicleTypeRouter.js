import express from "express";
import {
  createVehicleTypeController,
  getAllVehicleTypeController,
} from "../controllers/vehicleTypeController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { validateSchema } from "../middlewares/validate.js";
import { createVehicleTypeSchema } from "../schema/vehicleTypeSchema.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  validateSchema(createVehicleTypeSchema),
  createVehicleTypeController
); // Crear tipo de vehículo
router.get("/", verifyToken, getAllVehicleTypeController); // Obtener todos los tipos de vehículo

export default router;
