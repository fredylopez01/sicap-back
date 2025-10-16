import prisma from "../db/prismaClient.js";
import { ConflictDBError, NotFoundError } from "../models/Error.js";
import { getVehicleTypeFromZone, getZoneById } from "./zoneService.js";

// Crear espacios según la zona y su capacidad
async function createSpacesByZone(tx, zone) {
  const spacesData = [];

  for (let i = 1; i <= zone.totalCapacity; i++) {
    spacesData.push({
      zoneId: zone.id,
      spaceNumber: `Z${zone.id}-E${i}`,
      physicalStatus: "available",
    });
  }

  await tx.space.createMany({
    data: spacesData,
  });
}

// Método existente
async function createSpace(newSpace) {
  const zone = await getZoneById(newSpace.zoneId);
  if (!zone) {
    throw new NotFoundError("Esta zona no existe, por favor verifique.");
  }

  const space = await prisma.space.create({
    data: {
      zoneId: zone.id,
      spaceNumber: newSpace.spaceNumber,
    },
  });

  return space;
}

async function getAllSpacesByZone(zoneId) {
  const spaces = await prisma.space.findMany({
    where: {
      zoneId: zoneId,
    },
  });
  return spaces;
}

async function getSpaceById(spaceId) {
  const space = await prisma.space.findUnique({
    where: {
      id: spaceId,
    },
  });
  if (!space) {
    throw new NotFoundError("Este espacio no existe, por favor verifique.");
  }
  return space;
}

async function getHourlyRateBySpace(spaceId) {
  // Encontrar el espacio
  const space = await getSpaceById(spaceId);
  const vehicleType = await getVehicleTypeFromZone(space.zoneId);

  return vehicleType.hourlyRate;
}

async function updatePhysiclaStateSpace(spaceId, status) {
  const space = await prisma.space.update({
    where: { id: spaceId },
    data: {
      physicalStatus: status,
    },
  });
  if (!space) {
    throw new ConflictDBError(
      "No fue posible actualizar el estado del espacio"
    );
  }
}

async function isAvailableSpace(spaceId) {
  const space = await getSpaceById(spaceId);
  if (space.physicalStatus !== "available") {
    throw new ParkingSpaceUnavailableError(
      `El espacio no está disponible (${space.physicalStatus})`
    );
  }
  return true;
}

export {
  createSpace,
  createSpacesByZone,
  getAllSpacesByZone,
  getSpaceById,
  getHourlyRateBySpace,
  updatePhysiclaStateSpace,
  isAvailableSpace,
};
