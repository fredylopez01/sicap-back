import { getAllSpacesByZone } from "../services/SpaceService.js";

async function getAllSpacesByZoneController(req, res, next) {
  try {
    const zoneId = parseInt(req.params.zoneId, 10);
    const spaces = await getAllSpacesByZone(zoneId);
    return res.status(200).json({
      success: true,
      message: "Espacios recuperadas exitosamente",
      data: spaces,
    });
  } catch (error) {
    next(error);
  }
}

export { getAllSpacesByZoneController };
