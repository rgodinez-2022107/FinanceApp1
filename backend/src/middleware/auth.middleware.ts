import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

/**
 * Middleware que protege rutas privadas.
 * Espera el header: Authorization: Bearer <token>
 */
export function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Acceso denegado. Token no proporcionado.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { email: string };
    req.user = { email: decoded.email };
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido o expirado.',
    });
  }
}
