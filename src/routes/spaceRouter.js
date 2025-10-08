import express from "express";
import { getAllSpacesByZoneController } from "../controllers/spaceController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:zoneId", verifyToken, getAllSpacesByZoneController); // Obtener todas las espacios por zona

export default router;
