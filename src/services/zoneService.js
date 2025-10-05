import prisma from "../db/prismaClient.js";
import { getBranchById } from "./branchServerice.js";
import { getVehicleTypeById } from "./vehicleTypeService.js";

async function createZone(newZone) {
  // Verificar si la branch existe
  const branch = await getBranchById(newZone.branchId);
  if (!branch) {
    throw new NotFoundError("Esta sede no existe, por favor verifique.");
  }

  // Verificar si el vehicleType existe
  const vehicleType = await getVehicleTypeById(newZone.vehicleTypeId);
  if (!vehicleType) {
    throw new NotFoundError(
      "Este tipo de vehiculo no existe, por favor verifique."
    );
  }

  const zone = await prisma.zone.create({
    data: {
      branchId: newZone.branchId,
      name: newZone.name,
      vehicleTypeId: newZone.vehicleTypeId,
      totalCapacity: newZone.totalCapacity,
      description: newZone.description,
    },
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

export { createZone, getZoneById, getAllZonesByBranch };
