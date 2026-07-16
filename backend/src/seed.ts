import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../recycling.db');

const db = new sqlite3.Database(dbPath);

const seedData = () => {
  db.serialize(() => {
    // Crear tablas primero
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )`,
      (err) => {
        if (err) console.error('Error creating users table:', err);
      }
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS waste_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        type TEXT NOT NULL,
        weight REAL NOT NULL,
        date TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id)
      )`,
      (err) => {
        if (err) console.error('Error creating waste_entries table:', err);
      }
    );

    // Agregar usuario de prueba (Administrador)
    db.run(
      'INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)',
      ['test@example.com', 'password123'],
      function (err) {
        if (err) {
          console.error('Error inserting test user:', err);
        } else {
          console.log('✅ Test user created successfully!');
          console.log('📧 Username: test@example.com');
          console.log('🔒 Password: password123');
        }
      }
    );

    // Agregar Empresa Generadora (PYME)
    db.run(
      `INSERT INTO users (username, password) VALUES (?, ?)`,
      ['pyme@elbosque.cl', 'password123'],
      (err) => {
        if (err) {
          console.error('Error al insertar PYME:', err.message);
        } else {
          console.log('✅ Empresa Generadora de prueba agregada (pyme@elbosque.cl)');
        }
      }
    );

    // Agregar Empresa Receptora (Reciclador)
    db.run(
      `INSERT INTO users (username, password) VALUES (?, ?)`,
      ['reciclador@elbosque.cl', 'password123'],
      (err) => {
        if (err) {
          console.error('Error al insertar Reciclador:', err.message);
        } else {
          console.log('✅ Empresa Receptora de prueba agregada (reciclador@elbosque.cl)');
        }
      }
    );

    // Agregar algunos datos de prueba
    setTimeout(() => {
      db.get('SELECT id FROM users WHERE username = ?', ['test@example.com'], (err, user: any) => {
        if (err || !user) return;

        const testWasteEntries = [
          [user.id, 'Plastic', 2.5],
          [user.id, 'Paper', 1.2],
          [user.id, 'Glass', 0.8],
          [user.id, 'Aluminum', 0.3],
        ];

        testWasteEntries.forEach((entry) => {
          db.run(
            'INSERT INTO waste_entries (userId, type, weight, date) VALUES (?, ?, ?, ?)',
            [...entry, new Date().toISOString()],
            (err) => {
              if (err) console.error('Error inserting waste entry:', err);
            }
          );
        });

        console.log('✅ Test data seeded successfully!');
        db.close();
      });
    }, 500);
  });
};

seedData();
