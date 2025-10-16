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
  })
  .strict();

export { createBranchSchema };