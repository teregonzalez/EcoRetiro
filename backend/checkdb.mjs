import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../recycling.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.all(
    `SELECT
      u.ID_Usuario,
      u.Correo,
      r.Nombre_Rol,
      u.Estado_Cuenta,
      e.RUT_Empresa,
      e.Razon_Social
     FROM Usuarios u
     JOIN Roles r ON r.ID_Rol = u.ID_Rol
     LEFT JOIN Empresas e ON e.ID_Usuario = u.ID_Usuario
     ORDER BY u.ID_Usuario`,
    (err, rows) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('=== USUARIOS EN LA BASE DE DATOS ===');
      console.log(rows);
    }

    db.all(
      `SELECT
        s.ID_Solicitud,
        eg.Razon_Social AS Empresa_Generadora,
        er.Razon_Social AS Empresa_Recicladora,
        c.Nombre_Residuo,
        s.Volumen_Cantidad,
        s.Estado_Tracking,
        s.Fecha_Publicacion
       FROM Solicitudes_Retiro s
       JOIN Empresas eg ON eg.ID_Empresa = s.ID_Empresa_Generadora
       LEFT JOIN Empresas er ON er.ID_Empresa = s.ID_Empresa_Recicladora
       JOIN Catalogo_Residuos c ON c.ID_Categoria = s.ID_Categoria
       ORDER BY s.ID_Solicitud DESC`,
      (err, rows) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log('\n=== SOLICITUDES DE RETIRO ===');
        console.log(rows);
      }
      db.close();
    }
    );
  }
  );
});
