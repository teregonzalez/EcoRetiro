import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../../../recycling.db');

const db = new sqlite3.Database(dbPath);

// ==========================================
// INTERFACES (Adaptadas al nuevo modelo)
// ==========================================

export interface Role {
  ID_Rol: number;
  Nombre_Rol: 'Administrador' | 'PYME' | 'Reciclador';
}

export interface UsuarioEmpresa {
  ID_Usuario: number;
  RUT_Empresa: string;
  Razon_Social: string;
  Correo: string;
  Contrasena: string;
  Nombre_Contacto: string;
  Telefono?: string;
  ID_Rol: number;
  Direccion_Geolocalizacion?: string;
  Estado_Cuenta: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Suspendida';
  Fecha_Registro: string;
}

export interface CatalogoResiduo {
  ID_Categoria: number;
  Nombre_Residuo: string;
  Unidad_Medida: string;
  Estado_Categoria: 'Activa' | 'Deshabilitada';
}

export interface SolicitudRetiro {
  ID_Solicitud: number;
  ID_PYME: number;
  ID_Reciclador?: number | null;
  ID_Categoria: number;
  Volumen_Cantidad: number;
  Estado_Tracking: 'Disponible' | 'En camino' | 'Gestionado';
  Fecha_Publicacion: string;
  Fecha_Recoleccion?: string | null;
  Fecha_Procesamiento?: string | null;
  URL_Certificado?: string | null;
}

// ==========================================
// INICIALIZACIÓN DE LA BASE DE DATOS
// ==========================================

export const initializeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Activar integridad referencial (Foreign Keys)
      db.run('PRAGMA foreign_keys = ON;', (err) => {
        if (err) reject(err);
      });

      // 1. TABLA DE ROLES
      db.run(
        `CREATE TABLE IF NOT EXISTS Roles (
          ID_Rol INTEGER PRIMARY KEY,
          Nombre_Rol TEXT NOT NULL CHECK (Nombre_Rol IN ('Administrador','PYME','Reciclador'))
        )`,
        (err) => {
          if (err) reject(err);
        }
      );

      // Insertar roles por defecto (usamos IGNORE para no duplicar si ya existen)
      db.run(
        `INSERT OR IGNORE INTO Roles (ID_Rol, Nombre_Rol) VALUES 
        (1, 'Administrador'), 
        (2, 'PYME'), 
        (3, 'Reciclador')`,
        (err) => {
          if (err) reject(err);
        }
      );

      // 2. TABLA DE USUARIOS / EMPRESAS
      db.run(
        `CREATE TABLE IF NOT EXISTS Usuarios_Empresas (
          ID_Usuario INTEGER PRIMARY KEY AUTOINCREMENT,
          RUT_Empresa TEXT NOT NULL UNIQUE,
          Razon_Social TEXT NOT NULL,
          Correo TEXT NOT NULL UNIQUE,
          Contrasena TEXT NOT NULL,
          Nombre_Contacto TEXT NOT NULL,
          Telefono TEXT,
          ID_Rol INTEGER NOT NULL,
          Direccion_Geolocalizacion TEXT,
          Estado_Cuenta TEXT NOT NULL DEFAULT 'Pendiente'
              CHECK (Estado_Cuenta IN ('Pendiente','Aprobada','Rechazada','Suspendida')),
          Fecha_Registro TEXT NOT NULL DEFAULT (datetime('now')),
          FOREIGN KEY (ID_Rol) REFERENCES Roles(ID_Rol)
        )`,
        (err) => {
          if (err) reject(err);
        }
      );

      // 3. TABLA DE CATÁLOGO DE RESIDUOS
      db.run(
        `CREATE TABLE IF NOT EXISTS Catalogo_Residuos (
          ID_Categoria INTEGER PRIMARY KEY AUTOINCREMENT,
          Nombre_Residuo TEXT NOT NULL,
          Unidad_Medida TEXT NOT NULL,
          Estado_Categoria TEXT NOT NULL DEFAULT 'Activa'
              CHECK (Estado_Categoria IN ('Activa','Deshabilitada'))
        )`,
        (err) => {
          if (err) reject(err);
        }
      );

      // Insertar categorías por defecto iniciales (opcional)
      db.run(
        `INSERT OR IGNORE INTO Catalogo_Residuos (ID_Categoria, Nombre_Residuo, Unidad_Medida) VALUES 
        (1, 'Cartón corrugado', 'kg'),
        (2, 'Plástico PET', 'kg'),
        (3, 'Aceite vegetal usado', 'litros'),
        (4, 'Borra de café', 'kg')`,
        (err) => {
          if (err) reject(err);
        }
      );

      // 4. TABLA DE SOLICITUDES DE RETIRO
      db.run(
        `CREATE TABLE IF NOT EXISTS Solicitudes_Retiro (
          ID_Solicitud INTEGER PRIMARY KEY AUTOINCREMENT,
          ID_PYME INTEGER NOT NULL,
          ID_Reciclador INTEGER,
          ID_Categoria INTEGER NOT NULL,
          Volumen_Cantidad REAL NOT NULL CHECK (Volumen_Cantidad > 0),
          Estado_Tracking TEXT NOT NULL DEFAULT 'Disponible'
              CHECK (Estado_Tracking IN ('Disponible','En camino','Gestionado')),
          Fecha_Publicacion TEXT NOT NULL DEFAULT (datetime('now')),
          Fecha_Recoleccion TEXT,
          Fecha_Procesamiento TEXT,
          URL_Certificado TEXT,
          FOREIGN KEY (ID_PYME) REFERENCES Usuarios_Empresas(ID_Usuario),
          FOREIGN KEY (ID_Reciclador) REFERENCES Usuarios_Empresas(ID_Usuario),
          FOREIGN KEY (ID_Categoria) REFERENCES Catalogo_Residuos(ID_Categoria)
        )`,
        (err) => {
          if (err) reject(err);
          else resolve(); // Se resuelve la promesa en la última consulta
        }
      );
    });
  });
};

// ==========================================
// FUNCIONES UTILITARIAS PROMISIFICADAS
// ==========================================

export const dbRun = promisify(db.run.bind(db)) as (
  sql: string,
  params?: any[]
) => Promise<void>;

export const dbGet = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = (sql: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

export default db;