import express from "express";
import {
  createUserController,
  getAllUsersController,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUserController); // Crear usuario
router.get("/", getAllUsersController); // Obtener todos los usuarios

export default router;
