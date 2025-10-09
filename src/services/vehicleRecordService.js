import prisma from "../db/prismaClient.js";
import { getHourlyRateBySpace, getSpaceById } from "./SpaceService.js";

async function entryRegistration(entryControllerId, vehicleRecord) {
  const appliedRate = await getHourlyRateBySpace(vehicleRecord.spaceId);

  const newVehicleRecord = await prisma.vehicleRecord.create({
    data: {
      licensePlate: vehicleRecord.licensePlate,
      spaceId: vehicleRecord.spaceId,
      entryControllerId: entryControllerId,
      appliedRate: appliedRate,
    },
  });
  return newVehicleRecord;
}

export { entryRegistration };
