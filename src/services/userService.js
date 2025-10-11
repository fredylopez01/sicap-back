import prisma from "../db/prismaClient.js";
import bcrypt from "bcrypt";
import { ConflictDBError, NotFoundError } from "../models/Error.js";
import { getBranchById } from "./branchServerice.js";

async function getUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

async function createUser(newUser) {
  await validateNewUser(newUser);
  // Crear usuario
  const hashedPassword = await bcrypt.hash(newUser.password, 10);
  const user = await prisma.user.create({
    data: {
      cedula: newUser.cedula,
      names: newUser.names,
      lastNames: newUser.lastNames,
      phone: newUser.phone,
      email: newUser.email,
      branchId: newUser.branchId,
      userHash: newUser.userHash,
      password: hashedPassword,
      role: newUser.role || "CONTROLLER",
      hireDate: newUser.hireDate
        ? new Date(newUser.hireDate)
        : new Date().toISOString().split("T")[0],
    },
  });
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Validaciones para nuevos usuarios
async function validateNewUser(newUser) {
  // Verificar si ya existe el email
  if (await getUserByEmail(newUser.email)) {
    throw new ConflictDBError("Este correo electrónico ya está registrado");
  }

  // Verificar si ya existe la cédula
  if (await getUserByDocument(newUser.cedula)) {
    throw new ConflictDBError(
      "Este número de cédula ya está registrada en el sistema"
    );
  }

  // Verificar si la branch existe
  await getBranchById(newUser.branchId);

  // Verificar nombre de usuario
  if (await getUserByUsername(newUser.userHash)) {
    throw new ConflictDBError("Este nombre de usuario ya está en uso");
  }
}

async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      names: true,
      lastNames: true,
      phone: true,
      email: true,
      branchId: true,
      userHash: true,
      role: true,
      isActive: true,
      hireDate: true,
      createdAt: true,
      updatedAt: true,
      lastLogin: true,
    },
  });
}

async function incrementLoginAttempts(userId) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      loginAttempts: { increment: 1 },
    },
  });
}

async function lockAccount(userId, lockUntilDate) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      lockUntil: lockUntilDate,
    },
  });
}

async function updateLastLogin(userId, lastLoginDate) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      loginAttempts: 0,
      lastLogin: lastLoginDate,
      lockUntil: null,
    },
  });
}

async function getUserByDocument(document) {
  return await prisma.user.findUnique({
    where: { cedula: document },
  });
}

async function getUserByUsername(username) {
  return await prisma.user.findUnique({
    where: { userHash: username },
  });
}

async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new NotFoundError("Esta usuario no existe, por favor verifique.");
  }
  return user;
}

async function updateUser(userId, updateData, actingUser) {
  const user = await getUserById(userId);

  // Validar permisos
  if (actingUser.role === "CONTROLLER" && actingUser.id !== userId) {
    throw new ConflictDBError(
      "No tiene permisos para modificar a otros usuarios."
    );
  }

  // Campos permitidos por rol
  let allowedFields = [];
  if (actingUser.role === "ADMIN") {
    allowedFields = [
      "names",
      "lastNames",
      "phone",
      "email",
      "role",
      "isActive",
      "branchId",
      "hireDate",
      "userHash",
    ];
  } else {
    allowedFields = ["names", "lastNames", "phone", "email", "userHash"];
  }

  // Filtrar datos no permitidos
  const filteredData = {};
  for (const key of allowedFields) {
    if (updateData[key] !== undefined) {
      filteredData[key] = updateData[key];
    }
  }

  if (Object.keys(filteredData).length === 0) {
    throw new ConflictDBError(
      "No se proporcionaron campos válidos para actualizar."
    );
  }

  // Si se cambia el email, verificar duplicado
  if (filteredData.email && filteredData.email !== user.email) {
    const existingEmail = await getUserByEmail(filteredData.email);
    if (existingEmail) {
      throw new ConflictDBError("Este correo electrónico ya está en uso.");
    }
  }

  // Actualizar usuario
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: filteredData,
  });

  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
}

async function deleteUser(userId) {
  // 1. Verificar si el usuario existe
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      entryRecords: true,
      exitRecords: true,
    },
  });

  if (!user) {
    throw new NotFoundError("El usuario no existe.");
  }

  // 2. Verificar si tiene registros asociados
  const hasRecords =
    (user.entryRecords && user.entryRecords.length > 0) ||
    (user.exitRecords && user.exitRecords.length > 0);

  // 3. Si tiene registros, solo desactivar
  if (hasRecords) {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    return "El usuario tiene registros asociados, por lo tanto fue desactivado en lugar de eliminado.";
  }

  // 4. Si no tiene registros, eliminar completamente
  await prisma.user.delete({
    where: { id: userId },
  });

  return "Usuario eliminado exitosamente.";
}

export {
  getUserByEmail,
  createUser,
  getAllUsers,
  incrementLoginAttempts,
  lockAccount,
  updateLastLogin,
  getUserByDocument,
  getUserByUsername,
  getUserById,
  updateUser,
  deleteUser,
};
