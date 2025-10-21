import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../services/userService.js";

async function createUserController(req, res, next) {
  try {
    const user = await createUser(req.body);
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

async function updateUserController(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const actingUser = req.user;

    const userUpdated = await updateUser(Number(id), updateData, actingUser);

    return res.status(200).json({
      success: true,
      message: "Usuario actualizado exitosamente",
      data: userUpdated,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteUserController(req, res, next) {
  try {
    const { id } = req.params;

    const result = await deleteUser(Number(id));

    return res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    next(error);
  }
}

export {
  createUserController,
  getAllUsersController,
  updateUserController,
  deleteUserController,
};
