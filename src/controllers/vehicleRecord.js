import {
  createVehicleEntry,
  createVehicleExit,
  getActiveRecordsByBranch,
  getDailySummary,
  getRecordsHistory,
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

async function getActiveRecordsByBranchController(req, res, next) {
  try {
    const { id } = req.params;
    const activeRecords = await getActiveRecordsByBranch(Number(id));
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

async function getRecordsHistoryController(req, res, next) {
  try {
    const filters = req.body;
    const filteredRecords = await getRecordsHistory(filters);

    return res.status(200).json({
      success: true,
      message: "Registros encontrados correctamente",
      data: filteredRecords,
    });
  } catch (error) {
    next(error);
  }
}

async function getDailySummaryController(req, res, next) {
  try {
    const { id } = req.params;
    const date = req.body.date;

    const dailySummary = await getDailySummary(Number(id), date);

    return res.status(200).json({
      succes: true,
      message: "Resumen diario recuperado exitosamente",
      data: dailySummary,
    });
  } catch (error) {
    next(error);
  }
}

export {
  createVehicleEntryController,
  createVehicleExitController,
  getActiveRecordsByBranchController,
  updateVehicleRecordController,
  getRecordsHistoryController,
  getDailySummaryController,
};
