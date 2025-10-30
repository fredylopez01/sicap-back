import prisma from "../db/prismaClient.js";
import { BusinessConflictError } from "../models/Error.js";

async function createVehicleType(newVehicleType) {
  const vehicleType = await prisma.vehicleType.create({
    data: {
      branchId: newVehicleType.branchId,
      name: newVehicleType.name,
      description: newVehicleType.description,
      hourlyRate: newVehicleType.hourlyRate,
    },
  });
  return vehicleType;
}

async function getVehicleTypeById(vehicleTypeId) {
  return await prisma.vehicleType.findUnique({
    where: { id: vehicleTypeId },
  });
}

async function getAllVehicleTypes() {
  return await prisma.vehicleType.findMany();
}

async function getVehicleTypesByBranch(branchId) {
  const vehicleTypes = await prisma.vehicleType.findMany({
    where: {
      branchId: branchId,
    },
  });
  return vehicleTypes;
}

async function updateVehicleType(vehicleTypeId, updateData) {
  const vehicleType = await getVehicleTypeById(vehicleTypeId);
  if (!vehicleType) {
    throw new NotFoundError(
      "Este tipo de vehiculo no existe, por favor verifique."
    );
  }

  let allowedFields = ["name", "description", "hourlyRate"];

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

  const updatedVehicleType = await prisma.vehicleType.update({
    where: { id: vehicleTypeId },
    data: filteredData,
  });

  return updatedVehicleType;
}

async function deleteVehicleType(vehicleTypeId) {
  const vehicleType = await prisma.vehicleType.findUnique({
    where: { id: vehicleTypeId },
    include: {
      zones: true,
    },
  });
  if (!vehicleType) {
    throw new NotFoundError(
      "Este tipo de vehiculo no existe, por favor verifique."
    );
  }
  if (vehicleType.zones.length > 0) {
    throw new BusinessConflictError(
      "Este tipo de vehículo está relacionado con alguna(s) zona(s), elimina estas relaciones para poder eliminarlo"
    );
  }

  await prisma.vehicleType.delete({
    where: { id: vehicleTypeId },
  });
}

export {
  createVehicleType,
  getVehicleTypeById,
  getAllVehicleTypes,
  getVehicleTypesByBranch,
  updateVehicleType,
  deleteVehicleType,
};
