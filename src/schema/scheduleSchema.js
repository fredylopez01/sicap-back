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

// Schema para crear un horario individual
const createScheduleSchema = z
    .object({
        branchId: z.number({
            required_error: "La sede es requerida",
            invalid_type_error: "La sede debe ser un número",
        }),

        dayOfWeek: z.enum(
            ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
            {
                required_error: "El día de la semana es requerido",
                invalid_type_error: "Día de la semana inválido",
            }
        ),

        openingTime: z.preprocess(
            (val) => (typeof val === "string" || val instanceof Date ? val : ""),
            z
                .string({
                    invalid_type_error: "La hora de apertura debe ser un string válido",
                })
                .nonempty("La hora de apertura es requerida")
                .refine((val) => !isNaN(Date.parse(`1970-01-01T${val}`)), {
                    message: "La hora de apertura no es válida (formato: HH:MM)",
                })
        ),

        closingTime: z.preprocess(
            (val) => (typeof val === "string" || val instanceof Date ? val : ""),
            z
                .string({
                    invalid_type_error: "La hora de cierre debe ser un string válido",
                })
                .nonempty("La hora de cierre es requerida")
                .refine((val) => !isNaN(Date.parse(`1970-01-01T${val}`)), {
                    message: "La hora de cierre no es válida (formato: HH:MM)",
                })
        ),
    })
    .strict()
    .refine(
        (data) => {
            const opening = new Date(`1970-01-01T${data.openingTime}`);
            const closing = new Date(`1970-01-01T${data.closingTime}`);
            return closing > opening;
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

        isActive: z.boolean().optional(),
    })
    .strict()
    .refine(
        (data) => {
            if (data.openingTime && data.closingTime) {
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