class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "No autorizado") {
    super(message, 401);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Recurso no encontrado") {
    super(message, 404);
  }
}

class InactiveAccountError extends AppError {
  constructor(
    message = "Tu cuenta está inactiva, por favor contacta al administrador."
  ) {
    super(message, 403);
  }
}

class AccountLockedError extends AppError {
  constructor(message = "Cuenta bloqueada") {
    super(message, 403);
  }
}

export {
  AppError,
  UnauthorizedError,
  NotFoundError,
  InactiveAccountError,
  AccountLockedError,
};
