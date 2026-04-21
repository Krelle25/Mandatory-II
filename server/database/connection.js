import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';

const dbPath = fileURLToPath(new URL('./mandatoryii.db', import.meta.url));

const connection = await open({
    filename: dbPath,
    driver: sqlite3.Database
});

export default connection;