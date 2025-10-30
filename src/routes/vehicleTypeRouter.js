import express from "express";
import {
  createVehicleTypeController,
  deleteVehicleTypeController,
  getAllVehicleTypeController,
  getVehicleTypesByBranchController,
  updateVehicleTypeController,
} from "../controllers/vehicleTypeController.js";
import { checkRole, verifyToken } from "../middlewares/authMiddleware.js";
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

router.get("/:id", verifyToken, getVehicleTypesByBranchController); // Obtener tipos de vehículo por sede

router.put("/:id", verifyToken, updateVehicleTypeController);

router.delete(
  "/:id",
  verifyToken,
  checkRole("ADMIN"),
  deleteVehicleTypeController
);

export default router;
