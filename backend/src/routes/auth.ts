import express from 'express';
import bcrypt from 'bcrypt';
import { dbRun, dbGet } from '../models/database.js';
import { signAuthToken } from '../middleware/authMiddleware.js';

const router = express.Router();

const FRONTEND_ROLE_MAP: Record<string, string> = {
  Administrador: 'Administrador',
  Empresa_Generadora: 'PYME',
  Empresa_Recicladora: 'Reciclador',
};

const normalizeRoleInput = (idRol?: number, roleName?: string): number => {
  if (typeof idRol === 'number' && Number.isInteger(idRol)) {
    return idRol;
  }

  const normalized = String(roleName || '')
    .trim()
    .toLowerCase();

  if (normalized === 'administrador') return 1;
  if (normalized === 'pyme' || normalized === 'empresa_generadora') return 2;
  if (normalized === 'reciclador' || normalized === 'empresa_recicladora') return 3;

  return 2;
};

// ==========================================
// ENDPOINT: LOGIN
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ error: 'El correo y la contraseña son requeridos' });
    }

    const user = await dbGet(
      `SELECT u.ID_Usuario, u.Correo, u.Contrasena, u.Estado_Cuenta, r.Nombre_Rol
       FROM Usuarios u
       JOIN Roles r ON r.ID_Rol = u.ID_Rol
       WHERE u.Correo = ?`,
      [correo]
    );

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.Contrasena);

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const frontendRole = FRONTEND_ROLE_MAP[user.Nombre_Rol] || 'PYME';
    const token = signAuthToken({
      id: user.ID_Usuario,
      correo: user.Correo,
      role: frontendRole,
      rolInterno: user.Nombre_Rol,
    });

    res.json({
      success: true,
      token,
      userId: user.ID_Usuario,
      correo: user.Correo,
      rol: frontendRole,
      rolInterno: user.Nombre_Rol,
      estadoCuenta: user.Estado_Cuenta,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==========================================
// ENDPOINT: REGISTRO
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const {
      rutEmpresa,
      razonSocial,
      correo,
      password,
      nombreContacto,
      telefono,
      idRol,
      rol,
      direccionGeolocalizacion,
    } = req.body;

    if (!correo || !password || !nombreContacto) {
      return res.status(400).json({ error: 'Faltan campos obligatorios para el registro' });
    }

    const normalizedRoleId = normalizeRoleInput(Number(idRol), rol);
    if (![1, 2, 3].includes(normalizedRoleId)) {
      return res.status(400).json({ error: 'Rol invalido' });
    }

    if (normalizedRoleId !== 1 && (!rutEmpresa || !razonSocial)) {
      return res.status(400).json({ error: 'Las empresas deben informar RUT y razon social' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await dbRun('BEGIN TRANSACTION');

    await dbRun(
      `INSERT INTO Usuarios (
        ID_Rol,
        Correo,
        Contrasena,
        Nombre_Contacto,
        Telefono,
        Estado_Cuenta
      ) VALUES (?, ?, ?, ?, ?, 'Pendiente')`,
      [
        normalizedRoleId,
        correo,
        hashedPassword,
        nombreContacto,
        telefono || null,
      ]
    );

    const createdUser = await dbGet('SELECT ID_Usuario FROM Usuarios WHERE Correo = ?', [correo]);
    if (!createdUser?.ID_Usuario) {
      throw new Error('No se pudo recuperar el usuario registrado');
    }

    if (normalizedRoleId !== 1) {
      await dbRun(
        `INSERT INTO Empresas (
          ID_Usuario,
          RUT_Empresa,
          Razon_Social,
          Direccion_Geolocalizacion
        ) VALUES (?, ?, ?, ?)`,
        [
          createdUser.ID_Usuario,
          rutEmpresa,
          razonSocial,
          direccionGeolocalizacion || null,
        ]
      );
    }

    await dbRun('COMMIT');

    res.json({ success: true, message: 'Cuenta registrada exitosamente' });
  } catch (error: any) {
    try {
      await dbRun('ROLLBACK');
    } catch {
      // Ignoramos rollback si la transacción no alcanzó a abrirse.
    }

    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'El correo o RUT ingresado ya se encuentra registrado' });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;