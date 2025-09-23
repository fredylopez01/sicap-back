import bcrypt from "bcrypt";
import {
  getUserByEmail,
  incrementLoginAttempts,
  lockAccount,
  updateLastLogin,
} from "./userService.js";
import { generateToken } from "../utils/jwtUtils.js";
import {
  AccountLockedError,
  InactiveAccountError,
  UnauthorizedError,
} from "../models/Error.js";

async function loginUser(email, password) {
  const user = await getUserByEmail(email);

  if (!user) throw new UnauthorizedError("Usuario o contraseña incorrectos");
  if (!user.isActive) throw new InactiveAccountError();
  ensureUserNotLocked(user);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) await handleFailedLogin(user);

  await updateLastLogin(user.id, new Date());

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

function ensureUserNotLocked(user) {
  if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
    const time = user.lockUntil.toLocaleString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
    throw new AccountLockedError(
      `Tu cuenta está bloqueada temporalmente. Intenta después de las ${time}.`
    );
  }
}

async function handleFailedLogin(user) {
  await incrementLoginAttempts(user.id);

  if (user.loginAttempts + 1 >= (process.env.MAX_LOGIN_ATTEMPS || 5)) {
    const lockUntil = new Date(
      Date.now() + (process.env.LOCKED_MINUTES || 15) * 60 * 1000
    );
    await lockAccount(user.id, lockUntil);
  }

  throw new UnauthorizedError("Usuario o contraseña incorrectos");
}

export { loginUser };
