import express from "express";
import {
  createBranchController,
  deleteBranchController,
  getAllBranchesController,
  updateBranchController,
} from "../controllers/branchController.js";
import { validateSchema } from "../middlewares/validate.js";
import { createBranchSchema } from "../schema/branchSchema.js";
import { checkRole, verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", validateSchema(createBranchSchema), createBranchController); // Crear una sede
router.get("/", verifyToken, checkRole("ADMIN"), getAllBranchesController); // Obtener todos las sedes

router.put("/:id", verifyToken, updateBranchController); // Actualizar datos de un usuario

router.delete("/:id", verifyToken, checkRole("ADMIN"), deleteBranchController); // Elimina o desactiva un usuario según corresponda

export default router;
