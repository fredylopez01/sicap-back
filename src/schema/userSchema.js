import { z } from "zod";

const createUserSchema = z
  .object({
    cedula: z.preprocess(
      (val) => (val == null ? "" : val),
      z
        .string({ invalid_type_error: "La cédula debe ser un string" })
        .nonempty("La cédula es requerida")
        .regex(/^\d+$/, "La cédula solo debe contener números")
    ),

    names: z.preprocess(
      (val) => (val == null ? "" : val),
      z
        .string({ invalid_type_error: "El nombre debe ser un string" })
        .nonempty("El nombre es requerido")
    ),

    lastNames: z.preprocess(
      (val) => (val == null ? "" : val),
      z
        .string({ invalid_type_error: "Los apellidos deben ser un string" })
        .nonempty("Los apellidos son requeridos")
    ),

    phone: z.preprocess(
      (val) => (val == null ? "" : val),
      z
        .string({ invalid_type_error: "El teléfono debe ser un string" })
        .nonempty("El teléfono es requerido")
        .regex(/^\d{10}$/, "El teléfono debe tener 10 dígitos")
    ),

    email: z.preprocess(
      (val) => (val == null ? "" : val),
      z
        .string({ invalid_type_error: "El email debe ser un string" })
        .nonempty("El email es requerido")
        .email("El email es inválido")
    ),

    branchId: z.number({
      required_error: "La sede es requerida",
      invalid_type_error: "La sede debe ser un número",
    }),

    userHash: z.preprocess(
      (val) => (val == null ? "" : val),
      z
        .string({ invalid_type_error: "El userHash debe ser un string" })
        .nonempty("El userHash es requerido")
    ),

    password: z.preprocess(
      (val) => (val == null ? "" : val),
      z
        .string({ invalid_type_error: "La contraseña debe ser un string" })
        .nonempty("La contraseña es requerida")
        .min(6, "La contraseña debe tener al menos 6 caracteres")
    ),

    role: z
      .enum(["ADMIN", "CONTROLLER"], {
        invalid_type_error: "El rol debe ser ADMIN o CONTROLLER",
      })
      .optional(),

    hireDate: z.preprocess(
      (val) => (val == null ? "" : val),
      z
        .string({
          invalid_type_error: "La fecha de contratación debe ser un string",
        })
        .nonempty("La fecha de contratación es requerida")
        .refine((val) => !isNaN(Date.parse(val)), {
          message: "La fecha de contratación no es válida",
        })
        .refine(
          (val) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const hire = new Date(val);
            return hire >= today;
          },
          {
            message: "La fecha de contratación debe ser hoy o una fecha futura",
          }
        )
    ),
  })
  .strict();

export { createUserSchema };
