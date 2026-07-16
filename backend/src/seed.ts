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

    // 3. Crear Usuarios de Prueba (Si no existen, gracias al UNIQUE en Correo)
    const usuariosPrueba = [
      {
        rut: '11111111-1',
        razon: 'Administración ECORETIRO',
        correo: 'test@example.com',
        contacto: 'Admin Principal',
        rol: 1, // Administrador
        estado: 'Aprobada'
      },
      {
        rut: '77777777-7',
        razon: 'Panadería El Bosque',
        correo: 'pyme@elbosque.cl',
        contacto: 'Juan Pérez',
        rol: 2, // PYME
        estado: 'Aprobada'
      },
      {
        rut: '99999999-9',
        razon: 'Reciclaje Sustentable SPA',
        correo: 'reciclador@elbosque.cl',
        contacto: 'María González',
        rol: 3, // Reciclador
        estado: 'Aprobada'
      }
    ];

    for (const u of usuariosPrueba) {
      try {
        await runQuery(
          `INSERT INTO Usuarios_Empresas 
          (RUT_Empresa, Razon_Social, Correo, Contrasena, Nombre_Contacto, ID_Rol, Estado_Cuenta) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [u.rut, u.razon, u.correo, hashedPassword, u.contacto, u.rol, u.estado]
        );
        console.log(`✅ Usuario creado: ${u.correo} (Rol ID: ${u.rol})`);
      } catch (err: any) {
        if (err.message.includes('UNIQUE constraint failed')) {
          console.log(`⚠️ El usuario ${u.correo} ya existe. Omitiendo creación.`);
        } else {
          throw err;
        }
      }
    }

    console.log('\nCredenciales de acceso para pruebas:');
    console.log('🔒 Contraseña general: password123\n');

    // 4. Agregar Solicitudes de Retiro de prueba para la PYME
    // Obtenemos el ID de la PYME recién creada
    const pyme = await getQuery('SELECT ID_Usuario FROM Usuarios_Empresas WHERE Correo = ?', ['pyme@elbosque.cl']);
    const reciclador = await getQuery('SELECT ID_Usuario FROM Usuarios_Empresas WHERE Correo = ?', ['reciclador@elbosque.cl']);
    
    if (pyme && reciclador) {
      // Verificamos si ya tiene solicitudes para no duplicar en cada ejecución
      const conteoSolicitudes = await getQuery('SELECT COUNT(*) as count FROM Solicitudes_Retiro WHERE ID_PYME = ?', [pyme.ID_Usuario]);
      
      if (conteoSolicitudes.count < 6) {
        await runQuery('DELETE FROM Solicitudes_Retiro WHERE ID_PYME = ?', [pyme.ID_Usuario]);

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
            idReciclador: reciclador.ID_Usuario,
            fechaRecoleccion: toISO(1),
            fechaProcesamiento: null,
            certificado: null,
          },
          {
            idCategoria: 4,
            volumen: 3.2,
            estado: 'Gestionado',
            fechaPublicacion: toISO(4),
            idReciclador: reciclador.ID_Usuario,
            fechaRecoleccion: toISO(3),
            fechaProcesamiento: toISO(0),
            certificado: 'https://ecocircular.local/certificados/sol-1.pdf',
          },
          {
            idCategoria: 2,
            volumen: 12.7,
            estado: 'Gestionado',
            fechaPublicacion: toISO(6),
            idReciclador: reciclador.ID_Usuario,
            fechaRecoleccion: toISO(5),
            fechaProcesamiento: toISO(1),
            certificado: 'https://ecocircular.local/certificados/sol-2.pdf',
          },
          {
            idCategoria: 1,
            volumen: 8.1,
            estado: 'En camino',
            fechaPublicacion: toISO(3),
            idReciclador: reciclador.ID_Usuario,
            fechaRecoleccion: toISO(2),
            fechaProcesamiento: null,
            certificado: null,
          },
        ];

        for (const request of seededRequests) {
          await runQuery(
            `INSERT INTO Solicitudes_Retiro (
              ID_PYME,
              ID_Reciclador,
              ID_Categoria,
              Volumen_Cantidad,
              Estado_Tracking,
              Fecha_Publicacion,
              Fecha_Recoleccion,
              Fecha_Procesamiento,
              URL_Certificado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              pyme.ID_Usuario,
              request.idReciclador,
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
           WHERE ID_PYME = ?
           GROUP BY Estado_Tracking`,
          [pyme.ID_Usuario]
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