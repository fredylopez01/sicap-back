import {
  createBranch,
  deleteBranch,
  getAllBranches,
  updateBranch,
} from "../services/branchServerice.js";

async function createBranchController(req, res, next) {
  try {
    const newBranch = await createBranch(req.body);
    return res.status(201).json({
      success: true,
      message: "Nueva sede creada con exito",
      data: newBranch,
    });
  } catch (error) {
    next(error);
  }
}

async function getAllBranchesController(req, res, next) {
  try {
    const branches = await getAllBranches();
    return res.status(200).json({
      success: true,
      message: "Sedes recuperadas exitosamente",
      data: branches,
    });
  } catch (error) {
    next(error);
  }
}

async function updateBranchController(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedBranch = await updateBranch(Number(id), updateData);

    return res.status(200).json({
      success: true,
      message: "Sede actualizada exitosamente.",
      data: updatedBranch,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteBranchController(req, res, next) {
  try {
    const { id } = req.params;

    await deleteBranch(Number(id));
    return res.status(200).json({
      success: true,
      message: "Sede eliminada existosamente",
    });
  } catch (error) {
    next(error);
  }
}

export {
  createBranchController,
  getAllBranchesController,
  updateBranchController,
  deleteBranchController,
};
