import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../recycling.db');

const db = new sqlite3.Database(dbPath);

// Test 1: Verificar que el usuario existe
console.log('=== TEST 1: Verificar usuario ===');
db.get('SELECT * FROM users WHERE username = ?', ['test@example.com'], (err, row) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Usuario encontrado:', row);
  }
});

// Test 2: Verificar el password
setTimeout(() => {
  console.log('\n=== TEST 2: Verificar password ===');
  db.get('SELECT * FROM users WHERE password = ?', ['password123'], (err, row) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Contraseña encontrada:', row);
    }
  });
}, 100);

// Test 3: Verificar ambos
setTimeout(() => {
  console.log('\n=== TEST 3: Verificar username Y password ===');
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', ['test@example.com', 'password123'], (err, row) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Usuario y password encontrados:', row);
    }
    db.close();
  });
}, 200);
