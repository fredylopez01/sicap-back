import prisma from "../db/prismaClient.js";

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

export { createBranch };
