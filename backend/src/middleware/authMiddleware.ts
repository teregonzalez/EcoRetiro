import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedUser {
  userId: number;
  correo: string;
  role: string;
  rolInterno?: string;
}

export const JWT_SECRET = process.env.JWT_SECRET || 'recycling-dev-secret';

export const signAuthToken = (user: {
  id: number;
  correo: string;
  role: string;
  rolInterno?: string;
}) =>
  jwt.sign(
    {
      userId: user.id,
      correo: user.correo,
      role: user.role,
      rolInterno: user.rolInterno || user.role,
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticación requerido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      correo: string;
      role: string;
      rolInterno?: string;
    };

    (req as Request & { user?: AuthenticatedUser }).user = {
      userId: decoded.userId,
      correo: decoded.correo,
      role: decoded.role,
      rolInterno: decoded.rolInterno || decoded.role,
    };

    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      correo: string;
      role: string;
      rolInterno?: string;
    };

    (req as Request & { user?: AuthenticatedUser }).user = {
      userId: decoded.userId,
      correo: decoded.correo,
      role: decoded.role,
      rolInterno: decoded.rolInterno || decoded.role,
    };
  } catch {
    // Ignore invalid tokens while keeping endpoints compatible with previous client flows.
  }

  return next();
};
