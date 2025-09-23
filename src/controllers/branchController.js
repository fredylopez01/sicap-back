import { createBranch } from "../services/branchServerice.js";

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

export { createBranchController };
