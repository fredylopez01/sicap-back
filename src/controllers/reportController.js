import { getParkingReportService } from "../services/reportService.js";

export async function getParkingReportController(req, res, next) {
  try {
    const { type = "activity", startDate, endDate } = req.body;
    const branchId = req.user.branchId;

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
