import prisma from "../db/prismaClient.js";
import bcrypt from "bcrypt";

// Datos quemados por el momeno
// const users = [
//   {
//     id: 1,
//     email: "admin@parking.com",
//     password: await bcrypt.hash("admin123", 10),
//     role: "admin",
//   },
//   {
//     id: 2,
//     email: "controller@parking.com",
//     password: await bcrypt.hash("controller123", 10),
//     role: "user",
//   },
// ];

// async function getUserByEmail(email) {
//   return users.find((user) => user.email === email) || null;
// }

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

export { getUserByEmail, createUser, getAllUsers };
