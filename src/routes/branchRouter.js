import express from "express";
import { createBranchController } from "../controllers/branchController.js";

const router = express.Router();

router.post("/", createBranchController); // Crear una sede

export default router;
