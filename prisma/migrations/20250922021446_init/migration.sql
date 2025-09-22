-- CreateEnum
CREATE TYPE "public"."EstadoCliente" AS ENUM ('activo', 'inactivo');

-- CreateEnum
CREATE TYPE "public"."EstadoSede" AS ENUM ('activa', 'inactiva');

-- CreateEnum
CREATE TYPE "public"."RolControlador" AS ENUM ('CONTROLLER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."EstadoControlador" AS ENUM ('activo', 'inactivo');

-- CreateEnum
CREATE TYPE "public"."EstadoGenerico" AS ENUM ('activo', 'inactivo');

-- CreateEnum
CREATE TYPE "public"."EstadoZona" AS ENUM ('activa', 'inactiva', 'mantenimiento');

-- CreateEnum
CREATE TYPE "public"."EstadoEspacio" AS ENUM ('disponible', 'ocupado', 'reservado', 'mantenimiento');

-- CreateEnum
CREATE TYPE "public"."EstadoRegistro" AS ENUM ('activo', 'finalizado', 'cancelado');

-- CreateEnum
CREATE TYPE "public"."TipoSuscripcion" AS ENUM ('diaria', 'semanal', 'mensual');

-- CreateEnum
CREATE TYPE "public"."EstadoSuscripcion" AS ENUM ('activa', 'vencida', 'cancelada');

-- CreateTable
CREATE TABLE "public"."clientes" (
    "id_cliente" SERIAL NOT NULL,
    "cedula" VARCHAR(20) NOT NULL,
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(20),
    "email" VARCHAR(100),
    "direccion" VARCHAR(255),
    "fecha_registro" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "public"."EstadoCliente" NOT NULL DEFAULT 'activo',

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "public"."sedes" (
    "id_sede" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "direccion" VARCHAR(255) NOT NULL,
    "ciudad" VARCHAR(50) NOT NULL,
    "departamento" VARCHAR(50) NOT NULL,
    "telefono" VARCHAR(20),
    "horario_apertura" TIME(0) NOT NULL DEFAULT '1970-01-01 07:00:00 +00:00',
    "horario_cierre" TIME(0) NOT NULL DEFAULT '1970-01-01 21:00:00 +00:00',
    "estado" "public"."EstadoSede" NOT NULL DEFAULT 'activa',

    CONSTRAINT "sedes_pkey" PRIMARY KEY ("id_sede")
);

-- CreateTable
CREATE TABLE "public"."controladores" (
    "id_controlador" SERIAL NOT NULL,
    "cedula" VARCHAR(20) NOT NULL,
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(20),
    "email" VARCHAR(100),
    "id_sede" INTEGER NOT NULL,
    "usuario_hash" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "rol" "public"."RolControlador" NOT NULL DEFAULT 'CONTROLLER',
    "estado" "public"."EstadoControlador" NOT NULL DEFAULT 'activo',
    "fecha_ingreso" DATE NOT NULL,
    "fecha_creacion" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "controladores_pkey" PRIMARY KEY ("id_controlador")
);

-- CreateTable
CREATE TABLE "public"."tipos_vehiculos" (
    "id_tipo" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "tarifa_hora" DECIMAL(10,2) NOT NULL,
    "estado" "public"."EstadoGenerico" NOT NULL DEFAULT 'activo',
    "fecha_creacion" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tipos_vehiculos_pkey" PRIMARY KEY ("id_tipo")
);

-- CreateTable
CREATE TABLE "public"."zonas" (
    "id_zona" SERIAL NOT NULL,
    "id_sede" INTEGER NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "id_tipo_vehiculo" INTEGER NOT NULL,
    "capacidad_total" INTEGER NOT NULL,
    "descripcion" TEXT,
    "estado" "public"."EstadoZona" NOT NULL DEFAULT 'activa',

    CONSTRAINT "zonas_pkey" PRIMARY KEY ("id_zona")
);

-- CreateTable
CREATE TABLE "public"."espacios" (
    "id_espacio" SERIAL NOT NULL,
    "id_zona" INTEGER NOT NULL,
    "numero_espacio" VARCHAR(10) NOT NULL,
    "tiene_sensor" BOOLEAN NOT NULL DEFAULT false,
    "estado_fisico" "public"."EstadoEspacio" NOT NULL DEFAULT 'disponible',
    "fecha_creacion" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "espacios_pkey" PRIMARY KEY ("id_espacio")
);

-- CreateTable
CREATE TABLE "public"."registros_vehiculos" (
    "id_registro" SERIAL NOT NULL,
    "placa" VARCHAR(10) NOT NULL,
    "id_tipo_vehiculo" INTEGER NOT NULL,
    "id_espacio" INTEGER NOT NULL,
    "id_controlador_entrada" INTEGER NOT NULL,
    "id_controlador_salida" INTEGER,
    "fecha_entrada" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_salida" TIMESTAMP(0),
    "horas_estacionado" DECIMAL(4,2),
    "tarifa_aplicada" DECIMAL(10,2) NOT NULL,
    "total_pagar" DECIMAL(10,2),
    "observaciones" TEXT,
    "estado" "public"."EstadoRegistro" NOT NULL DEFAULT 'activo',

    CONSTRAINT "registros_vehiculos_pkey" PRIMARY KEY ("id_registro")
);

-- CreateTable
CREATE TABLE "public"."suscripciones" (
    "id_suscripcion" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "id_sede" INTEGER NOT NULL,
    "id_tipo_vehiculo" INTEGER NOT NULL,
    "tipo_suscripcion" "public"."TipoSuscripcion" NOT NULL,
    "tarifa_fija" DECIMAL(10,2) NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,
    "espacio_asignado" INTEGER,
    "estado" "public"."EstadoSuscripcion" NOT NULL DEFAULT 'activa',
    "fecha_creacion" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suscripciones_pkey" PRIMARY KEY ("id_suscripcion")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cedula_key" ON "public"."clientes"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "controladores_cedula_key" ON "public"."controladores"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "controladores_usuario_hash_key" ON "public"."controladores"("usuario_hash");

-- CreateIndex
CREATE INDEX "controladores_id_sede_idx" ON "public"."controladores"("id_sede");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_vehiculos_nombre_key" ON "public"."tipos_vehiculos"("nombre");

-- CreateIndex
CREATE INDEX "zonas_id_sede_idx" ON "public"."zonas"("id_sede");

-- CreateIndex
CREATE INDEX "zonas_id_tipo_vehiculo_idx" ON "public"."zonas"("id_tipo_vehiculo");

-- CreateIndex
CREATE INDEX "idx_espacios_estado" ON "public"."espacios"("estado_fisico");

-- CreateIndex
CREATE UNIQUE INDEX "unique_espacio_zona" ON "public"."espacios"("id_zona", "numero_espacio");

-- CreateIndex
CREATE INDEX "registros_vehiculos_id_tipo_vehiculo_idx" ON "public"."registros_vehiculos"("id_tipo_vehiculo");

-- CreateIndex
CREATE INDEX "registros_vehiculos_id_espacio_idx" ON "public"."registros_vehiculos"("id_espacio");

-- CreateIndex
CREATE INDEX "registros_vehiculos_id_controlador_entrada_idx" ON "public"."registros_vehiculos"("id_controlador_entrada");

-- CreateIndex
CREATE INDEX "registros_vehiculos_id_controlador_salida_idx" ON "public"."registros_vehiculos"("id_controlador_salida");

-- CreateIndex
CREATE INDEX "idx_registros_fecha_entrada" ON "public"."registros_vehiculos"("fecha_entrada");

-- CreateIndex
CREATE INDEX "idx_registros_placa" ON "public"."registros_vehiculos"("placa");

-- CreateIndex
CREATE INDEX "idx_registros_estado" ON "public"."registros_vehiculos"("estado");

-- CreateIndex
CREATE INDEX "suscripciones_id_cliente_idx" ON "public"."suscripciones"("id_cliente");

-- CreateIndex
CREATE INDEX "suscripciones_id_sede_idx" ON "public"."suscripciones"("id_sede");

-- CreateIndex
CREATE INDEX "suscripciones_id_tipo_vehiculo_idx" ON "public"."suscripciones"("id_tipo_vehiculo");

-- CreateIndex
CREATE INDEX "suscripciones_espacio_asignado_idx" ON "public"."suscripciones"("espacio_asignado");

-- AddForeignKey
ALTER TABLE "public"."controladores" ADD CONSTRAINT "controladores_id_sede_fkey" FOREIGN KEY ("id_sede") REFERENCES "public"."sedes"("id_sede") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."zonas" ADD CONSTRAINT "zonas_id_sede_fkey" FOREIGN KEY ("id_sede") REFERENCES "public"."sedes"("id_sede") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."zonas" ADD CONSTRAINT "zonas_id_tipo_vehiculo_fkey" FOREIGN KEY ("id_tipo_vehiculo") REFERENCES "public"."tipos_vehiculos"("id_tipo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."espacios" ADD CONSTRAINT "espacios_id_zona_fkey" FOREIGN KEY ("id_zona") REFERENCES "public"."zonas"("id_zona") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."registros_vehiculos" ADD CONSTRAINT "registros_vehiculos_id_tipo_vehiculo_fkey" FOREIGN KEY ("id_tipo_vehiculo") REFERENCES "public"."tipos_vehiculos"("id_tipo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."registros_vehiculos" ADD CONSTRAINT "registros_vehiculos_id_espacio_fkey" FOREIGN KEY ("id_espacio") REFERENCES "public"."espacios"("id_espacio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."registros_vehiculos" ADD CONSTRAINT "registros_vehiculos_id_controlador_entrada_fkey" FOREIGN KEY ("id_controlador_entrada") REFERENCES "public"."controladores"("id_controlador") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."registros_vehiculos" ADD CONSTRAINT "registros_vehiculos_id_controlador_salida_fkey" FOREIGN KEY ("id_controlador_salida") REFERENCES "public"."controladores"("id_controlador") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."suscripciones" ADD CONSTRAINT "suscripciones_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "public"."clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."suscripciones" ADD CONSTRAINT "suscripciones_id_sede_fkey" FOREIGN KEY ("id_sede") REFERENCES "public"."sedes"("id_sede") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."suscripciones" ADD CONSTRAINT "suscripciones_id_tipo_vehiculo_fkey" FOREIGN KEY ("id_tipo_vehiculo") REFERENCES "public"."tipos_vehiculos"("id_tipo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."suscripciones" ADD CONSTRAINT "suscripciones_espacio_asignado_fkey" FOREIGN KEY ("espacio_asignado") REFERENCES "public"."espacios"("id_espacio") ON DELETE SET NULL ON UPDATE CASCADE;
