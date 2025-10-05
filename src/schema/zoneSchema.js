import { z } from "zod";

const createZoneSchema = z
  .object({
    branchId: z.number({
      required_error: "La sede es requerida",
      invalid_type_error: "La sede debe ser un número",
    }),

    name: z.preprocess(
      (val) => (val == null ? "" : val),
      z
        .string({ invalid_type_error: "El nombre debe ser un string" })
        .nonempty("El nombre es requerido")
    ),

    vehicleTypeId: z.number({
      required_error: "El tipo de vehiculo es requerido",
      invalid_type_error: "El tipo de vehiculo debe ser un número",
    }),

    totalCapacity: z.number({
      required_error: "La capacidad total es requerida",
      invalid_type_error: "La capacidad total debe ser un número",
    }),

    description: z.preprocess(
      (val) => (val == null ? "" : val),
      z
        .string({ invalid_type_error: "La descripción debe ser un string" })
        .nonempty("La descripción es requerida")
    ),
  })
  .strict();

export { createZoneSchema };
