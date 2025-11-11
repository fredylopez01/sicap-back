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

async function updateZone(zoneId, updateData) {
  const zone = await getZoneById(zoneId);
  const allowedFields = ["name", "description", "vehicleTypeId", "status"];
  const filteredData = {};
  for (const key of allowedFields) {
    if (updateData[key] !== undefined) {
      filteredData[key] = updateData[key];
    }
  }

  if (Object.keys(filteredData).length === 0) {
    throw new ConflictDBError(
      "No se proporcionaron campos válidos para actualizar."
    );
  }

  if (filteredData.vehicleTypeId) {
    const vehicleType = await getVehicleTypeById(filteredData.vehicleTypeId);
    if (!vehicleType) {
      throw new NotFoundError(
        "El tipo de vehículo especificado no existe, por favor verifique."
      );
    }
  }

  const updatedZone = await prisma.zone.update({
    where: { id: zoneId },
    data: filteredData,
  });

  return updatedZone;
}

async function deleteZone(zoneId) {
  const zone = await prisma.zone.findUnique({
    where: { id: zoneId },
    include: {
      spaces: {
        include: {
          records: {
            where: {
              status: "active"
            }
          },
          subscriptions: true
        }
      }
    }
  });

  if (!zone) {
    throw new NotFoundError("La zona no existe");
  }

  const hasActiveRecords = zone.spaces.some(
    space => space.records.length > 0
  );

  if (hasActiveRecords) {
    throw new ConflictDBError(
      "No se puede eliminar la zona porque tiene vehículos actualmente estacionados"
    );
  }

  const hasSubscriptions = zone.spaces.some(
    space => space.subscriptions && space.subscriptions.length > 0
  );

  if (hasSubscriptions) {
    throw new ConflictDBError(
      "No se puede eliminar la zona porque tiene suscripciones asociadas"
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.space.deleteMany({
      where: { zoneId: zoneId }
    });

    await tx.zone.delete({
      where: { id: zoneId }
    });
  });

  return { message: "Zona eliminada exitosamente" };
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
  updateZone,
  deleteZone,
  getVehicleTypeFromZone,
  getAllActiveZonesByBranch,
};
