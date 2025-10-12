import { success } from "zod";
import {
  createVehicleEntry,
  createVehicleExit,
  getActiveRecords,
} from "../services/vehicleRecordService.js";

async function createVehicleEntryController(req, res, next) {
  try {
    const entry = await createVehicleEntry(req.user.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Ingreso registrado exitosamente",
      data: entry,
    });
  } catch (error) {
    next(error);
  }
}

async function createVehicleExitController(req, res, next) {
  try {
    const entry = await createVehicleExit(req.user.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Salida registrada exitosamente",
      data: entry,
    });
  } catch (error) {
    next(error);
  }
}

async function getActiveRecordsController(req, res, next) {
  try {
    const activeRecords = await getActiveRecords();
    return res.status(200).json({
      success: true,
      message: "Registros recuperados exitosamente",
      data: activeRecords,
    });
  } catch (error) {
    next(error);
  }
}

export {
  createVehicleEntryController,
  createVehicleExitController,
  getActiveRecordsController,
};
