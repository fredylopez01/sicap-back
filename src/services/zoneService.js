import prisma from "../db/prismaClient.js";
import { getBranchById } from "./branchServerice.js";
import { createSpacesByZone } from "./SpaceService.js";
import { getVehicleTypeById } from "./vehicleTypeService.js";

async function createZone(newZone) {
  // Verificar si la branch existe
  await getBranchById(newZone.branchId);

  // Verificar si el vehicleType existe
  const vehicleType = await getVehicleTypeById(newZone.vehicleTypeId);
  if (!vehicleType) {
    throw new NotFoundError(
      "Este tipo de vehiculo no existe, por favor verifique."
    );
  }

  // Crear la zona y los espacios en una transacción
  const zone = await prisma.$transaction(async (tx) => {
    const createdZone = await tx.zone.create({
      data: {
        branchId: newZone.branchId,
        name: newZone.name,
        vehicleTypeId: newZone.vehicleTypeId,
        totalCapacity: newZone.totalCapacity,
        description: newZone.description,
      },
    });

    // Crear los espacios automáticamente
    await createSpacesByZone(tx, createdZone);

    return createdZone;
  });

  return zone;
}

async function getZoneById(zoneId) {
  return await prisma.zone.findUnique({
    where: { id: zoneId },
  });
}

async function getAllZonesByBranch(branchId) {
  return await prisma.zone.findMany({
    where: { branchId: branchId },
  });
}

async function getVehicleTypeFromZone(zoneId) {
  const zone = await getZoneById(zoneId);
  if (!zone) {
    throw new NotFoundError("Esta zona no existe, por favor verifique.");
  }
  const vehicleType = await getVehicleTypeById(zone.vehicleTypeId);
  if (!vehicleType) {
    throw new NotFoundError(
      "Este tipo de vehículo no existe, por favor verifique."
    );
  }
  return vehicleType;
}

async function getAllActiveZonesByBranch(branchId) {
  const zones = await prisma.zone.findMany({
    where: {
      branchId,
      status: "active",
    },
    include: {
      vehicleType: true,
      spaces: {
        where: {
          physicalStatus: {
            in: ["available", "occupied", "reserved"],
          },
        },
      },
    },
  });
  return zones;
}

export {
  createZone,
  getZoneById,
  getAllZonesByBranch,
  getVehicleTypeFromZone,
  getAllActiveZonesByBranch,
};
