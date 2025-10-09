import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { entryRegistrationController } from "../controllers/vehicleRecord.js";

const router = express.Router();

router.post("/entry", verifyToken, entryRegistrationController); // Registrar ingreso de un vehículo

export default router;
