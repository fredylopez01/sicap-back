import prisma from "../db/prismaClient.js";
import {
  BusinessConflictError,
  ConflictDBError,
  NotFoundError,
} from "../models/Error.js";
import {
  getEndOfDay,
  getStartOfDay,
  parseDateLocal,
} from "../utils/dateUtils.js";
import {
  getHourlyRateBySpace,
  isAvailableSpace,
  updatePhysiclaStateSpace,
} from "./SpaceService.js";

async function createVehicleEntry(entryController, vehicleRecord) {
  if (await getRecordByPlate(vehicleRecord.licensePlate.toUpperCase())) {
    throw new ConflictDBError(
      "Este vehículo ya ingreso a este u otro parqueadero pero no se ha registrado su salida"
    );
  }

  await isAvailableSpace(vehicleRecord.spaceId);

  const appliedRate = await getHourlyRateBySpace(vehicleRecord.spaceId);

  const newVehicleRecord = await prisma.vehicleRecord.create({
    data: {
      licensePlate: vehicleRecord.licensePlate.toUpperCase(),
      spaceId: vehicleRecord.spaceId,
      entryControllerId: entryController.id,
      appliedRate: appliedRate,
      observations: vehicleRecord.observations,
      branchId: entryController.branchId,
    },
  });
  await updatePhysiclaStateSpace(newVehicleRecord.spaceId, "occupied");
  return newVehicleRecord;
}

async function createVehicleExit(exitController, exitData) {
  const entry = await prisma.vehicleRecord.findFirst({
    where: {
      licensePlate: exitData.licensePlate.toUpperCase(),
      status: "active",
    },
  });

  if (!entry) {
    throw new NotFoundError(
      "No se encuentra registro activo de ingreso de este vehículo"
    );
  }

  const exitDate = new Date(Date.now());
  const parkedHours = (exitDate - entry.entryDate) / (1000 * 60 * 60);

  const totalToPay = parkedHours * entry.appliedRate;

  const vehicleRecord = await prisma.vehicleRecord.update({
    where: {
      id: entry.id,
    },
    data: {
      exitControllerId: exitController.id,
      exitDate: exitDate,
      parkedHours: parkedHours,
      totalToPay: totalToPay,
      observations: exitData.observations,
      status: "finished",
      branchId: exitController.branchId,
    },
  });
  await updatePhysiclaStateSpace(vehicleRecord.spaceId, "available");
  return vehicleRecord;
}

async function getActiveRecordsByBranch(branchId) {
  const records = await prisma.vehicleRecord.findMany({
    where: {
      status: "active",
      branchId: branchId,
    },
    select: {
      id: true,
      licensePlate: true,
      entryDate: true,
      spaceId: true,
      entryControllerId: true,
      observations: true,
    },
  });
  if (!records) {
    throw new NotFoundError(
      "No se encontraron registros que coincidan con los criterios de busqueda"
    );
  }
  return records;
}

async function getRecordByPlate(licensePlate) {
  const record = await prisma.vehicleRecord.findFirst({
    where: {
      licensePlate: licensePlate,
      status: "active",
    },
  });
  return record;
}

async function getRecordById(vehicleRecordId) {
  const record = await prisma.vehicleRecord.findUnique({
    where: {
      id: vehicleRecordId,
    },
  });
  if (!record) {
    throw new NotFoundError("Este registro no existe, por favor verifique.");
  }
  return record;
}

async function updateVehicleRecord(recordId, updateData) {
  // Verificar si el registro existe
  const record = await getRecordById(recordId);
  if (record.exitDate !== null) {
    throw new BusinessConflictError(
      "Un registro no puede ser modificado después de registrar la salida"
    );
  }

  // Definir campos con posibles actualizaciones
  let allowedFields = [
    "appliedRate",
    "licensePlate",
    "observations",
    "spaceId",
  ];

  // Filtrar datos no permitidos
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

  const spaceId = filteredData["spaceId"];
  if (spaceId !== undefined) {
    await isAvailableSpace(spaceId);
  }

  const appliedRate =
    filteredData["appliedRate"] !== undefined
      ? filteredData["appliedRate"]
      : record.appliedRate;
  const totalToPay = record.parkedHours * appliedRate;

  filteredData["totalToPay"] = totalToPay;

  // Actualizar registro
  const updateRecord = await prisma.vehicleRecord.update({
    where: { id: recordId },
    data: filteredData,
    include: {
      space: {
        select: {
          spaceNumber: true,
        },
      },
    },
  });
  return updateRecord;
}

