import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../../../recycling.db');

const db = new sqlite3.Database(dbPath);

// ==========================================
// INTERFACES
// ==========================================

export interface Role {
  ID_Rol: number;
  Nombre_Rol: 'Administrador' | 'Empresa_Generadora' | 'Empresa_Recicladora';
}

export interface Usuario {
  ID_Usuario: number;
  Correo: string;
  Contrasena: string;
  Nombre_Contacto: string;
  Telefono?: string;
  ID_Rol: number;
  Estado_Cuenta: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Suspendida';
  Fecha_Registro: string;
  Fecha_Actualizacion: string;
}

export interface Empresa {
  ID_Empresa: number;
  ID_Usuario: number;
  RUT_Empresa: string;
  Razon_Social: string;
  Direccion_Geolocalizacion?: string;
  Fecha_Actualizacion: string;
}

export interface CatalogoResiduo {
  ID_Categoria: number;
  ID_Usuario_Administrador?: number | null;
  Nombre_Residuo: string;
  Unidad_Medida: string;
  Estado_Categoria: 'Activa' | 'Deshabilitada';
  Fecha_Creacion: string;
  Fecha_Actualizacion: string;
}

export interface SolicitudRetiro {
  ID_Solicitud: number;
  ID_Empresa_Generadora: number;
  ID_Empresa_Recicladora?: number | null;
  ID_Vehiculo?: number | null;
  ID_Categoria: number;
  Volumen_Cantidad: number;
  Estado_Tracking: 'Disponible' | 'En camino' | 'Gestionado';
  Fecha_Publicacion: string;
  Fecha_Recoleccion?: string | null;
  Fecha_Procesamiento?: string | null;
  URL_Certificado?: string | null;
}

// ==========================================
// UTILIDADES SQLITE PROMISIFICADAS
// ==========================================

