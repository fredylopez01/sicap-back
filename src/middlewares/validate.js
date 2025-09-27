import { BadRequestError } from "../models/Error.js";

function validateSchema(schema) {
  return function (req, res, next) {
    const result = schema.safeParse(req.body);

    if (result.success) {
      return next();
    }

    const issues = result.error.issues || [];

    const messages = issues
      ? issues[0].message
      : "Error en la petición error en el body";

    return next(new BadRequestError(messages));
  };
}

export { validateSchema };
