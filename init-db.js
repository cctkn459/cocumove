import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crear base de datos
const db = new Database(join(__dirname, 'cocumove.db'));

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

// Crear tablas
const createTablesSQL = `
-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'passenger',
  profile_picture TEXT,
  language TEXT NOT NULL DEFAULT 'es',
  is_verified INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Passengers Table
CREATE TABLE IF NOT EXISTS passengers (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  cedula TEXT UNIQUE NOT NULL,
  cedula_front_url TEXT,
  cedula_back_url TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  rating REAL DEFAULT 5.0,
  total_rides INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Drivers Table
CREATE TABLE IF NOT EXISTS drivers (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  cedula TEXT UNIQUE NOT NULL,
  license_number TEXT UNIQUE NOT NULL,
  background_check_url TEXT,
  insurance_url TEXT,
  registration_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  rating REAL DEFAULT 5.0,
  total_rides INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  driver_id TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  license_plate TEXT UNIQUE NOT NULL,
  color TEXT,
  photo_url TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

-- Rides Table
CREATE TABLE IF NOT EXISTS rides (
  id TEXT PRIMARY KEY,
  passenger_id TEXT NOT NULL,
  driver_id TEXT,
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  fare REAL,
  distance REAL,
  duration INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (passenger_id) REFERENCES passengers(id),
  FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

-- Token Wallets Table
CREATE TABLE IF NOT EXISTS token_wallets (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  balance REAL NOT NULL DEFAULT 100,
  total_earned REAL DEFAULT 0,
  total_spent REAL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Token Transactions Table
CREATE TABLE IF NOT EXISTS token_transactions (
  id TEXT PRIMARY KEY,
  wallet_id TEXT NOT NULL,
  amount REAL NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (wallet_id) REFERENCES token_wallets(id)
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  ride_id TEXT NOT NULL,
  from_user_id TEXT NOT NULL,
  to_user_id TEXT NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (ride_id) REFERENCES rides(id),
  FOREIGN KEY (from_user_id) REFERENCES users(id),
  FOREIGN KEY (to_user_id) REFERENCES users(id)
);

-- Support Tickets Table
CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`;

// Ejecutar SQL
const statements = createTablesSQL.split(';').filter(s => s.trim());
for (const statement of statements) {
  if (statement.trim()) {
    db.exec(statement);
  }
}

console.log('✅ Base de datos inicializada correctamente');
db.close();
