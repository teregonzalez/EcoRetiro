import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../../../recycling.db');

const db = new sqlite3.Database(dbPath);

export interface User {
  id: number;
  username: string;
  password: string;
}

export interface WasteEntry {
  id: number;
  userId: number;
  type: string;
  weight: number;
  date: string;
}

export const initializeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        )`,
        (err) => {
          if (err) reject(err);
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
          if (err) reject(err);
          else resolve();
        }
      );
    });
  });
};

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
