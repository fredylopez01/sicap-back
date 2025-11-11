import express from "express";
import { verifyToken, checkRole } from "../middlewares/authMiddleware.js";
import { validateSchema } from "../middlewares/validate.js";
import {
    createScheduleSchema,
    createMultipleSchedulesSchema,
    updateScheduleSchema,
} from "../schema/scheduleSchema.js";
import {
    createScheduleController,
    createMultipleSchedulesController,
    getSchedulesByBranchController,
    getScheduleByDayController,
    updateScheduleController,
    deleteScheduleController,
    hardDeleteAllBranchSchedules,
} from "../controllers/scheduleController.js";

const router = express.Router();

// Crear un horario individual
router.post(
    "/",
    verifyToken,
    checkRole("ADMIN"),
    validateSchema(createScheduleSchema),
    createScheduleController
);

// Crear múltiples horarios
router.post(
    "/batch",
    verifyToken,
    checkRole("ADMIN"),
    validateSchema(createMultipleSchedulesSchema),
    createMultipleSchedulesController
);

// Obtener todos los horarios de una sede
router.get(
    "/branch/:branchId",
    verifyToken,
    getSchedulesByBranchController
);

// Obtener horario de un día específico
router.get(
    "/branch/:branchId/day/:dayOfWeek",
    verifyToken,
    getScheduleByDayController
);

// Actualizar un horario
router.put(
    "/:scheduleId",
    verifyToken,
    checkRole("ADMIN"),
    validateSchema(updateScheduleSchema),
    updateScheduleController
);

// Eliminar un horario
router.delete(
    "/:scheduleId",
    verifyToken,
    checkRole("ADMIN"),
    deleteScheduleController
);

router.delete("/branch/:branchId/all/permanent", hardDeleteAllBranchSchedules);

export default router;