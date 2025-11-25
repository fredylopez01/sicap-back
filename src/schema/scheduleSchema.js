import { z } from "zod";

// Días de la semana válidos
const validDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
];

// Tipos de horario válidos
const validScheduleTypes = ["DIURNO", "NOCTURNO"];

// Schema para crear un horario individual
const createScheduleSchema = z
    .object({
        branchId: z.number({
            required_error: "La sede es requerida",
            invalid_type_error: "La sede debe ser un número",
        }),

        scheduleType: z.enum(["DIURNO", "NOCTURNO"], {
            invalid_type_error: "Tipo de horario inválido",
        }).optional().default("DIURNO"),

        dayOfWeek: z.enum(
            ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
            {
                invalid_type_error: "Día de la semana inválido",
            }
        ).optional(),

        openingTime: z.preprocess(
            (val) => (typeof val === "string" || val instanceof Date ? val : ""),
            z
                .string({
                    invalid_type_error: "La hora de apertura debe ser un string válido",
                })
                .optional()
                .refine((val) => !val || !isNaN(Date.parse(`1970-01-01T${val}`)), {
                    message: "La hora de apertura no es válida (formato: HH:MM)",
                })
        ),

        closingTime: z.preprocess(
            (val) => (typeof val === "string" || val instanceof Date ? val : ""),
            z
                .string({
                    invalid_type_error: "La hora de cierre debe ser un string válido",
                })
                .optional()
                .refine((val) => !val || !isNaN(Date.parse(`1970-01-01T${val}`)), {
                    message: "La hora de cierre no es válida (formato: HH:MM)",
                })
        ),

        nightRate: z.number({
            invalid_type_error: "La tarifa nocturna debe ser un número",
        }).positive("La tarifa nocturna debe ser mayor a 0").optional(),
    })
    .strict()
    .refine(
        (data) => {
            // Si es DIURNO, requiere dayOfWeek, openingTime y closingTime
            if (data.scheduleType === "DIURNO") {
                return data.dayOfWeek && data.openingTime && data.closingTime;
            }
            return true;
        },
        {
            message: "Los horarios diurnos requieren día de la semana, hora de apertura y hora de cierre",
            path: ["dayOfWeek"],
        }
    )
    .refine(
        (data) => {
            // Si es NOCTURNO, requiere nightRate
            if (data.scheduleType === "NOCTURNO") {
                return data.nightRate && data.nightRate > 0;
            }
            return true;
        },
        {
            message: "Los horarios nocturnos requieren una tarifa nocturna válida",
            path: ["nightRate"],
        }
    )
    .refine(
        (data) => {
            // Validar que hora de cierre sea mayor que hora de apertura (solo para DIURNO)
            if (data.scheduleType === "DIURNO" && data.openingTime && data.closingTime) {
                const opening = new Date(`1970-01-01T${data.openingTime}`);
                const closing = new Date(`1970-01-01T${data.closingTime}`);
                return closing > opening;
            }
            return true;
        },
        {
            message: "La hora de cierre debe ser mayor que la hora de apertura",
            path: ["closingTime"],
        }
    );

// Schema para crear múltiples horarios (batch)
const createMultipleSchedulesSchema = z
    .object({
        branchId: z.number({
            required_error: "La sede es requerida",
            invalid_type_error: "La sede debe ser un número",
        }),

        schedules: z
            .array(
                z.object({
                    dayOfWeek: z.enum(
                        ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
                    ),
                    openingTime: z.string(),
                    closingTime: z.string(),
                })
            )
            .min(1, "Debe proporcionar al menos un horario")
            .max(7, "No puede proporcionar más de 7 horarios (uno por día)"),
    })
    .strict();

// Schema para actualizar un horario
const updateScheduleSchema = z
    .object({
        openingTime: z
            .string()
            .optional()
            .refine(
                (val) => !val || !isNaN(Date.parse(`1970-01-01T${val}`)),
                { message: "La hora de apertura no es válida" }
            ),

        closingTime: z
            .string()
            .optional()
            .refine(
                (val) => !val || !isNaN(Date.parse(`1970-01-01T${val}`)),
                { message: "La hora de cierre no es válida" }
            ),

        nightRate: z.number({
            invalid_type_error: "La tarifa nocturna debe ser un número",
        }).positive("La tarifa nocturna debe ser mayor a 0").optional(),

        scheduleType: z.enum(["DIURNO", "NOCTURNO"]).optional(),

        isActive: z.boolean().optional(),
    })
    .strict()
    .refine(
        (data) => {
            // Solo validar tiempo para horarios DIURNOS
            // Los nocturnos tienen hora de cierre menor que apertura (6am < 8pm)
            if (data.scheduleType === "DIURNO" && data.openingTime && data.closingTime) {
                const opening = new Date(`1970-01-01T${data.openingTime}`);
                const closing = new Date(`1970-01-01T${data.closingTime}`);
                return closing > opening;
            }
            return true;
        },
        {
            message: "La hora de cierre debe ser mayor que la hora de apertura",
            path: ["closingTime"],
        }
    );

export {
    createScheduleSchema,
    createMultipleSchedulesSchema,
    updateScheduleSchema,
};