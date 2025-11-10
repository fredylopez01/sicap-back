import prisma from "../db/prismaClient.js";

async function getParkingReportService({ branchId, type, startDate, endDate }) {
  const dateFilter = buildDateFilter(startDate, endDate);

  switch (type) {
    case "general":
      return await getGeneralReport(branchId, dateFilter);

    case "financial":
      return await getFinancialReport(branchId, dateFilter);

    case "occupancy":
      return await getOccupancyReport(branchId, dateFilter);

    case "performance":
      return await getPerformanceReport(branchId, dateFilter);

    default:
      throw new Error(`Tipo de reporte no soportado: ${type}`);
  }
}

// ============================================
// UTILIDADES
// ============================================

function buildDateFilter(startDate, endDate) {
  const filter = {};
  if (startDate) filter.gte = new Date(startDate);
  if (endDate) filter.lte = new Date(endDate);
  return Object.keys(filter).length > 0 ? filter : undefined;
}

function calculateHoursDifference(start, end) {
  if (!start || !end) return 0;
  return (new Date(end) - new Date(start)) / (1000 * 60 * 60);
}

function groupByDate(records, dateField = "entryDate") {
  return records.reduce((acc, record) => {
    const date = new Date(record[dateField]).toISOString().split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(record);
    return acc;
  }, {});
}

function groupByHour(records, dateField = "entryDate") {
  return records.reduce((acc, record) => {
    const hour = new Date(record[dateField]).getHours();
    if (!acc[hour]) acc[hour] = 0;
    acc[hour]++;
    return acc;
  }, {});
}