const runSql = (sql: string, params: any[] = []): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const getSql = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const allSql = (sql: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

const tableExists = async (tableName: string): Promise<boolean> => {
  const row = await getSql(
    `SELECT name
     FROM sqlite_master
     WHERE type = 'table' AND name = ?`,
    [tableName]
  );

  return !!row;
};

const hasColumn = async (tableName: string, columnName: string): Promise<boolean> => {
  const columns = await allSql(`PRAGMA table_info(${tableName})`);
  return columns.some((col) => col.name === columnName);
};

const migrateLegacyUsersEmpresas = async () => {
  const legacyTableExists = await tableExists('Usuarios_Empresas');
  if (!legacyTableExists) {
    return;
  }

  const alreadyMigrated = await getSql('SELECT COUNT(*) AS total FROM Usuarios');
  if ((alreadyMigrated?.total || 0) > 0) {
    return;
  }

  const legacyUsers = await allSql('SELECT * FROM Usuarios_Empresas');
  for (const row of legacyUsers) {
    await runSql(
      `INSERT OR IGNORE INTO Usuarios (
        ID_Usuario,
        ID_Rol,
        Correo,
        Contrasena,
        Nombre_Contacto,
        Telefono,
        Estado_Cuenta,
        Fecha_Registro,
        Fecha_Actualizacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')))` ,
      [
        row.ID_Usuario,
        row.ID_Rol,
        row.Correo,
        row.Contrasena,
        row.Nombre_Contacto,
        row.Telefono ?? null,
        row.Estado_Cuenta ?? 'Pendiente',
        row.Fecha_Registro ?? new Date().toISOString(),
        row.Fecha_Actualizacion ?? null,
      ]
    );

    await runSql(
      `INSERT OR IGNORE INTO Empresas (
        ID_Usuario,
        RUT_Empresa,
        Razon_Social,
        Direccion_Geolocalizacion,
        Fecha_Actualizacion
      ) VALUES (?, ?, ?, ?, COALESCE(?, datetime('now')))` ,
      [
        row.ID_Usuario,
        row.RUT_Empresa,
        row.Razon_Social,
        row.Direccion_Geolocalizacion ?? null,
        row.Fecha_Actualizacion ?? null,
      ]
    );
  }
};

const migrateRolesTable = async () => {
  const rolesExists = await tableExists('Roles');
  if (!rolesExists) {
    return;
  }

  // Detectar esquema antiguo por valores legacy de rol.
  const hasLegacyRoles = await getSql(
    `SELECT 1 AS found
     FROM Roles
     WHERE Nombre_Rol IN ('PYME', 'Reciclador')
     LIMIT 1`
  );

  if (!hasLegacyRoles) {
    return;
  }

  await runSql('PRAGMA foreign_keys = OFF;');

  await runSql(
    `CREATE TABLE IF NOT EXISTS Roles_v2 (
      ID_Rol INTEGER PRIMARY KEY,
      Nombre_Rol TEXT NOT NULL CHECK (Nombre_Rol IN ('Administrador','Empresa_Generadora','Empresa_Recicladora'))
    )`
  );

  await runSql(
    `INSERT OR REPLACE INTO Roles_v2 (ID_Rol, Nombre_Rol)
     SELECT
      ID_Rol,
      CASE
        WHEN Nombre_Rol = 'PYME' THEN 'Empresa_Generadora'
        WHEN Nombre_Rol = 'Reciclador' THEN 'Empresa_Recicladora'
        ELSE Nombre_Rol
      END
     FROM Roles`
  );

  await runSql('DROP TABLE Roles');
  await runSql('ALTER TABLE Roles_v2 RENAME TO Roles');
  await runSql('PRAGMA foreign_keys = ON;');
};

const migrateCatalogoResiduos = async () => {
  const catalogExists = await tableExists('Catalogo_Residuos');
  if (!catalogExists) {
    return;
  }

  if (!(await hasColumn('Catalogo_Residuos', 'ID_Usuario_Administrador'))) {
    await runSql('ALTER TABLE Catalogo_Residuos ADD COLUMN ID_Usuario_Administrador INTEGER');
  }
  if (!(await hasColumn('Catalogo_Residuos', 'Fecha_Creacion'))) {
    await runSql('ALTER TABLE Catalogo_Residuos ADD COLUMN Fecha_Creacion TEXT');
    await runSql(
      `UPDATE Catalogo_Residuos
       SET Fecha_Creacion = COALESCE(Fecha_Creacion, datetime('now'))`
    );
  }
  if (!(await hasColumn('Catalogo_Residuos', 'Fecha_Actualizacion'))) {
    await runSql('ALTER TABLE Catalogo_Residuos ADD COLUMN Fecha_Actualizacion TEXT');
    await runSql(
      `UPDATE Catalogo_Residuos
       SET Fecha_Actualizacion = COALESCE(Fecha_Actualizacion, datetime('now'))`
    );
  }

  const admin = await getSql(
    `SELECT ID_Usuario
     FROM Usuarios
     WHERE ID_Rol = 1
     ORDER BY ID_Usuario ASC
     LIMIT 1`
  );

  if (admin?.ID_Usuario) {
    await runSql(
      `UPDATE Catalogo_Residuos
       SET ID_Usuario_Administrador = ?
       WHERE ID_Usuario_Administrador IS NULL`,
      [admin.ID_Usuario]
    );
  }
};

const ensureDefaultCategories = async () => {
  const admin = await getSql(
    `SELECT ID_Usuario
     FROM Usuarios
     WHERE ID_Rol = 1
     ORDER BY ID_Usuario ASC
     LIMIT 1`
  );

  await runSql(
    `INSERT INTO Catalogo_Residuos (ID_Usuario_Administrador, Nombre_Residuo, Unidad_Medida, Estado_Categoria)
     SELECT ?, 'Metal', 'kg', 'Activa'
     WHERE NOT EXISTS (
       SELECT 1
       FROM Catalogo_Residuos
       WHERE lower(Nombre_Residuo) = lower('Metal')
     )`,
    [admin?.ID_Usuario ?? null]
  );
};

const migrateSolicitudesRetiro = async () => {
  const solicitudesExists = await tableExists('Solicitudes_Retiro');
  if (!solicitudesExists) {
    await runSql(
      `CREATE TABLE IF NOT EXISTS Solicitudes_Retiro (
        ID_Solicitud INTEGER PRIMARY KEY AUTOINCREMENT,
        ID_Empresa_Generadora INTEGER NOT NULL,
        ID_Empresa_Recicladora INTEGER,
        ID_Vehiculo INTEGER,
        ID_Categoria INTEGER NOT NULL,
        Volumen_Cantidad REAL NOT NULL CHECK (Volumen_Cantidad > 0),
        Estado_Tracking TEXT NOT NULL DEFAULT 'Disponible'
            CHECK (Estado_Tracking IN ('Disponible','En camino','Gestionado')),
        Fecha_Publicacion TEXT NOT NULL DEFAULT (datetime('now')),
        Fecha_Recoleccion TEXT,
        Fecha_Procesamiento TEXT,
        URL_Certificado TEXT,
        FOREIGN KEY (ID_Empresa_Generadora) REFERENCES Empresas(ID_Empresa),
        FOREIGN KEY (ID_Empresa_Recicladora) REFERENCES Empresas(ID_Empresa),
        FOREIGN KEY (ID_Vehiculo) REFERENCES Vehiculos(ID_Vehiculo),
        FOREIGN KEY (ID_Categoria) REFERENCES Catalogo_Residuos(ID_Categoria)
      )`
    );
    return;
  }

  const isLegacySchema = await hasColumn('Solicitudes_Retiro', 'ID_PYME');
  if (!isLegacySchema) {
    return;
  }

  await runSql(
    `CREATE TABLE IF NOT EXISTS Solicitudes_Retiro_v2 (
      ID_Solicitud INTEGER PRIMARY KEY AUTOINCREMENT,
      ID_Empresa_Generadora INTEGER NOT NULL,
      ID_Empresa_Recicladora INTEGER,
      ID_Vehiculo INTEGER,
      ID_Categoria INTEGER NOT NULL,
      Volumen_Cantidad REAL NOT NULL CHECK (Volumen_Cantidad > 0),
      Estado_Tracking TEXT NOT NULL DEFAULT 'Disponible'
          CHECK (Estado_Tracking IN ('Disponible','En camino','Gestionado')),
      Fecha_Publicacion TEXT NOT NULL DEFAULT (datetime('now')),
      Fecha_Recoleccion TEXT,
      Fecha_Procesamiento TEXT,
      URL_Certificado TEXT,
      FOREIGN KEY (ID_Empresa_Generadora) REFERENCES Empresas(ID_Empresa),
      FOREIGN KEY (ID_Empresa_Recicladora) REFERENCES Empresas(ID_Empresa),
      FOREIGN KEY (ID_Vehiculo) REFERENCES Vehiculos(ID_Vehiculo),
      FOREIGN KEY (ID_Categoria) REFERENCES Catalogo_Residuos(ID_Categoria)
    )`
  );

  await runSql(
    `INSERT OR IGNORE INTO Solicitudes_Retiro_v2 (
      ID_Solicitud,
      ID_Empresa_Generadora,
      ID_Empresa_Recicladora,
      ID_Vehiculo,
      ID_Categoria,
      Volumen_Cantidad,
      Estado_Tracking,
      Fecha_Publicacion,
      Fecha_Recoleccion,
      Fecha_Procesamiento,
      URL_Certificado
    )
    SELECT
      s.ID_Solicitud,
      eg.ID_Empresa,
      er.ID_Empresa,
      NULL,
      s.ID_Categoria,
      s.Volumen_Cantidad,
      s.Estado_Tracking,
      s.Fecha_Publicacion,
      s.Fecha_Recoleccion,
      s.Fecha_Procesamiento,
      s.URL_Certificado
    FROM Solicitudes_Retiro s
    LEFT JOIN Empresas eg ON eg.ID_Usuario = s.ID_PYME
    LEFT JOIN Empresas er ON er.ID_Usuario = s.ID_Reciclador
    WHERE eg.ID_Empresa IS NOT NULL`
  );

  await runSql('DROP TABLE Solicitudes_Retiro');
  await runSql('ALTER TABLE Solicitudes_Retiro_v2 RENAME TO Solicitudes_Retiro');
};

export const initializeDatabase = async (): Promise<void> => {
  await runSql('PRAGMA foreign_keys = ON;');

  await runSql(
    `CREATE TABLE IF NOT EXISTS Roles (
      ID_Rol INTEGER PRIMARY KEY,
      Nombre_Rol TEXT NOT NULL CHECK (Nombre_Rol IN ('Administrador','Empresa_Generadora','Empresa_Recicladora'))
    )`
  );

  await migrateRolesTable();

  await runSql(
    `INSERT INTO Roles (ID_Rol, Nombre_Rol) VALUES
      (1, 'Administrador'),
      (2, 'Empresa_Generadora'),
      (3, 'Empresa_Recicladora')
     ON CONFLICT(ID_Rol) DO UPDATE SET Nombre_Rol = excluded.Nombre_Rol`
  );

  await runSql(
    `CREATE TABLE IF NOT EXISTS Usuarios (
      ID_Usuario INTEGER PRIMARY KEY AUTOINCREMENT,
      ID_Rol INTEGER NOT NULL,
      Correo TEXT NOT NULL UNIQUE,
      Contrasena TEXT NOT NULL,
      Nombre_Contacto TEXT NOT NULL,
      Telefono TEXT,
      Estado_Cuenta TEXT NOT NULL DEFAULT 'Pendiente'
          CHECK (Estado_Cuenta IN ('Pendiente','Aprobada','Rechazada','Suspendida')),
      Fecha_Registro TEXT NOT NULL DEFAULT (datetime('now')),
      Fecha_Actualizacion TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (ID_Rol) REFERENCES Roles(ID_Rol)
    )`
  );

  await runSql(
    `CREATE TABLE IF NOT EXISTS Empresas (
      ID_Empresa INTEGER PRIMARY KEY AUTOINCREMENT,
      ID_Usuario INTEGER NOT NULL UNIQUE,
      RUT_Empresa TEXT NOT NULL UNIQUE,
      Razon_Social TEXT NOT NULL,
      Direccion_Geolocalizacion TEXT,
      Fecha_Actualizacion TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (ID_Usuario) REFERENCES Usuarios(ID_Usuario)
    )`
  );

  await runSql(
    `CREATE TABLE IF NOT EXISTS Catalogo_Residuos (
      ID_Categoria INTEGER PRIMARY KEY AUTOINCREMENT,
      ID_Usuario_Administrador INTEGER,
      Nombre_Residuo TEXT NOT NULL,
      Unidad_Medida TEXT NOT NULL,
      Estado_Categoria TEXT NOT NULL DEFAULT 'Activa'
          CHECK (Estado_Categoria IN ('Activa','Deshabilitada')),
      Fecha_Creacion TEXT NOT NULL DEFAULT (datetime('now')),
      Fecha_Actualizacion TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (ID_Usuario_Administrador) REFERENCES Usuarios(ID_Usuario)
    )`
  );

  await runSql(
    `CREATE TABLE IF NOT EXISTS Vehiculos (
      ID_Vehiculo INTEGER PRIMARY KEY AUTOINCREMENT,
      ID_Empresa_Propietaria INTEGER NOT NULL,
      Patente TEXT NOT NULL UNIQUE,
      Nombre_Chofer TEXT,
      Estado_Vehiculo TEXT NOT NULL DEFAULT 'Activo',
      FOREIGN KEY (ID_Empresa_Propietaria) REFERENCES Empresas(ID_Empresa)
    )`
  );

  await migrateLegacyUsersEmpresas();
  await migrateCatalogoResiduos();
  await ensureDefaultCategories();
  await migrateSolicitudesRetiro();
};

// ==========================================
// FUNCIONES UTILITARIAS PROMISIFICADAS
// ==========================================

export const dbRun = promisify(db.run.bind(db)) as (sql: string, params?: any[]) => Promise<void>;

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