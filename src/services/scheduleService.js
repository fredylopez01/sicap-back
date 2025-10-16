import prisma from "../db/prismaClient.js";
import { ConflictDBError, NotFoundError } from "../models/Error.js";
import { getBranchById } from "./branchServerice.js";

// Crear un horario individual
async function createSchedule(scheduleData) {
    // Verificar si la sede existe
    const branch = await getBranchById(scheduleData.branchId);
    if (!branch) {
        throw new NotFoundError("Esta sede no existe, por favor verifique.");
    }

    // Verificar si ya existe un horario para ese día en esa sede
    const existingSchedule = await prisma.schedule.findUnique({
        where: {
            unique_sede_dia: {
                branchId: scheduleData.branchId,
                dayOfWeek: scheduleData.dayOfWeek,
            },
        },
    });

    if (existingSchedule) {
        throw new ConflictDBError(
            `Ya existe un horario para el día ${scheduleData.dayOfWeek} en esta sede`
        );
    }

    // Crear el horario
    const schedule = await prisma.schedule.create({
        data: {
            branchId: scheduleData.branchId,
            dayOfWeek: scheduleData.dayOfWeek,
            openingTime: new Date(`1970-01-01T${scheduleData.openingTime}:00.000Z`),
            closingTime: new Date(`1970-01-01T${scheduleData.closingTime}:00.000Z`),
        },
        include: {
            branch: {
                select: {
                    id: true,
                    name: true,
                    city: true,
                },
            },
        },
    });

    return schedule;
}

// Crear múltiples horarios de una vez
async function createMultipleSchedules(branchId, schedulesArray) {
    // Verificar si la sede existe
    const branch = await getBranchById(branchId);
    if (!branch) {
        throw new NotFoundError("Esta sede no existe, por favor verifique.");
    }

    // Verificar horarios duplicados en la misma petición
    const days = schedulesArray.map((s) => s.dayOfWeek);
    const uniqueDays = new Set(days);
    if (days.length !== uniqueDays.size) {
        throw new ConflictDBError(
            "No puede crear múltiples horarios para el mismo día"
        );
    }

    // Verificar si ya existen horarios para estos días
    const existingSchedules = await prisma.schedule.findMany({
        where: {
            branchId: branchId,
            dayOfWeek: { in: days },
        },
    });

    if (existingSchedules.length > 0) {
        const conflictDays = existingSchedules.map((s) => s.dayOfWeek).join(", ");
        throw new ConflictDBError(
            `Ya existen horarios para los siguientes días: ${conflictDays}`
        );
    }

    // Crear todos los horarios en una transacción
    const schedules = await prisma.$transaction(
        schedulesArray.map((scheduleData) =>
            prisma.schedule.create({
                data: {
                    branchId: branchId,
                    dayOfWeek: scheduleData.dayOfWeek,
                    openingTime: new Date(
                        `1970-01-01T${scheduleData.openingTime}:00.000Z`
                    ),
                    closingTime: new Date(
                        `1970-01-01T${scheduleData.closingTime}:00.000Z`
                    ),
                },
            })
        )
    );

    return schedules;
}

// Obtener todos los horarios de una sede
async function getSchedulesByBranch(branchId) {
    const schedules = await prisma.schedule.findMany({
        where: {
            branchId: branchId,
            isActive: true,
        },
        orderBy: [
            {
                dayOfWeek: "asc",
            },
        ],
        include: {
            branch: {
                select: {
                    id: true,
                    name: true,
                    address: true,
                    city: true,
                },
            },
        },
    });

    return schedules;
}

// Obtener el horario de un día específico
async function getScheduleByDay(branchId, dayOfWeek) {
    const schedule = await prisma.schedule.findUnique({
        where: {
            unique_sede_dia: {
                branchId: branchId,
                dayOfWeek: dayOfWeek,
            },
        },
        include: {
            branch: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    return schedule;
}

// Actualizar un horario
async function updateSchedule(scheduleId, updateData) {
    const schedule = await prisma.schedule.findUnique({
        where: { id: scheduleId },
    });

    if (!schedule) {
        throw new NotFoundError("Este horario no existe");
    }

    const dataToUpdate = {};

    if (updateData.openingTime) {
        dataToUpdate.openingTime = new Date(
            `1970-01-01T${updateData.openingTime}:00.000Z`
        );
    }

    if (updateData.closingTime) {
        dataToUpdate.closingTime = new Date(
            `1970-01-01T${updateData.closingTime}:00.000Z`
        );
    }

    if (updateData.isActive !== undefined) {
        dataToUpdate.isActive = updateData.isActive;
    }

    const updatedSchedule = await prisma.schedule.update({
        where: { id: scheduleId },
        data: dataToUpdate,
        include: {
            branch: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    return updatedSchedule;
}

// Eliminar un horario (soft delete)
async function deleteSchedule(scheduleId) {
    const schedule = await prisma.schedule.findUnique({
        where: { id: scheduleId },
    });

    if (!schedule) {
        throw new NotFoundError("Este horario no existe");
    }

    // Soft delete: marcar como inactivo
    const deletedSchedule = await prisma.schedule.update({
        where: { id: scheduleId },
        data: { isActive: false },
    });

    return deletedSchedule;
}

// Eliminar permanentemente un horario
async function hardDeleteSchedule(scheduleId) {
    const schedule = await prisma.schedule.findUnique({
        where: { id: scheduleId },
    });

    if (!schedule) {
        throw new NotFoundError("Este horario no existe");
    }

    await prisma.schedule.delete({
        where: { id: scheduleId },
    });

    return { message: "Horario eliminado permanentemente" };
}

export {
    createSchedule,
    createMultipleSchedules,
    getSchedulesByBranch,
    getScheduleByDay,
    updateSchedule,
    deleteSchedule,
    hardDeleteSchedule,
};