async function getGeneralReport(branchId, dateFilter) {
  const whereClause = { branchId };
  if (dateFilter) whereClause.entryDate = dateFilter;

  // Obtener todos los registros del período
  const records = await prisma.vehicleRecord.findMany({
    where: whereClause,
    include: {
      space: {
        include: {
          zone: {
            include: { vehicleType: true },
          },
        },
      },
      entryController: true,
      exitController: true,
    },
  });

  // Métricas generales
  const totalRecords = records.length;
  const activeRecords = records.filter((r) => r.status === "active").length;
  const finishedRecords = records.filter((r) => r.status === "finished").length;
  const cancelledRecords = records.filter(
    (r) => r.status === "cancelled"
  ).length;

  // Análisis temporal
  const byDate = groupByDate(records);
  const dailyActivity = Object.entries(byDate)
    .map(([date, recs]) => ({
      date,
      entries: recs.length,
      exits: recs.filter((r) => r.exitDate).length,
      active: recs.filter((r) => r.status === "active").length,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const hourlyDistribution = groupByHour(records);
  const peakHours = Object.entries(hourlyDistribution)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Análisis por tipo de vehículo
  const byVehicleType = records.reduce((acc, record) => {
    const typeName = record.space.zone.vehicleType.name;
    if (!acc[typeName]) {
      acc[typeName] = { count: 0, revenue: 0 };
    }
    acc[typeName].count++;
    acc[typeName].revenue += Number(record.totalToPay || 0);
    return acc;
  }, {});

  const vehicleTypeStats = Object.entries(byVehicleType)
    .map(([type, stats]) => ({
      vehicleType: type,
      totalVehicles: stats.count,
      totalRevenue: Number(stats.revenue.toFixed(2)),
      percentage: Number(((stats.count / totalRecords) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.totalVehicles - a.totalVehicles);

  // Duración promedio de estadía
  const finishedWithTimes = records.filter((r) => r.exitDate && r.entryDate);
  const avgStayHours =
    finishedWithTimes.length > 0
      ? finishedWithTimes.reduce(
          (sum, r) => sum + calculateHoursDifference(r.entryDate, r.exitDate),
          0
        ) / finishedWithTimes.length
      : 0;

  return {
    type: "general",
    branchId,
    period: {
      startDate: dateFilter?.gte || null,
      endDate: dateFilter?.lte || null,
    },
    summary: {
      totalRecords,
      active: activeRecords,
      finished: finishedRecords,
      cancelled: cancelledRecords,
      averageStayHours: Number(avgStayHours.toFixed(2)),
    },
    dailyActivity,
    peakHours,
    vehicleTypeStats,
    generatedAt: new Date(),
  };
}

async function getFinancialReport(branchId, dateFilter) {
  const whereClause = { branchId, status: "finished" };
  if (dateFilter) whereClause.exitDate = dateFilter;

  const records = await prisma.vehicleRecord.findMany({
    where: whereClause,
    include: {
      space: {
        include: {
          zone: {
            include: { vehicleType: true },
          },
        },
      },
    },
  });

  // Ingresos totales
  const totalRevenue = records.reduce(
    (sum, r) => sum + Number(r.totalToPay || 0),
    0
  );
  const totalHours = records.reduce(
    (sum, r) => sum + Number(r.parkedHours || 0),
    0
  );

  // Ingresos por día
  const byDate = groupByDate(records, "exitDate");
  const dailyRevenue = Object.entries(byDate)
    .map(([date, recs]) => ({
      date,
      revenue: Number(
        recs.reduce((sum, r) => sum + Number(r.totalToPay || 0), 0).toFixed(2)
      ),
      transactions: recs.length,
      averageTicket: Number(
        (
          recs.reduce((sum, r) => sum + Number(r.totalToPay || 0), 0) /
          recs.length
        ).toFixed(2)
      ),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Ingresos por tipo de vehículo
  const revenueByVehicleType = records.reduce((acc, record) => {
    const type = record.space.zone.vehicleType.name;
    const rate = Number(record.appliedRate);
    if (!acc[type]) {
      acc[type] = {
        revenue: 0,
        transactions: 0,
        hours: 0,
        rate,
      };
    }
    acc[type].revenue += Number(record.totalToPay || 0);
    acc[type].transactions++;
    acc[type].hours += Number(record.parkedHours || 0);
    return acc;
  }, {});

  const vehicleTypeRevenue = Object.entries(revenueByVehicleType)
    .map(([type, data]) => ({
      vehicleType: type,
      revenue: Number(data.revenue.toFixed(2)),
      transactions: data.transactions,
      totalHours: Number(data.hours.toFixed(2)),
      averageHoursPerVehicle: Number(
        (data.hours / data.transactions).toFixed(2)
      ),
      hourlyRate: Number(data.rate),
      percentageOfTotal: Number(
        ((data.revenue / totalRevenue) * 100).toFixed(2)
      ),
    }))
    .sort((a, b) => b.revenue - a.revenue);

  // Ingresos por zona
  const revenueByZone = records.reduce((acc, record) => {
    const zone = record.space.zone.name;
    if (!acc[zone]) {
      acc[zone] = { revenue: 0, transactions: 0 };
    }
    acc[zone].revenue += Number(record.totalToPay || 0);
    acc[zone].transactions++;
    return acc;
  }, {});

  const zoneRevenue = Object.entries(revenueByZone)
    .map(([zone, data]) => ({
      zone,
      revenue: Number(data.revenue.toFixed(2)),
      transactions: data.transactions,
      averageTicket: Number((data.revenue / data.transactions).toFixed(2)),
    }))
    .sort((a, b) => b.revenue - a.revenue);

  // Estadísticas adicionales
  const averageTicket = totalRevenue / records.length || 0;
  const averageHoursParked = totalHours / records.length || 0;
  const revenuePerHour = totalHours > 0 ? totalRevenue / totalHours : 0;

  return {
    type: "financial",
    branchId,
    period: {
      startDate: dateFilter?.gte || null,
      endDate: dateFilter?.lte || null,
    },
    summary: {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalTransactions: records.length,
      totalHours: Number(totalHours.toFixed(2)),
      averageTicket: Number(averageTicket.toFixed(2)),
      averageHoursParked: Number(averageHoursParked.toFixed(2)),
      revenuePerHour: Number(revenuePerHour.toFixed(2)),
    },
    dailyRevenue,
    vehicleTypeRevenue,
    zoneRevenue,
    generatedAt: new Date(),
  };
}

async function getOccupancyReport(branchId, dateFilter) {
  const whereClause = { branchId };
  if (dateFilter) whereClause.entryDate = dateFilter;

  // Obtener zonas con sus espacios y registros
  const zones = await prisma.zone.findMany({
    where: { branchId, status: "active" },
    include: {
      vehicleType: true,
      spaces: {
        include: {
          records: {
            where: whereClause,
            orderBy: { entryDate: "desc" },
          },
        },
      },
    },
  });

  // Estado actual de ocupación
  const currentOccupancy = zones.map((zone) => {
    const totalSpaces = zone.spaces.length;
    const occupiedSpaces = zone.spaces.filter((s) =>
      s.records.some((r) => r.status === "active")
    ).length;
    const occupancyRate =
      totalSpaces > 0 ? (occupiedSpaces / totalSpaces) * 100 : 0;

    return {
      zone: zone.name,
      vehicleType: zone.vehicleType.name,
      totalSpaces,
      occupied: occupiedSpaces,
      available: totalSpaces - occupiedSpaces,
      occupancyRate: Number(occupancyRate.toFixed(2)),
    };
  });

  // Obtener registros históricos para análisis de tendencias
  const records = await prisma.vehicleRecord.findMany({
    where: whereClause,
    include: {
      space: {
        include: { zone: true },
      },
    },
  });

  // Ocupación por día
  const byDate = groupByDate(records);
  const dailyOccupancy = Object.entries(byDate)
    .map(([date, recs]) => {
      const activeAtEndOfDay = recs.filter((r) => {
        const entryDate = new Date(r.entryDate);
        const exitDate = r.exitDate ? new Date(r.exitDate) : new Date();
        const dateObj = new Date(date + "T23:59:59");
        return entryDate <= dateObj && exitDate >= dateObj;
      }).length;

      return {
        date,
        entries: recs.length,
        activeVehicles: activeAtEndOfDay,
        peakOccupancy: activeAtEndOfDay,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  // Ocupación por hora del día (promedio)
  const hourlyOccupancy = Array.from({ length: 24 }, (_, hour) => {
    const recordsInHour = records.filter((r) => {
      const entryHour = new Date(r.entryDate).getHours();
      return entryHour === hour;
    });
    return {
      hour,
      entries: recordsInHour.length,
      averageOccupancy: recordsInHour.length,
    };
  });

  // Rotación de espacios (cuántos vehículos por espacio en el período)
  const spaceRotation = zones
    .flatMap((zone) =>
      zone.spaces.map((space) => ({
        zone: zone.name,
        spaceNumber: space.spaceNumber,
        totalUsages: space.records.length,
        rotationRate: space.records.length,
      }))
    )
    .sort((a, b) => b.rotationRate - a.rotationRate)
    .slice(0, 20);

  // Estadísticas generales
  const totalCapacity = zones.reduce((sum, z) => sum + z.spaces.length, 0);
  const currentOccupied = currentOccupancy.reduce(
    (sum, z) => sum + z.occupied,
    0
  );
  const overallOccupancyRate =
    totalCapacity > 0 ? (currentOccupied / totalCapacity) * 100 : 0;

  return {
    type: "occupancy",
    branchId,
    period: {
      startDate: dateFilter?.gte || null,
      endDate: dateFilter?.lte || null,
    },
    summary: {
      totalCapacity,
      currentOccupied,
      currentAvailable: totalCapacity - currentOccupied,
      overallOccupancyRate: Number(overallOccupancyRate.toFixed(2)),
    },
    currentOccupancy,
    dailyOccupancy,
    hourlyOccupancy,
    topRotatingSpaces: spaceRotation.slice(0, 10),
    generatedAt: new Date(),
  };
}

async function getPerformanceReport(branchId, dateFilter) {
  const whereClause = { branchId };
  if (dateFilter) whereClause.entryDate = dateFilter;

  // Obtener controladores con sus registros
  const controllers = await prisma.user.findMany({
    where: { branchId, isActive: true },
    include: {
      entryRecords: {
        where: whereClause,
        include: {
          space: {
            include: {
              zone: { include: { vehicleType: true } },
            },
          },
        },
      },
      exitRecords: {
        where: dateFilter
          ? { ...whereClause, exitDate: dateFilter }
          : whereClause,
      },
    },
  });

  // Estadísticas por controlador
  const controllerStats = controllers
    .map((controller) => {
      const entries = controller.entryRecords.length;
      const exits = controller.exitRecords.length;
      const revenue = controller.exitRecords.reduce(
        (sum, r) => sum + Number(r.totalToPay || 0),
        0
      );

      return {
        id: controller.id,
        name: `${controller.names} ${controller.lastNames}`,
        email: controller.email,
        role: controller.role,
        totalEntries: entries,
        totalExits: exits,
        totalOperations: entries + exits,
        revenueGenerated: Number(revenue.toFixed(2)),
        averageRevenuePerExit:
          exits > 0 ? Number((revenue / exits).toFixed(2)) : 0,
        lastLogin: controller.lastLogin,
      };
    })
    .sort((a, b) => b.totalOperations - a.totalOperations);

  // Registros con problemas (cancelados)
  const cancelledRecords = await prisma.vehicleRecord.count({
    where: { ...whereClause, status: "cancelled" },
  });

  const totalRecords = await prisma.vehicleRecord.count({ where: whereClause });
  const cancellationRate =
    totalRecords > 0 ? (cancelledRecords / totalRecords) * 100 : 0;

  // Tiempo promedio de procesamiento (estimado por diferencia entre entrada y creación)
  const recentRecords = await prisma.vehicleRecord.findMany({
    where: whereClause,
    select: {
      entryDate: true,
      exitDate: true,
      parkedHours: true,
    },
    take: 1000,
  });

  const avgProcessingTime =
    recentRecords.length > 0
      ? recentRecords.reduce((sum, r) => {
          if (r.exitDate) {
            return sum + calculateHoursDifference(r.entryDate, r.exitDate);
          }
          return sum;
        }, 0) / recentRecords.filter((r) => r.exitDate).length
      : 0;

  // Eficiencia operativa
  const operationalEfficiency = {
    totalControllers: controllers.length,
    activeControllers: controllers.filter(
      (c) => c.entryRecords.length > 0 || c.exitRecords.length > 0
    ).length,
    averageOperationsPerController: totalRecords / controllers.length || 0,
    cancellationRate: Number(cancellationRate.toFixed(2)),
    averageProcessingTimeHours: Number(avgProcessingTime.toFixed(2)),
  };

  return {
    type: "performance",
    branchId,
    period: {
      startDate: dateFilter?.gte || null,
      endDate: dateFilter?.lte || null,
    },
    operationalEfficiency,
    controllerStats,
    topPerformers: controllerStats.slice(0, 5),
    generatedAt: new Date(),
  };
}

export { getParkingReportService };
