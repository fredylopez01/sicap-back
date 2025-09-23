import { createUser, getAllUsers } from "../services/userService.js";

async function createUserController(req, res, next) {
  try {
    const { email, password, role } = req.body;
    const user = await createUser({ email, password, role });
    return res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

async function getAllUsersController(req, res, next) {
  try {
    const users = await getAllUsers();
    return res.status(200).json({
      success: true,
      message: "Usuarios recuperados exitosamente",
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

export { createUserController, getAllUsersController };
