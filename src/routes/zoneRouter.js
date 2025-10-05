import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  createZoneController,
  getAllZonesByBranchController,
} from "../controllers/zoneController.js";
import { validateSchema } from "../middlewares/validate.js";
import { createZoneSchema } from "../schema/zoneSchema.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  validateSchema(createZoneSchema),
  createZoneController
); // Crear zona

router.get("/:branchId", getAllZonesByBranchController); // Obtener todas las zonas por parqueadero

export default router;
