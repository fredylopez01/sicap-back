/*
  Warnings:

  - Added the required column `id_sede` to the `registros_vehiculos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_sede` to the `tipos_vehiculos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."registros_vehiculos" ADD COLUMN     "id_sede" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."tipos_vehiculos" ADD COLUMN     "id_sede" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "registros_vehiculos_id_sede_idx" ON "public"."registros_vehiculos"("id_sede");

-- CreateIndex
CREATE INDEX "tipos_vehiculos_id_sede_idx" ON "public"."tipos_vehiculos"("id_sede");

-- AddForeignKey
ALTER TABLE "public"."tipos_vehiculos" ADD CONSTRAINT "tipos_vehiculos_id_sede_fkey" FOREIGN KEY ("id_sede") REFERENCES "public"."sedes"("id_sede") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."registros_vehiculos" ADD CONSTRAINT "registros_vehiculos_id_sede_fkey" FOREIGN KEY ("id_sede") REFERENCES "public"."sedes"("id_sede") ON DELETE RESTRICT ON UPDATE CASCADE;
