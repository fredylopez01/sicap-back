import prisma from "../db/prismaClient.js";
import {
  NotFoundError,
  ParkingSpaceUnavailableError,
} from "../models/Error.js";
import {
  getHourlyRateBySpace,
  getSpaceById,
  updatePhysiclaStateSpace,
} from "./SpaceService.js";

async function createVehicleEntry(entryControllerId, vehicleRecord) {
  const space = await getSpaceById(vehicleRecord.spaceId);
  if (space.physicalStatus !== "available") {
    throw new ParkingSpaceUnavailableError(
      `El espacio no está disponible se en cuenta en un estado de: ${space.physicalStatus}`
    );
  }

  const appliedRate = await getHourlyRateBySpace(vehicleRecord.spaceId);

  const newVehicleRecord = await prisma.vehicleRecord.create({
    data: {
      licensePlate: vehicleRecord.licensePlate,
      spaceId: vehicleRecord.spaceId,
      entryControllerId: entryControllerId,
      appliedRate: appliedRate,
    },
  });
  await updatePhysiclaStateSpace(newVehicleRecord.spaceId, "occupied");
  return newVehicleRecord;
}

async function createVehicleExit(exitControllerId, exitData) {
  const entry = await prisma.vehicleRecord.findFirst({
    where: {
      licensePlate: exitData.licensePlate,
      AND,
      status: "active",
    },
  });

  if (!entry) {
    throw new NotFoundError(
      "No se encuentra registro activo de ingreso de este vehículo"
    );
  }

  const exitDate = Date.now();
  const parkedHours = (exitDate - entry.entryDate) / (1000 * 60 * 60);
  const totalToPay = parkedHours * entry.appliedRate;

  const vehicleRecord = await prisma.vehicleRecord.update({
    where: {
      licensePlate: exitData.licensePlate,
    },
    data: {
      exitControllerId: exitControllerId,
      exitDate: exitDate,
      parkedHours: parkedHours,
      totalToPay: totalToPay,
      observations: exitData.observations,
      status: "finished",
    },
  });
  await updatePhysiclaStateSpace(vehicleRecord.spaceId, "available");
  return vehicleRecord;
}

async function getActiveRecords() {
  const records = await prisma.vehicleRecord.findMany({
    where: {
      status: "active",
    },
    select: {
      licensePlate,
      entryDate,
      space,
      entryController,
      observations,
    },
  });
  if (!records) {
    throw new NotFoundError(
      "No se encontraron registros que coincidan con los criterios de busqueda"
    );
  }
}

export { createVehicleEntry, createVehicleExit, getActiveRecords };
