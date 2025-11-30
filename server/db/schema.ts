import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'passenger', 'driver']);
export const documentTypeEnum = pgEnum('document_type', ['cedula', 'passport', 'license']);
export const rideStatusEnum = pgEnum('ride_status', ['pending', 'accepted', 'in_progress', 'completed', 'cancelled']);
export const languageEnum = pgEnum('language', ['es', 'en', 'pt', 'fr']);

// Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  phone: varchar('phone', { length: 20 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  role: userRoleEnum('role').notNull().default('passenger'),
  profilePicture: text('profile_picture'),
  language: languageEnum('language').notNull().default('es'),
  isVerified: boolean('is_verified').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Passengers Table
export const passengers = pgTable('passengers', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  cedulaNumber: varchar('cedula_number', { length: 50 }).unique().notNull(),
  cedulaFrontPhoto: text('cedula_front_photo').notNull(),
  cedulaBackPhoto: text('cedula_back_photo').notNull(),
  emergencyContact: varchar('emergency_contact', { length: 255 }),
  emergencyPhone: varchar('emergency_phone', { length: 20 }),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('5.00'),
  totalRides: integer('total_rides').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Drivers Table
export const drivers = pgTable('drivers', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  cedulaNumber: varchar('cedula_number', { length: 50 }).unique().notNull(),
  cedulaFrontPhoto: text('cedula_front_photo').notNull(),
  cedulaBackPhoto: text('cedula_back_photo').notNull(),
  licenseNumber: varchar('license_number', { length: 50 }).unique().notNull(),
  licensePhoto: text('license_photo').notNull(),
  backgroundCheckCertificate: text('background_check_certificate').notNull(),
  backgroundCheckDate: timestamp('background_check_date'),
  bankAccountNumber: varchar('bank_account_number', { length: 50 }),
  bankName: varchar('bank_name', { length: 100 }),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('5.00'),
  totalRides: integer('total_rides').default(0),
  isApproved: boolean('is_approved').notNull().default(false),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Vehicles Table
export const vehicles = pgTable('vehicles', {
  id: uuid('id').primaryKey().defaultRandom(),
  driverId: uuid('driver_id').notNull().references(() => drivers.id, { onDelete: 'cascade' }),
  licensePlate: varchar('license_plate', { length: 20 }).unique().notNull(),
  make: varchar('make', { length: 100 }).notNull(),
  model: varchar('model', { length: 100 }).notNull(),
  year: integer('year').notNull(),
  color: varchar('color', { length: 50 }).notNull(),
  seats: integer('seats').notNull().default(4),
  insuranceProvider: varchar('insurance_provider', { length: 100 }).notNull(),
  insurancePolicyNumber: varchar('insurance_policy_number', { length: 50 }).notNull(),
  insuranceExpiryDate: timestamp('insurance_expiry_date').notNull(),
  insuranceDocument: text('insurance_document').notNull(),
  registrationDocument: text('registration_document').notNull(),
  vehiclePhoto: text('vehicle_photo'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// COCU Token Wallet
export const tokenWallets = pgTable('token_wallets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  balance: decimal('balance', { precision: 18, scale: 2 }).notNull().default('0'),
  totalEarned: decimal('total_earned', { precision: 18, scale: 2 }).notNull().default('0'),
  totalSpent: decimal('total_spent', { precision: 18, scale: 2 }).notNull().default('0'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Token Transactions
export const tokenTransactions = pgTable('token_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  fromUserId: uuid('from_user_id').references(() => users.id, { onDelete: 'set null' }),
  toUserId: uuid('to_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: decimal('amount', { precision: 18, scale: 2 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'ride_completion', 'referral', 'bonus', 'withdrawal'
  description: text('description'),
  rideId: uuid('ride_id').references(() => rides.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Rides Table
export const rides = pgTable('rides', {
  id: uuid('id').primaryKey().defaultRandom(),
  passengerId: uuid('passenger_id').notNull().references(() => passengers.id, { onDelete: 'cascade' }),
  driverId: uuid('driver_id').references(() => drivers.id, { onDelete: 'set null' }),
  vehicleId: uuid('vehicle_id').references(() => vehicles.id, { onDelete: 'set null' }),
  pickupLocation: varchar('pickup_location', { length: 255 }).notNull(),
  pickupLatitude: decimal('pickup_latitude', { precision: 10, scale: 8 }),
  pickupLongitude: decimal('pickup_longitude', { precision: 11, scale: 8 }),
  dropoffLocation: varchar('dropoff_location', { length: 255 }).notNull(),
  dropoffLatitude: decimal('dropoff_latitude', { precision: 10, scale: 8 }),
  dropoffLongitude: decimal('dropoff_longitude', { precision: 11, scale: 8 }),
  status: rideStatusEnum('status').notNull().default('pending'),
  fare: decimal('fare', { precision: 10, scale: 2 }),
  distance: decimal('distance', { precision: 10, scale: 2 }),
  duration: integer('duration'), // in minutes
  paymentMethod: varchar('payment_method', { length: 50 }), // 'cash', 'card', 'tokens'
  tokensUsed: decimal('tokens_used', { precision: 18, scale: 2 }).default('0'),
  passengerRating: integer('passenger_rating'),
  passengerReview: text('passenger_review'),
  driverRating: integer('driver_rating'),
  driverReview: text('driver_review'),
  scheduledAt: timestamp('scheduled_at'),
  acceptedAt: timestamp('accepted_at'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  cancelledAt: timestamp('cancelled_at'),
  cancellationReason: text('cancellation_reason'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Reviews Table
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  rideId: uuid('ride_id').notNull().unique().references(() => rides.id, { onDelete: 'cascade' }),
  fromUserId: uuid('from_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  toUserId: uuid('to_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Support Tickets
export const supportTickets = pgTable('support_tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rideId: uuid('ride_id').references(() => rides.id, { onDelete: 'set null' }),
  subject: varchar('subject', { length: 255 }).notNull(),
  description: text('description').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('open'), // 'open', 'in_progress', 'resolved', 'closed'
  priority: varchar('priority', { length: 50 }).notNull().default('normal'), // 'low', 'normal', 'high'
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  passenger: one(passengers, {
    fields: [users.id],
    references: [passengers.userId],
  }),
  driver: one(drivers, {
    fields: [users.id],
    references: [drivers.userId],
  }),
  tokenWallet: one(tokenWallets, {
    fields: [users.id],
    references: [tokenWallets.userId],
  }),
  ridesSent: many(tokenTransactions, {
    relationName: 'from',
  }),
  ridesReceived: many(tokenTransactions, {
    relationName: 'to',
  }),
  reviews: many(reviews),
  supportTickets: many(supportTickets),
}));

export const passengersRelations = relations(passengers, ({ one, many }) => ({
  user: one(users, {
    fields: [passengers.userId],
    references: [users.id],
  }),
  rides: many(rides),
}));

export const driversRelations = relations(drivers, ({ one, many }) => ({
  user: one(users, {
    fields: [drivers.userId],
    references: [users.id],
  }),
  vehicles: many(vehicles),
  rides: many(rides),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  driver: one(drivers, {
    fields: [vehicles.driverId],
    references: [drivers.id],
  }),
  rides: many(rides),
}));

export const ridesRelations = relations(rides, ({ one }) => ({
  passenger: one(passengers, {
    fields: [rides.passengerId],
    references: [rides.id],
  }),
  driver: one(drivers, {
    fields: [rides.driverId],
    references: [drivers.id],
  }),
  vehicle: one(vehicles, {
    fields: [rides.vehicleId],
    references: [vehicles.id],
  }),
  review: one(reviews, {
    fields: [rides.id],
    references: [reviews.rideId],
  }),
}));

