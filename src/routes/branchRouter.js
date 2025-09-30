import express from "express";
import {
  createBranchController,
  getAllBranchesController,
} from "../controllers/branchController.js";
import { validateSchema } from "../middlewares/validate.js";
import { createBranchSchema } from "../schema/branchSchema.js";
import { checkRole, verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", validateSchema(createBranchSchema), createBranchController); // Crear una sede
router.get("/", verifyToken, checkRole("ADMIN"), getAllBranchesController); // Obtener todos las sedes

export default router;
