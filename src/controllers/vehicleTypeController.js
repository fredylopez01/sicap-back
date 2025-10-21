import { success } from "zod";
import {
  createVehicleType,
  getAllVehicleTypes,
  getVehicleTypesByBranch,
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

async function getVehicleTypesByBranchController(req, res, next) {
  try {
    const { id } = req.params;
    const vehicleTypes = await getVehicleTypesByBranch(Number(id));
    return res.status(200).json({
      success: true,
      message: "Tipos de vehiculos por parqueadero recuperados exitosamente",
      data: vehicleTypes,
    });
  } catch (error) {
    next(error);
  }
}

export {
  createVehicleTypeController,
  getAllVehicleTypeController,
  getVehicleTypesByBranchController,
};
