/*
  Warnings:

  - You are about to drop the column `id_tipo_vehiculo` on the `registros_vehiculos` table. All the data in the column will be lost.
  - You are about to drop the column `id_tipo_vehiculo` on the `suscripciones` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."registros_vehiculos" DROP CONSTRAINT "registros_vehiculos_id_tipo_vehiculo_fkey";

-- DropForeignKey
ALTER TABLE "public"."suscripciones" DROP CONSTRAINT "suscripciones_id_tipo_vehiculo_fkey";

-- DropIndex
DROP INDEX "public"."registros_vehiculos_id_tipo_vehiculo_idx";

-- DropIndex
DROP INDEX "public"."suscripciones_id_tipo_vehiculo_idx";

-- AlterTable
ALTER TABLE "public"."registros_vehiculos" DROP COLUMN "id_tipo_vehiculo";

-- AlterTable
ALTER TABLE "public"."suscripciones" DROP COLUMN "id_tipo_vehiculo";
