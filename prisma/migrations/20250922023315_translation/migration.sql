/*
  Warnings:

  - The `estado` column on the `clientes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `rol` column on the `controladores` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `estado` column on the `controladores` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `estado_fisico` column on the `espacios` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `estado` column on the `registros_vehiculos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `estado` column on the `sedes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `estado` column on the `suscripciones` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `estado` column on the `tipos_vehiculos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `estado` column on the `zonas` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[email]` on the table `controladores` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `tipo_suscripcion` on the `suscripciones` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."ClientStatus" AS ENUM ('activo', 'inactivo');

-- CreateEnum
CREATE TYPE "public"."BranchStatus" AS ENUM ('activa', 'inactiva');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('CONTROLLER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('activo', 'inactivo');

-- CreateEnum
CREATE TYPE "public"."GenericStatus" AS ENUM ('activo', 'inactivo');

-- CreateEnum
CREATE TYPE "public"."ZoneStatus" AS ENUM ('activa', 'inactiva', 'mantenimiento');

-- CreateEnum
CREATE TYPE "public"."SpaceStatus" AS ENUM ('disponible', 'ocupado', 'reservado', 'mantenimiento');

-- CreateEnum
CREATE TYPE "public"."RecordStatus" AS ENUM ('activo', 'finalizado', 'cancelado');

-- CreateEnum
CREATE TYPE "public"."SubscriptionType" AS ENUM ('diaria', 'semanal', 'mensual');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('activa', 'vencida', 'cancelada');

-- AlterTable
ALTER TABLE "public"."clientes" DROP COLUMN "estado",
ADD COLUMN     "estado" "public"."ClientStatus" NOT NULL DEFAULT 'activo';

-- AlterTable
ALTER TABLE "public"."controladores" DROP COLUMN "rol",
ADD COLUMN     "rol" "public"."UserRole" NOT NULL DEFAULT 'CONTROLLER',
DROP COLUMN "estado",
ADD COLUMN     "estado" "public"."UserStatus" NOT NULL DEFAULT 'activo';

-- AlterTable
ALTER TABLE "public"."espacios" DROP COLUMN "estado_fisico",
ADD COLUMN     "estado_fisico" "public"."SpaceStatus" NOT NULL DEFAULT 'disponible';

-- AlterTable
ALTER TABLE "public"."registros_vehiculos" DROP COLUMN "estado",
ADD COLUMN     "estado" "public"."RecordStatus" NOT NULL DEFAULT 'activo';

-- AlterTable
ALTER TABLE "public"."sedes" DROP COLUMN "estado",
ADD COLUMN     "estado" "public"."BranchStatus" NOT NULL DEFAULT 'activa';

-- AlterTable
ALTER TABLE "public"."suscripciones" DROP COLUMN "tipo_suscripcion",
ADD COLUMN     "tipo_suscripcion" "public"."SubscriptionType" NOT NULL,
DROP COLUMN "estado",
ADD COLUMN     "estado" "public"."SubscriptionStatus" NOT NULL DEFAULT 'activa';

-- AlterTable
ALTER TABLE "public"."tipos_vehiculos" DROP COLUMN "estado",
ADD COLUMN     "estado" "public"."GenericStatus" NOT NULL DEFAULT 'activo';

-- AlterTable
ALTER TABLE "public"."zonas" DROP COLUMN "estado",
ADD COLUMN     "estado" "public"."ZoneStatus" NOT NULL DEFAULT 'activa';

-- DropEnum
DROP TYPE "public"."EstadoCliente";

-- DropEnum
DROP TYPE "public"."EstadoControlador";

-- DropEnum
DROP TYPE "public"."EstadoEspacio";

-- DropEnum
DROP TYPE "public"."EstadoGenerico";

-- DropEnum
DROP TYPE "public"."EstadoRegistro";

-- DropEnum
DROP TYPE "public"."EstadoSede";

-- DropEnum
DROP TYPE "public"."EstadoSuscripcion";

-- DropEnum
DROP TYPE "public"."EstadoZona";

-- DropEnum
DROP TYPE "public"."RolControlador";

-- DropEnum
DROP TYPE "public"."TipoSuscripcion";

-- CreateIndex
CREATE UNIQUE INDEX "controladores_email_key" ON "public"."controladores"("email");

-- CreateIndex
CREATE INDEX "idx_espacios_estado" ON "public"."espacios"("estado_fisico");

-- CreateIndex
CREATE INDEX "idx_registros_estado" ON "public"."registros_vehiculos"("estado");
