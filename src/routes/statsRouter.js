import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getParkingStatusController } from "../controllers/statsController.js";

const router = express.Router();

router.get("/parking/status/:id", verifyToken, getParkingStatusController);

export default router;
