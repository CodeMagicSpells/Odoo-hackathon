
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();


const { Pool } = pkg;
export const pool = new Pool({
host: process.env.PGHOST,
port: process.env.PGPORT,
database: process.env.PGDATABASE,
user: process.env.PGUSER,
password: process.env.PGPASSWORD
});


export async function query(text, params) {
const start = Date.now();
const res = await pool.query(text, params);
const duration = Date.now() - start;
if (process.env.NODE_ENV !== 'production') {
console.log('executed query', { text, duration, rows: res.rowCount });
}
return res;
}
