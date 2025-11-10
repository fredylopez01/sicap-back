import { Router } from "express";
import { getParkingReportController } from "../controllers/reportController.js";
import { checkRole, verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", verifyToken, checkRole("ADMIN"), getParkingReportController);

export default router;
