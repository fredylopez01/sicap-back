import express from "express";
import { checkRole, verifyToken } from "../middlewares/authMiddleware.js";
import {
  createZoneController,
  getAllZonesByBranchController,
  updateZoneController,
  deleteZoneController,
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

// Actualizar zona
router.put(
  "/:id",
  verifyToken,
  updateZoneController
);

// Eliminar zona
router.delete(
  "/:id",
  verifyToken,
  checkRole("ADMIN"),
  deleteZoneController
);

export default router;
