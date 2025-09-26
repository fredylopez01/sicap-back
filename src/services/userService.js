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
  const branch = await getBranchById(newUser.branchId);
  if (!branch) {
    throw new NotFoundError("Esta sede no existe, por favor verifique.");
  }

  // Verificar nombre de usuario
  if (await getUserByUsername(newUser.userHash)) {
    throw new ConflictDBError("Este nombre de usuario ya está en uso");
  }
}

async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      lastLogin: true,
      loginAttempts: true,
      lockUntil: true,
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

export {
  getUserByEmail,
  createUser,
  getAllUsers,
  incrementLoginAttempts,
  lockAccount,
  updateLastLogin,
  getUserByDocument,
  getUserByUsername,
};
