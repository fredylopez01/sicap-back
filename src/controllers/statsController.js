import { getParkingStatus } from "../services/statsService.js";

async function getParkingStatusController(req, res, next) {
  try {
    const { id } = req.params;
    const parkingStatus = await getParkingStatus(Number(id));

    return res.status(200).json({
      success: true,
      message: "Estado de la sede recuperado exitosamente",
      data: parkingStatus,
    });
  } catch (error) {
    next(error);
  }
}

export { getParkingStatusController };
