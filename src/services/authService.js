import bcrypt from "bcrypt";
import { getUserByEmail } from "./userService.js";
import { generateToken } from "../utils/jwtUtils.js";
import { UnauthorizedError } from "../models/Error.js";

async function loginUser(email, password) {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError("Usuario o contraseña incorrectos");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError("Usuario o contraseña incorrectos");
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
}

export { loginUser };
