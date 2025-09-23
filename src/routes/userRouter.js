import express from "express";
import {
  createUserController,
  getAllUsersController,
} from "../controllers/userController.js";
import { checkRole, verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", createUserController); // Crear usuario
router.get("/", verifyToken, checkRole("ADMIN"), getAllUsersController); // Obtener todos los usuarios

export default router;
