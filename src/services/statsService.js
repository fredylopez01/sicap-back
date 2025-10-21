import prisma from "../db/prismaClient.js";
import { getAllActiveRecordsByBranch } from "./vehicleRecordService.js";
import { getAllActiveZonesByBranch } from "./zoneService.js";

async function getParkingStatus(branchId) {
  // Obtener todas las zonas activas de la sede
  const zones = await getAllActiveZonesByBranch(branchId);

  // Obtener registros activos (vehículos actualmente estacionados)
  const activeRecords = await getAllActiveRecordsByBranch(branchId);

  // Calcular totales
  let totalSpaces = 0;
  let availableSpaces = 0;
  let occupiedSpaces = 0;
  let reservedSpaces = 0;

  const zoneDetails = zones.map((zone) => {
    const totalInZone = zone.spaces.length;
    const occupiedInZone = zone.spaces.filter(
      (s) => s.physicalStatus === "occupied"
    ).length;
    const reservedInZone = zone.spaces.filter(
      (s) => s.physicalStatus === "reserved"
    ).length;
    const availableInZone = zone.spaces.filter(
      (s) => s.physicalStatus === "available"
    ).length;

    totalSpaces += totalInZone;
    occupiedSpaces += occupiedInZone;
    reservedSpaces += reservedInZone;
    availableSpaces += availableInZone;

    return {
      zoneId: zone.id,
      zoneName: zone.name,
      vehicleType: zone.vehicleType.name,
      totalSpaces: totalInZone,
      availableSpaces: availableInZone,
      occupiedSpaces: occupiedInZone,
      reservedSpaces: reservedInZone,
      occupancyRate:
        totalInZone > 0
          ? ((occupiedInZone / totalInZone) * 100).toFixed(2)
          : "0.00",
    };
  });

  const occupancyRate =
    totalSpaces > 0
      ? ((occupiedSpaces / totalSpaces) * 100).toFixed(2)
      : "0.00";

  // Determinar nivel de alerta
  const alertLevel = getAlertLevel(availableSpaces, totalSpaces);

  return {
    branchId,
    timestamp: new Date().toISOString(),
    summary: {
      totalSpaces,
      availableSpaces,
      occupiedSpaces,
      reservedSpaces,
      occupancyRate: parseFloat(occupancyRate),
      activeVehicles: activeRecords.length,
    },
    alert: {
      level: alertLevel.level,
      message: alertLevel.message,
      shouldNotify: alertLevel.shouldNotify,
    },
    zoneDetails,
  };
}

function getAlertLevel(availableSpaces, totalSpaces) {
  if (availableSpaces === 0) {
    return {
      level: "critical",
      message: "Parqueadero lleno - No hay espacios disponibles",
      shouldNotify: true,
    };
  }

  if (availableSpaces <= 5) {
    return {
      level: "warning",
      message: `Alerta: Solo quedan ${availableSpaces} espacios disponibles`,
      shouldNotify: true,
    };
  }

  const occupancyRate = (totalSpaces - availableSpaces) / totalSpaces;

  if (occupancyRate >= 0.8) {
    return {
      level: "info",
      message: `Alta ocupación: ${availableSpaces} espacios disponibles`,
      shouldNotify: false,
    };
  }

  return {
    level: "normal",
    message: `✓ ${availableSpaces} espacios disponibles`,
    shouldNotify: false,
  };
}

export { getParkingStatus };
