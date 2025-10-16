import { success } from "zod";
import {
  createVehicleEntry,
  createVehicleExit,
  getActiveRecords,
  updateVehicleRecord,
} from "../services/vehicleRecordService.js";

async function createVehicleEntryController(req, res, next) {
  try {
    const entry = await createVehicleEntry(req.user, req.body);
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
    const entry = await createVehicleExit(req.user, req.body);
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

async function updateVehicleRecordController(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedRecord = await updateVehicleRecord(Number(id), updateData);

    return res.status(200).json({
      success: true,
      message: "Registro actualizado correctamente",
      data: updatedRecord,
    });
  } catch (error) {
    next(error);
  }
}

export {
  createVehicleEntryController,
  createVehicleExitController,
  getActiveRecordsController,
  updateVehicleRecordController,
};
