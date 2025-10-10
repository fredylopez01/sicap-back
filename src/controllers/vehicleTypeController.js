import {
  createVehicleType,
  getAllVehicleTypes,
} from "../services/vehicleTypeService.js";

async function createVehicleTypeController(req, res, next) {
  try {
    const newVehicleType = await createVehicleType(req.body);
    return res.status(201).json({
      success: true,
      message: "Nuevo tipo de vehiculo creado con exito",
      data: newVehicleType,
    });
  } catch (error) {
    next(error);
  }
}

async function getAllVehicleTypeController(req, res, next) {
  try {
    const vehicleTypes = await getAllVehicleTypes();
    return res.status(200).json({
      success: true,
      message: "Tipos de vehiculo recuperados exitosamente",
      data: vehicleTypes,
    });
  } catch (error) {
    next(error);
  }
}

export { createVehicleTypeController, getAllVehicleTypeController };
