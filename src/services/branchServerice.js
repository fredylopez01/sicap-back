import prisma from "../db/prismaClient.js";
import { ConflictDBError, NotFoundError } from "../models/Error.js";

async function createBranch(newBranch) {
  const branch = await prisma.branch.create({
    data: {
      name: newBranch.name,
      address: newBranch.address,
      city: newBranch.city,
      department: newBranch.department,
      phone: newBranch.phone,
      openingTime: new Date(newBranch.openingTime),
      closingTime: new Date(newBranch.closingTime),
    },
  });
  return branch;
}

async function getBranchById(branchId) {
  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
  });
  if (!branch) {
    throw new NotFoundError("Esta sede no existe, por favor verifique.");
  }
  return branch;
}

async function getAllBranches() {
  return await prisma.branch.findMany();
}

async function updateBranch(branchId, updateData) {
  // Verificar si la sede existe
  await getBranchById(branchId);

  // Definir campos con posibles actualizaciones
  let allowedFields = [
    "name",
    "address",
    "city",
    "department",
    "phone",
    "status",
  ];

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

  // Actualizar usuario
  const updatedBranch = await prisma.branch.update({
    where: { id: branchId },
    data: filteredData,
  });
  return updatedBranch;
}

async function deleteBranch(branchId) {
  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    include: {
      users: true,
      zones: true,
      subscriptions: true,
    },
  });

  if (!branch) {
    throw new NotFoundError("La sede no existe");
  }

  const hasRelations =
    (branch.users && branch.users.length > 0) ||
    (branch.zones && branch.zones.length > 0) ||
    (branch.subscriptions && branch.subscriptions.length > 0);

  if (hasRelations) {
    throw new ConflictDBError(
      "La sede no puede ser eliminada porque tiene usuarios, zonas o suscripciones asociadas, mejor trata desactivarla"
    );
  }

  await prisma.branch.delete({
    where: { id: branchId },
  });
}

export {
  createBranch,
  getBranchById,
  getAllBranches,
  updateBranch,
  deleteBranch,
};