async function getRecordsHistory(filters = {}, page = 1, pageSize = 10) {
  const {
    branchId,
    licensePlate,
    entryControllerId,
    exitControllerId,
    status,
    entryStartDate,
    entryEndDate,
    exitStartDate,
    exitEndDate,
  } = filters;

  // Calcular los límites de paginación
  const skip = (page - 1) * pageSize;
  const take = parseInt(pageSize);

  // Construir el objeto `where` dinámicamente
  const where = {
    ...(branchId && { branchId }),
    ...(licensePlate && { licensePlate }),
    ...(entryControllerId && { entryControllerId }),
    ...(exitControllerId && { exitControllerId }),
    ...(status && { status }),

    ...(entryStartDate || entryEndDate
      ? {
          entryDate: {
            ...(entryStartDate && { gte: new Date(entryStartDate) }),
            ...(entryEndDate && { lte: new Date(entryEndDate) }),
          },
        }
      : {}),

    ...(exitStartDate || exitEndDate
      ? {
          exitDate: {
            ...(exitStartDate && { gte: new Date(exitStartDate) }),
            ...(exitEndDate && { lte: new Date(exitEndDate) }),
          },
        }
      : {}),
  };

  // Obtener los registros paginados
  const [records, totalRecords] = await Promise.all([
    prisma.vehicleRecord.findMany({
      where,
      include: {
        entryController: {
          select: {
            names: true,
            lastNames: true,
          },
        },
        exitController: {
          select: {
            names: true,
            lastNames: true,
          },
        },
        space: {
          select: {
            spaceNumber: true,
          },
        },
        branch: {
          select: {
            name: true,
            address: true,
          },
        },
      },
      orderBy: {
        entryDate: "desc",
      },
      skip,
      take,
    }),
    prisma.vehicleRecord.count({ where }),
  ]);

  return { records, totalRecords };
}

async function getDailySummary(branchId, date) {
  const dateObj = date ? parseDateLocal(date) : new Date();
  const startOfDay = getStartOfDay(dateObj);
  const endOfDay = getEndOfDay(dateObj);

  const records = await prisma.vehicleRecord.findMany({
    where: {
      branchId,
      OR: [
        {
          entryDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        {
          exitDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      ],
    },
    include: {
      entryController: {
        select: {
          names: true,
          lastNames: true,
        },
      },
      exitController: {
        select: {
          names: true,
          lastNames: true,
        },
      },
      space: {
        select: {
          spaceNumber: true,
        },
      },
    },
    orderBy: {
      entryDate: "desc",
    },
  });
  const totals = getTotalsSummary(records, startOfDay, endOfDay);

  return {
    date: startOfDay.toISOString().split("T")[0],
    branchId,
    records,
    totalVehiclesEntered: totals.totalVehiclesEntered,
    totalVehiclesExited: totals.totalVehiclesExited,
    totalRevenue: totals.totalRevenue,
  };
}

function getTotalsSummary(records, startOfDay, endOfDay) {
  const totalVehiclesEntered = records.filter(
    (r) => r.entryDate >= startOfDay && r.entryDate <= endOfDay
  ).length;

  const totalVehiclesExited = records.filter(
    (r) => r.exitDate && r.exitDate >= startOfDay && r.exitDate <= endOfDay
  ).length;

  const totalRevenue = records.reduce((sum, r) => {
    if (
      r.exitDate &&
      r.exitDate >= startOfDay &&
      r.exitDate <= endOfDay &&
      r.totalToPay
    ) {
      sum += Number(r.totalToPay);
    }
    return sum;
  }, 0);

  return {
    totalVehiclesEntered,
    totalVehiclesExited,
    totalRevenue,
  };
}

async function getAllActiveRecordsByBranch(branchId) {
  const activeRecords = await prisma.vehicleRecord.findMany({
    where: {
      branchId,
      status: "active",
      exitDate: null,
    },
    include: {
      space: {
        include: {
          zone: true,
        },
      },
    },
  });
  return activeRecords;
}

export {
  createVehicleEntry,
  createVehicleExit,
  getActiveRecordsByBranch,
  updateVehicleRecord,
  getRecordsHistory,
  getDailySummary,
  getAllActiveRecordsByBranch,
};
