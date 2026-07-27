import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../recycling.db');

const db = new sqlite3.Database(dbPath);

const dbGet = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

const run = async () => {
  try {
    console.log('=== TEST 1: Verificar usuario por correo ===');
    const user = await dbGet(
      `SELECT u.ID_Usuario, u.Correo, u.Contrasena, r.Nombre_Rol
       FROM Usuarios u
       JOIN Roles r ON r.ID_Rol = u.ID_Rol
       WHERE u.Correo = ?`,
      ['test@example.com']
    );

    console.log('Usuario encontrado:', user || null);

    console.log('\n=== TEST 2: Verificar hash de contraseña ===');
    const validPassword = user ? await bcrypt.compare('password123', user.Contrasena) : false;
    console.log('Password valido:', validPassword);

    console.log('\n=== TEST 3: Verificar empresa asociada (si aplica) ===');
    const empresa = await dbGet(
      `SELECT e.ID_Empresa, e.RUT_Empresa, e.Razon_Social
       FROM Empresas e
       JOIN Usuarios u ON u.ID_Usuario = e.ID_Usuario
       WHERE u.Correo = ?`,
      ['pyme@elbosque.cl']
    );
    console.log('Empresa encontrada:', empresa || null);
  } catch (err) {
    console.error('Error:', err);
    process.exitCode = 1;
  } finally {
    db.close();
  }
};

run();
