import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env', import.meta.url) });

let pool;
export function getDb() {
  if (!pool) pool = mysql.createPool({ host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER, password: process.env.DB_PASS || process.env.DB_PASSWORD, database: process.env.DB_NAME, connectionLimit: 10 });
  return pool;
}
export async function query(sql, params = []) { return getDb().execute(sql, params); }
