import { UnauthorizedError, ForbiddenError } from "../models/Error.js";
import { verifyJwtToken } from "../utils/jwtUtils.js";

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Token de acceso requerido");
  }
  const token = authHeader.split(" ")[1];

  if (!token) throw new UnauthorizedError("Token de acceso requerido");

  const user = verifyJwtToken(token);

  req.user = user;
  next();
}

function checkRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) throw new UnauthorizedError("Usuario no autenticado");

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(
        "No tienes permisos para acceder a este recurso"
      );
    }

    next();
  };
}

export { verifyToken, checkRole };
