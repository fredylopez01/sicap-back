import prisma from "../db/prismaClient.js";

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

export { createVehicleType, getVehicleTypeById, getAllVehicleTypes };
