import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

interface LoginBody {
  email?: string;
  password?: string;
}

/**
 * POST /api/auth/login
 * Valida las credenciales contra el único usuario del sistema
 * (definido en variables de entorno) y devuelve un JWT si son correctas.
 * No existe endpoint de registro: el usuario ya existe de forma fija.
 */
export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as LoginBody;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Debe proporcionar correo y contraseña.',
    });
    return;
  }

  const isEmailValid = email.trim().toLowerCase() === config.admin.email.toLowerCase();
  const isPasswordValid = await bcrypt.compare(password, config.admin.passwordHash);

  if (!isEmailValid || !isPasswordValid) {
    res.status(401).json({
      success: false,
      message: 'Credenciales inválidas.',
    });
    return;
  }

  const token = jwt.sign({ email: config.admin.email }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as jwt.SignOptions);

  res.status(200).json({
    success: true,
    message: 'Inicio de sesión exitoso.',
    token,
    user: {
      email: config.admin.email,
    },
  });
}

/**
 * GET /api/auth/me
 * Ruta protegida de ejemplo: devuelve los datos del usuario autenticado
 * a partir del token JWT verificado por el middleware.
 */
export function me(req: Request, res: Response): void {
  res.status(200).json({
    success: true,
    user: req.user,
  });
}
