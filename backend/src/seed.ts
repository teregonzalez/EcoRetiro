// C:\Users\Gamer\Documents\Reciclaje\backend\src\seed.ts
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../recycling.db');

const db = new sqlite3.Database(dbPath);

// Función utilitaria para usar async/await con SQLite en este script
const runQuery = (query: string, params: any[] = []): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
};

const getQuery = (query: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const allQuery = (query: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

const seedData = async () => {
  try {
    console.log('🌱 Iniciando carga de datos de prueba (Seed)...');

    // 1. Activar Foreign Keys
    await runQuery('PRAGMA foreign_keys = ON;');

    // 2. Generar el hash para la contraseña por defecto ("password123")
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('password123', saltRounds);

    // 3. Crear usuarios y empresas de prueba
    const usuariosPrueba = [
      {
        correo: 'test@example.com',
        contacto: 'Admin Principal',
        rol: 1, // Administrador
        estado: 'Aprobada',
      },
      {
        rut: '77777777-7',
        razon: 'Panadería El Bosque',
        correo: 'pyme@elbosque.cl',
        contacto: 'Juan Pérez',
        rol: 2, // PYME
        estado: 'Aprobada',
        direccion: 'El Bosque, Santiago',
      },
      {
        rut: '99999999-9',
        razon: 'Reciclaje Sustentable SPA',
        correo: 'reciclador@elbosque.cl',
        contacto: 'María González',
        rol: 3, // Reciclador
        estado: 'Aprobada',
        direccion: 'El Bosque, Santiago',
      }
    ];

    for (const u of usuariosPrueba) {
      try {
        await runQuery(
          `INSERT INTO Usuarios
          (ID_Rol, Correo, Contrasena, Nombre_Contacto, Estado_Cuenta)
          VALUES (?, ?, ?, ?, ?)`,
          [u.rol, u.correo, hashedPassword, u.contacto, u.estado]
        );
        console.log(`✅ Usuario creado: ${u.correo} (Rol ID: ${u.rol})`);
      } catch (err: any) {
        if (err.message.includes('UNIQUE constraint failed')) {
          console.log(`⚠️ El usuario ${u.correo} ya existe. Omitiendo creación.`);
        } else {
          throw err;
        }
      }

      const usuario = await getQuery('SELECT ID_Usuario FROM Usuarios WHERE Correo = ?', [u.correo]);
      if (usuario?.ID_Usuario && u.rol !== 1 && u.rut && u.razon) {
        try {
          await runQuery(
            `INSERT INTO Empresas
            (ID_Usuario, RUT_Empresa, Razon_Social, Direccion_Geolocalizacion)
            VALUES (?, ?, ?, ?)` ,
            [usuario.ID_Usuario, u.rut, u.razon, u.direccion || null]
          );
          console.log(`✅ Empresa creada: ${u.razon}`);
        } catch (err: any) {
          if (err.message.includes('UNIQUE constraint failed')) {
            console.log(`⚠️ La empresa de ${u.correo} ya existe. Omitiendo creación.`);
          } else {
            throw err;
          }
        }
      }
    }

    console.log('\nCredenciales de acceso para pruebas:');
    console.log('🔒 Contraseña general: password123\n');

    // 4. Cargar catálogo base de residuos (asignado al administrador)
    const admin = await getQuery('SELECT ID_Usuario FROM Usuarios WHERE Correo = ?', ['test@example.com']);
    if (admin?.ID_Usuario) {
      await runQuery(
        `INSERT INTO Catalogo_Residuos
          (ID_Categoria, ID_Usuario_Administrador, Nombre_Residuo, Unidad_Medida, Estado_Categoria)
         VALUES
          (1, ?, 'Cartón corrugado', 'kg', 'Activa'),
          (2, ?, 'Plástico PET', 'kg', 'Activa'),
          (3, ?, 'Aceite vegetal usado', 'litros', 'Activa'),
          (4, ?, 'Borra de café', 'kg', 'Activa'),
          (5, ?, 'Metal', 'kg', 'Activa')
         ON CONFLICT(ID_Categoria) DO UPDATE SET
          ID_Usuario_Administrador = excluded.ID_Usuario_Administrador,
          Nombre_Residuo = excluded.Nombre_Residuo,
          Unidad_Medida = excluded.Unidad_Medida,
          Estado_Categoria = excluded.Estado_Categoria,
          Fecha_Actualizacion = datetime('now')`,
        [admin.ID_Usuario, admin.ID_Usuario, admin.ID_Usuario, admin.ID_Usuario, admin.ID_Usuario]
      );
    }

    // 5. Agregar Solicitudes de Retiro de prueba para la empresa generadora
    const pyme = await getQuery(
      `SELECT e.ID_Empresa
       FROM Empresas e
       JOIN Usuarios u ON u.ID_Usuario = e.ID_Usuario
       WHERE u.Correo = ?`,
      ['pyme@elbosque.cl']
    );

    const reciclador = await getQuery(
      `SELECT e.ID_Empresa
       FROM Empresas e
       JOIN Usuarios u ON u.ID_Usuario = e.ID_Usuario
       WHERE u.Correo = ?`,
      ['reciclador@elbosque.cl']
    );
    
    if (pyme && reciclador) {
      try {
        await runQuery(
          `INSERT INTO Vehiculos
          (ID_Empresa_Propietaria, Patente, Nombre_Chofer, Estado_Vehiculo)
          VALUES (?, 'KJPL-78', 'Diego Mena', 'Activo')`,
          [reciclador.ID_Empresa]
        );
      } catch (err: any) {
        if (!err.message.includes('UNIQUE constraint failed')) {
          throw err;
        }
      }

      const vehiculo = await getQuery('SELECT ID_Vehiculo FROM Vehiculos WHERE Patente = ?', ['KJPL-78']);

      // Verificamos si ya tiene solicitudes para no duplicar en cada ejecución
      const conteoSolicitudes = await getQuery(
        'SELECT COUNT(*) as count FROM Solicitudes_Retiro WHERE ID_Empresa_Generadora = ?',
        [pyme.ID_Empresa]
      );
      
      if (conteoSolicitudes.count < 6) {
        await runQuery('DELETE FROM Solicitudes_Retiro WHERE ID_Empresa_Generadora = ?', [pyme.ID_Empresa]);

        const today = new Date();
        const toISO = (daysAgo: number) => {
          const date = new Date(today);
          date.setDate(today.getDate() - daysAgo);
          return date.toISOString();
        };

        const seededRequests = [
          {
            idCategoria: 1,
            volumen: 25.5,
            estado: 'Disponible',
            fechaPublicacion: toISO(0),
            idReciclador: null,
            fechaRecoleccion: null,
            fechaProcesamiento: null,
            certificado: null,
          },
          {
            idCategoria: 2,
            volumen: 10.0,
            estado: 'Disponible',
            fechaPublicacion: toISO(1),
            idReciclador: null,
            fechaRecoleccion: null,
            fechaProcesamiento: null,
            certificado: null,
          },
          {
            idCategoria: 3,
            volumen: 5.0,
            estado: 'En camino',
            fechaPublicacion: toISO(2),
            idReciclador: reciclador.ID_Empresa,
            idVehiculo: vehiculo?.ID_Vehiculo || null,
            fechaRecoleccion: toISO(1),
            fechaProcesamiento: null,
            certificado: null,
          },
          {
            idCategoria: 4,
            volumen: 3.2,
            estado: 'Gestionado',
            fechaPublicacion: toISO(4),
            idReciclador: reciclador.ID_Empresa,
            idVehiculo: vehiculo?.ID_Vehiculo || null,
            fechaRecoleccion: toISO(3),
            fechaProcesamiento: toISO(0),
            certificado: 'https://ecocircular.local/certificados/sol-1.pdf',
          },
          {
            idCategoria: 2,
            volumen: 12.7,
            estado: 'Gestionado',
            fechaPublicacion: toISO(6),
            idReciclador: reciclador.ID_Empresa,
            idVehiculo: vehiculo?.ID_Vehiculo || null,
            fechaRecoleccion: toISO(5),
            fechaProcesamiento: toISO(1),
            certificado: 'https://ecocircular.local/certificados/sol-2.pdf',
          },
          {
            idCategoria: 1,
            volumen: 8.1,
            estado: 'En camino',
            fechaPublicacion: toISO(3),
            idReciclador: reciclador.ID_Empresa,
            idVehiculo: vehiculo?.ID_Vehiculo || null,
            fechaRecoleccion: toISO(2),
            fechaProcesamiento: null,
            certificado: null,
          },
        ];

        for (const request of seededRequests) {
          await runQuery(
            `INSERT INTO Solicitudes_Retiro (
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
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
            [
              pyme.ID_Empresa,
              request.idReciclador,
              request.idVehiculo || null,
              request.idCategoria,
              request.volumen,
              request.estado,
              request.fechaPublicacion,
              request.fechaRecoleccion,
              request.fechaProcesamiento,
              request.certificado,
            ]
          );
        }

        const resumenEstado = await allQuery(
          `SELECT Estado_Tracking as estado, COUNT(*) as total
           FROM Solicitudes_Retiro
           WHERE ID_Empresa_Generadora = ?
           GROUP BY Estado_Tracking`,
          [pyme.ID_Empresa]
        );

        console.log('✅ Solicitudes de retiro de prueba regeneradas exitosamente para la PYME.');
        console.log('📊 Resumen por estado:', resumenEstado);
      } else {
        console.log('⚠️ La PYME ya tiene solicitudes de retiro. Omitiendo generación de residuos.');
      }
    }

    console.log('🏁 Proceso de Seed finalizado con éxito.');

  } catch (error) {
    console.error('❌ Error durante la ejecución del Seed:', error);
  } finally {
    db.close();
  }
};

seedData();