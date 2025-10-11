import express from "express";
import {
  createUserController,
  deleteUserController,
  getAllUsersController,
  updateUserController,
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

router.put("/:id", verifyToken, updateUserController); // Actualizar datos de un usuario

router.delete("/:id", verifyToken, checkRole("ADMIN"), deleteUserController); // Elimina o desactiva un usuario según corresponda

export default router;
