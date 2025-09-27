import express from "express";
import { createBranchController } from "../controllers/branchController.js";
import { validateSchema } from "../middlewares/validate.js";
import { createBranchSchema } from "../schema/branchSchema.js";

const router = express.Router();

router.post("/", validateSchema(createBranchSchema), createBranchController); // Crear una sede

export default router;
