import { createBranch, getAllBranches } from "../services/branchServerice.js";

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
    const users = await getAllBranches();
    return res.status(200).json({
      success: true,
      message: "Sedes recuperadas exitosamente",
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

export { createBranchController, getAllBranchesController };
