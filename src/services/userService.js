import prisma from "../db/prismaClient.js";
import bcrypt from "bcrypt";

async function getUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

async function createUser(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      role: data.role || "CONTROLLER",
    },
  });
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
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

export {
  getUserByEmail,
  createUser,
  getAllUsers,
  incrementLoginAttempts,
  lockAccount,
  updateLastLogin,
};
