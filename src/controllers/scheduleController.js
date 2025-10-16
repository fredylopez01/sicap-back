import {
    createSchedule,
    createMultipleSchedules,
    getSchedulesByBranch,
    getScheduleByDay,
    updateSchedule,
    deleteSchedule,
} from "../services/scheduleService.js";

// Crear un horario individual
async function createScheduleController(req, res, next) {
    try {
        const schedule = await createSchedule(req.body);
        return res.status(201).json({
            success: true,
            message: "Horario creado exitosamente",
            data: schedule,
        });
    } catch (error) {
        next(error);
    }
}

// Crear múltiples horarios
async function createMultipleSchedulesController(req, res, next) {
    try {
        const { branchId, schedules } = req.body;
        const createdSchedules = await createMultipleSchedules(branchId, schedules);
        return res.status(201).json({
            success: true,
            message: `${createdSchedules.length} horarios creados exitosamente`,
            data: createdSchedules,
        });
    } catch (error) {
        next(error);
    }
}

// Obtener horarios por sede
async function getSchedulesByBranchController(req, res, next) {
    try {
        const branchId = parseInt(req.params.branchId, 10);
        const schedules = await getSchedulesByBranch(branchId);
        return res.status(200).json({
            success: true,
            message: "Horarios recuperados exitosamente",
            data: schedules,
        });
    } catch (error) {
        next(error);
    }
}

// Obtener horario por día específico
async function getScheduleByDayController(req, res, next) {
    try {
        const branchId = parseInt(req.params.branchId, 10);
        const { dayOfWeek } = req.params;

        const schedule = await getScheduleByDay(branchId, dayOfWeek);

        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: "No se encontró horario para este día",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Horario recuperado exitosamente",
            data: schedule,
        });
    } catch (error) {
        next(error);
    }
}

// Actualizar un horario
async function updateScheduleController(req, res, next) {
    try {
        const scheduleId = parseInt(req.params.scheduleId, 10);
        const updatedSchedule = await updateSchedule(scheduleId, req.body);
        return res.status(200).json({
            success: true,
            message: "Horario actualizado exitosamente",
            data: updatedSchedule,
        });
    } catch (error) {
        next(error);
    }
}

// Eliminar un horario
async function deleteScheduleController(req, res, next) {
    try {
        const scheduleId = parseInt(req.params.scheduleId, 10);
        await deleteSchedule(scheduleId);
        return res.status(200).json({
            success: true,
            message: "Horario eliminado exitosamente",
        });
    } catch (error) {
        next(error);
    }
}

export {
    createScheduleController,
    createMultipleSchedulesController,
    getSchedulesByBranchController,
    getScheduleByDayController,
    updateScheduleController,
    deleteScheduleController,
};