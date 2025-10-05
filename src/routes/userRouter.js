import express from "express";
import {
  createUserController,
  getAllUsersController,
} from "../controllers/userController.js";
import { checkRole, verifyToken } from "../middlewares/authMiddleware.js";
import { validateSchema } from "../middlewares/validate.js";
import { createUserSchema } from "../schema/UserSchema.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  validateSchema(createUserSchema),
  createUserController
); // Crear usuario

router.get("/", verifyToken, checkRole("ADMIN"), getAllUsersController); // Obtener todos los usuarios

export default router;
