import { getParkingReportService } from "../services/reportService";

export async function getParkingReportController(req, res, next) {
  try {
    const { branchId, type = "activity", startDate, endDate } = req.query;

    if (!branchId) {
      return res.status(400).json({
        success: false,
        message: "El parámetro branchId es obligatorio.",
      });
    }

    const report = await getParkingReportService({
      branchId: Number(branchId),
      type: String(type),
      startDate: startDate ? new Date(String(startDate)) : undefined,
      endDate: endDate ? new Date(String(endDate)) : undefined,
    });

    return res.status(200).json({
      success: true,
      message: "Reporte generado correctamente",
      data: report,
    });
  } catch (error) {
    next(error);
  }
}
