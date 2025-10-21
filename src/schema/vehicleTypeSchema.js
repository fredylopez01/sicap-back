import { z } from "zod";

const createVehicleTypeSchema = z
  .object({
    branchId: z.number({
      required_error: "El parqueadero es requerida",
      invalid_type_error: "El id del parqueadero debe ser un número",
    }),

    name: z.preprocess(
      (val) => (val == null ? "" : val),
      z
        .string({ invalid_type_error: "El nombre debe ser un string" })
        .nonempty("El nombre es requerido")
        .min(3, "El nombre debe tener una longitud de minimo 3 caracteres")
    ),

    description: z.preprocess(
      (val) => (val == null ? "" : val),
      z
        .string({ invalid_type_error: "La descripción debe ser un string" })
        .nonempty("La descripción es requerida")
    ),

    hourlyRate: z.number({
      required_error: "La tarifa-hora es requerida",
      invalid_type_error: "La tarifa-hora debe ser un número",
    }),
  })
  .strict();

export { createVehicleTypeSchema };
