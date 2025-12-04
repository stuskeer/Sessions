import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create database file in the project root
const dbPath = join(__dirname, '..', 'kitesessions.db');
const db = new Database(dbPath);

// Enable foreign keys and WAL mode for better performance
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    location TEXT NOT NULL,
    date TEXT NOT NULL,
    kite TEXT NOT NULL,
    board TEXT NOT NULL,
    session_type TEXT NOT NULL,
    duration TEXT,
    max_jump REAL,
    wind_direction TEXT,
    wind_speed INTEGER,
    max_speed REAL,
    max_jump_distance REAL,
    max_airtime REAL
  );

  CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  );
`);

// Initialize default settings if they don't exist
const initSettings = db.prepare('INSERT OR IGNORE INTO settings (id, data) VALUES (?, ?)');
initSettings.run('global-quiver', JSON.stringify([]));
initSettings.run('global-locations', JSON.stringify([]));
initSettings.run('global-boards', JSON.stringify([]));
initSettings.run('wind-speed-unit', JSON.stringify('kts'));
initSettings.run('max-speed-unit', JSON.stringify('mph'));

export default db;