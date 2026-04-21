import db from './connection.js';

export async function initDatabase(deleteMode = false) {
    if (deleteMode) {
        await db.exec('DROP TABLE IF EXISTS users');
    }
    
    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        role TEXT NOT NULL DEFAULT 'user'
    );
`);

    console.log('Database initialized');
}