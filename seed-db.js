import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'cocumove.db'));
db.pragma('foreign_keys = ON');

const now = Math.floor(Date.now() / 1000);

// Crear usuarios
const adminId = randomUUID();
const passengerId = randomUUID();
const driverId = randomUUID();

const adminPassword = bcrypt.hashSync('Admin123!', 10);
const passengerPassword = bcrypt.hashSync('Pass123!', 10);
const driverPassword = bcrypt.hashSync('Driver123!', 10);

// Insertar admin
db.prepare(`
  INSERT INTO users (id, email, phone, password, first_name, last_name, role, language, is_verified, is_active, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(adminId, 'admin@cocumove.com', '+1111111111', adminPassword, 'Admin', 'COCUMOVE', 'admin', 'es', 1, 1, now, now);

// Insertar pasajero
db.prepare(`
  INSERT INTO users (id, email, phone, password, first_name, last_name, role, language, is_verified, is_active, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(passengerId, 'passenger@cocumove.com', '+2222222222', passengerPassword, 'Juan', 'Pasajero', 'passenger', 'es', 1, 1, now, now);

// Insertar conductor
db.prepare(`
  INSERT INTO users (id, email, phone, password, first_name, last_name, role, language, is_verified, is_active, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(driverId, 'driver@cocumove.com', '+3333333333', driverPassword, 'Carlos', 'Conductor', 'driver', 'es', 1, 1, now, now);

// Crear billeteras de tokens
const adminWalletId = randomUUID();
const passengerWalletId = randomUUID();
const driverWalletId = randomUUID();

db.prepare(`
  INSERT INTO token_wallets (id, user_id, balance, total_earned, total_spent, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(adminWalletId, adminId, 500, 0, 0, now, now);

db.prepare(`
  INSERT INTO token_wallets (id, user_id, balance, total_earned, total_spent, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(passengerWalletId, passengerId, 100, 50, 10, now, now);

db.prepare(`
  INSERT INTO token_wallets (id, user_id, balance, total_earned, total_spent, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(driverWalletId, driverId, 150, 100, 0, now, now);

// Crear perfil de pasajero
const passengerProfileId = randomUUID();
db.prepare(`
  INSERT INTO passengers (id, user_id, cedula, emergency_contact, emergency_phone, rating, total_rides, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(passengerProfileId, passengerId, '123456789', 'María Pasajero', '+5555555555', 4.8, 12, now, now);

// Crear perfil de conductor
const driverProfileId = randomUUID();
db.prepare(`
  INSERT INTO drivers (id, user_id, cedula, license_number, status, rating, total_rides, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(driverProfileId, driverId, '987654321', 'DL123456789', 'approved', 4.9, 45, now, now);

// Crear vehículo
const vehicleId = randomUUID();
db.prepare(`
  INSERT INTO vehicles (id, driver_id, make, model, year, license_plate, color, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(vehicleId, driverProfileId, 'Toyota', 'Corolla', 2022, 'ABC-123', 'Blanco', now, now);

// Crear viajes de ejemplo
const ride1Id = randomUUID();
db.prepare(`
  INSERT INTO rides (id, passenger_id, driver_id, pickup_location, dropoff_location, status, fare, distance, duration, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(ride1Id, passengerProfileId, driverProfileId, 'Calle Principal 123', 'Avenida Central 456', 'completed', 15.50, 5.2, 12, now - 3600, now - 3600);

const ride2Id = randomUUID();
db.prepare(`
  INSERT INTO rides (id, passenger_id, driver_id, pickup_location, dropoff_location, status, fare, distance, duration, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(ride2Id, passengerProfileId, driverProfileId, 'Centro Comercial', 'Estación de Tren', 'completed', 22.75, 8.5, 18, now - 7200, now - 7200);

// Crear transacciones de tokens
const txn1Id = randomUUID();
db.prepare(`
  INSERT INTO token_transactions (id, wallet_id, amount, type, description, created_at)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(txn1Id, passengerWalletId, 5, 'ride_completion', 'Viaje completado', now - 3600);

const txn2Id = randomUUID();
db.prepare(`
  INSERT INTO token_transactions (id, wallet_id, amount, type, description, created_at)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(txn2Id, driverWalletId, 5, 'ride_completion', 'Viaje completado', now - 3600);

console.log('✅ Base de datos poblada con datos de prueba');
console.log('');
console.log('👤 Cuentas de prueba:');
console.log('  Admin: admin@cocumove.com / Admin123!');
console.log('  Pasajero: passenger@cocumove.com / Pass123!');
console.log('  Conductor: driver@cocumove.com / Driver123!');
console.log('');
console.log('💰 Tokens COCU:');
console.log('  Admin: 500 COCU');
console.log('  Pasajero: 100 COCU');
console.log('  Conductor: 150 COCU');

db.close();
