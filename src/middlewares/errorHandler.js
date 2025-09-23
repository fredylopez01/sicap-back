import { AppError } from "../models/Error.js";

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Error interno del servidor",
  });
}

export default errorHandler;
