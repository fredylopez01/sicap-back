import { loginUser } from "../services/authService.js";

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);

    return res.json({
      success: true,
      message: "Login exitoso",
      data: result,
    });
  } catch (error) {
    next(error); // pasa el error al middleware centralizado
  }
}

export { login };
