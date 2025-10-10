import { entryRegistration } from "../services/vehicleRecordService.js";

async function entryRegistrationController(req, res, next) {
  try {
    const entry = await entryRegistration(req.user.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Ingreso registrado exitosamente",
      data: entry,
    });
  } catch (error) {
    next(error);
  }
}

export { entryRegistrationController };
