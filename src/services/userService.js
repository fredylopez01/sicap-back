import bcrypt from "bcrypt";

// Datos quemados por el momeno
const users = [
  {
    id: 1,
    email: "admin@parking.com",
    password: await bcrypt.hash("admin123", 10),
    role: "admin",
  },
  {
    id: 2,
    email: "controller@parking.com",
    password: await bcrypt.hash("controller123", 10),
    role: "user",
  },
];

async function getUserByEmail(email) {
  return users.find((user) => user.email === email) || null;
}

async function createUser(email, password, role = "controller") {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    email,
    password: hashedPassword,
    role,
  };
  users.push(newUser);
  return newUser;
}

export { getUserByEmail, createUser };
