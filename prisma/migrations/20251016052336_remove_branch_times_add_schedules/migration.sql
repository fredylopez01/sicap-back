/*
  Warnings:

  - You are about to drop the column `horario_apertura` on the `sedes` table. All the data in the column will be lost.
  - You are about to drop the column `horario_cierre` on the `sedes` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."DayOfWeek" AS ENUM ('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo');

-- AlterTable
ALTER TABLE "public"."sedes" DROP COLUMN "horario_apertura",
DROP COLUMN "horario_cierre";

-- CreateTable
CREATE TABLE "public"."horarios" (
    "id_horario" SERIAL NOT NULL,
    "id_sede" INTEGER NOT NULL,
    "dia_semana" "public"."DayOfWeek" NOT NULL,
    "hora_apertura" TIME(0) NOT NULL,
    "hora_cierre" TIME(0) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "horarios_pkey" PRIMARY KEY ("id_horario")
);

-- CreateIndex
CREATE INDEX "horarios_id_sede_idx" ON "public"."horarios"("id_sede");

-- CreateIndex
CREATE UNIQUE INDEX "unique_sede_dia" ON "public"."horarios"("id_sede", "dia_semana");

-- AddForeignKey
ALTER TABLE "public"."horarios" ADD CONSTRAINT "horarios_id_sede_fkey" FOREIGN KEY ("id_sede") REFERENCES "public"."sedes"("id_sede") ON DELETE CASCADE ON UPDATE CASCADE;
