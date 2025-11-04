import prisma from "../db/prismaClient.js";

async function getParkingReportService({ branchId, type, startDate, endDate }) {
  const dateFilter = {};

  if (startDate || endDate) {
    dateFilter.gte = startDate ?? undefined;
    dateFilter.lte = endDate ?? undefined;
  }

  switch (type) {
    // 📊 1. Reporte de actividad general
    case "activity": {
      const total = await prisma.vehicleRecord.count({ where: { branchId } });
      const active = await prisma.vehicleRecord.count({
        where: { branchId, status: "active" },
      });
      const finished = await prisma.vehicleRecord.count({
        where: { branchId, status: "finished" },
      });
      const cancelled = await prisma.vehicleRecord.count({
        where: { branchId, status: "cancelled" },
      });

      return {
        type: "activity",
        branchId,
        summary: { total, active, finished, cancelled },
      };
    }

    // 💰 2. Reporte de ingresos por rango de fechas
    case "income": {
      const records = await prisma.vehicleRecord.findMany({
        where: {
          branchId,
          exitDate: dateFilter,
          status: "finished",
        },
        select: {
          totalToPay: true,
          exitDate: true,
        },
      });

      const totalIncome = records.reduce(
        (acc, r) => acc + Number(r.totalToPay || 0),
        0
      );

      return {
        type: "income",
        branchId,
        startDate,
        endDate,
        totalIncome,
        totalRecords: records.length,
      };
    }

    // 🏗️ 3. Uso de espacios por zonas
    case "usage": {
      const zones = await prisma.zone.findMany({
        where: { branchId },
        include: {
          spaces: {
            include: {
              records: {
                where: {
                  status: "active",
                },
              },
            },
          },
        },
      });

      const usage = zones.map((zone) => {
        const totalSpaces = zone.spaces.length;
        const occupied = zone.spaces.filter((s) => s.records.length > 0).length;
        const percentage = totalSpaces > 0 ? (occupied / totalSpaces) * 100 : 0;

        return {
          zone: zone.name,
          totalSpaces,
          occupied,
          percentage: Number(percentage.toFixed(2)),
        };
      });

      return {
        type: "usage",
        branchId,
        usage,
      };
    }

    // 🧍‍♂️ 4. Actividad por controlador
    case "controllers": {
      const controllers = await prisma.user.findMany({
        where: { branchId },
        include: {
          entryRecords: true,
          exitRecords: true,
        },
      });

      return controllers.map((c) => ({
        controller: `${c.names} ${c.lastNames}`,
        entries: c.entryRecords.length,
        exits: c.exitRecords.length,
        total: c.entryRecords.length + c.exitRecords.length,
      }));
    }

    default:
      throw new Error(`Tipo de reporte no soportado: ${type}`);
  }
}

export { getParkingReportService };
