import express from 'express';
import bcrypt from 'bcrypt';
import { dbRun, dbGet } from '../models/database.js';

const router = express.Router();

// ==========================================
// ENDPOINT: LOGIN
// ==========================================
router.post('/login', async (req, res) => {
  try {
    // Cambiamos 'username' por 'correo' para alinear con el nuevo esquema
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ error: 'El correo y la contraseña son requeridos' });
    }

    // Buscamos al usuario por correo, haciendo JOIN para obtener el nombre del Rol
    const user = await dbGet(
      `SELECT ue.ID_Usuario, ue.Correo, ue.Contrasena, ue.Estado_Cuenta, r.Nombre_Rol
       FROM Usuarios_Empresas ue
       JOIN Roles r ON r.ID_Rol = ue.ID_Rol
       WHERE ue.Correo = ?`,
      [correo]
    );

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Comparamos la contraseña en texto plano con el hash guardado en SQLite
    const isMatch = await bcrypt.compare(password, user.Contrasena);

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Opcional: Puedes bloquear el acceso si la cuenta aún no es aprobada por el Admin
    // if (user.Estado_Cuenta === 'Pendiente' || user.Estado_Cuenta === 'Suspendida') {
    //   return res.status(403).json({ error: `Acceso denegado. Estado de cuenta: ${user.Estado_Cuenta}` });
    // }

    res.json({ 
      success: true, 
      userId: user.ID_Usuario, 
      correo: user.Correo,
      rol: user.Nombre_Rol,
      estadoCuenta: user.Estado_Cuenta
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
    // Recibimos todos los campos requeridos por el esquema Usuarios_Empresas
    const { 
      rutEmpresa, 
      razonSocial, 
      correo, 
      password, 
      nombreContacto, 
      telefono, 
      idRol, 
      direccionGeolocalizacion 
    } = req.body;

    // Validación de campos obligatorios (NOT NULL en SQLite)
    if (!rutEmpresa || !razonSocial || !correo || !password || !nombreContacto || !idRol) {
      return res.status(400).json({ error: 'Faltan campos obligatorios para el registro' });
    }

    // Hasheamos la contraseña (10 rondas de sal es el estándar recomendado)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertamos los datos en la base de datos
    await dbRun(
      `INSERT INTO Usuarios_Empresas 
      (RUT_Empresa, Razon_Social, Correo, Contrasena, Nombre_Contacto, Telefono, ID_Rol, Direccion_Geolocalizacion) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        rutEmpresa,
        razonSocial,
        correo,
        hashedPassword, // Guardamos el hash, no la contraseña original
        nombreContacto,
        telefono || null,
        idRol,
        direccionGeolocalizacion || null
      ]
    );

    res.json({ success: true, message: 'Cuenta registrada exitosamente' });
  } catch (error: any) {
    // Manejo de errores de restricción UNIQUE (RUT o Correo ya existen)
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'El correo o RUT ingresado ya se encuentra registrado' });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;