/*
  Warnings:

  - A unique constraint covering the columns `[id_sede,tipo_horario]` on the table `horarios` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."ScheduleType" AS ENUM ('diurno', 'nocturno');

-- AlterTable
ALTER TABLE "public"."horarios" ADD COLUMN     "tarifa_nocturna" DECIMAL(10,2),
ADD COLUMN     "tipo_horario" "public"."ScheduleType" NOT NULL DEFAULT 'diurno',
ALTER COLUMN "dia_semana" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."registros_vehiculos" ADD COLUMN     "tipo_horario" "public"."ScheduleType" NOT NULL DEFAULT 'diurno';

-- CreateIndex
CREATE UNIQUE INDEX "unique_sede_tipo" ON "public"."horarios"("id_sede", "tipo_horario");
