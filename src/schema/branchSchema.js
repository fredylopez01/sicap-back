import { z } from "zod";

const createBranchSchema = z
  .object({
    name: z.preprocess(
      (val) => (val == null ? "" : val),
      z
        .string({ invalid_type_error: "El nombre debe ser un string" })
        .nonempty("El nombre es requerido")
    ),

    address: z.preprocess(
      (val) => (val == null ? "" : val),
      z
        .string({ invalid_type_error: "La dirección debe ser un string" })
        .nonempty("La dirección es requerida")
    ),

    city: z.preprocess(
      (val) => (val == null ? "" : val),
      z
        .string({ invalid_type_error: "La ciudad debe ser un string" })
        .nonempty("La ciudad es requerida")
    ),

    department: z.preprocess(
      (val) => (val == null ? "" : val),
      z
        .string({ invalid_type_error: "El departamento debe ser un string" })
        .nonempty("El departamento es requerido")
    ),

    phone: z.preprocess(
      (val) => (val == null ? "" : val),
      z
        .string({ invalid_type_error: "El teléfono debe ser un string" })
        .nonempty("El teléfono es requerido")
        .regex(/^\d{10}$/, "El teléfono debe tener 10 dígitos")
    ),

    openingTime: z.preprocess(
      (val) => (typeof val === "string" || val instanceof Date ? val : ""),
      z
        .string({
          invalid_type_error: "La hora de apertura debe ser un string válido",
        })
        .nonempty("La hora de apertura es requerida")
        .refine((val) => !isNaN(Date.parse(val)), {
          message: "La hora de apertura no es válida",
        })
    ),

    closingTime: z.preprocess(
      (val) => (typeof val === "string" || val instanceof Date ? val : ""),
      z
        .string({
          invalid_type_error: "La hora de cierre debe ser un string válido",
        })
        .nonempty("La hora de cierre es requerida")
        .refine((val) => !isNaN(Date.parse(val)), {
          message: "La hora de cierre no es válida",
        })
    ),
  })
  .strict()
  .refine(
    (data) => {
      const opening = new Date(data.openingTime);
      const closing = new Date(data.closingTime);
      return closing > opening;
    },
    {
      message: "La hora de cierre debe ser mayor que la hora de apertura",
      path: ["closingTime"], // el error se asigna al campo closingTime
    }
  );

export { createBranchSchema };
