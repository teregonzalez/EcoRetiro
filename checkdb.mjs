import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, './recycling.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('=== USUARIOS EN LA BASE DE DATOS ===');
      console.log(rows);
    }
    
    db.all('SELECT * FROM waste_entries', (err, rows) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log('\n=== ENTRADAS DE RESIDUOS ===');
        console.log(rows);
      }
      db.close();
    });
  });
});
