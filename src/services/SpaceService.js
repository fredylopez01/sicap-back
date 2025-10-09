import prisma from "../db/prismaClient.js";
import { getZoneById } from "./zoneService.js";

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

export { createSpace, createSpacesByZone, getAllSpacesByZone };
