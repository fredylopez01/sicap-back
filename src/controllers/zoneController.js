import { createZone, getAllZonesByBranch, updateZone, deleteZone } from "../services/zoneService.js";

async function createZoneController(req, res, next) {
  try {
    const newZone = await createZone(req.body);
    return res.status(201).json({
      success: true,
      message: "Nueva zona creada con exito",
      data: newZone,
    });
  } catch (error) {
    next(error);
  }
}

async function getAllZonesByBranchController(req, res, next) {
  try {
    const branchId = parseInt(req.params.branchId, 10);
    const zones = await getAllZonesByBranch(branchId);
    return res.status(200).json({
      success: true,
      message: "Zonas recuperadas exitosamente",
      data: zones,
    });
  } catch (error) {
    next(error);
  }
}

async function updateZoneController(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedZone = await updateZone(Number(id), updateData);

    return res.status(200).json({
      success: true,
      message: "Zona actualizada exitosamente",
      data: updatedZone,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteZoneController(req, res, next) {
  try {
    const { id } = req.params;

    const result = await deleteZone(Number(id));

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
}

export { createZoneController, getAllZonesByBranchController, updateZoneController, deleteZoneController };
