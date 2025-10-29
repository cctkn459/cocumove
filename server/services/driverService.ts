import { db } from '../db';
import { drivers, vehicles } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

export interface DriverRegistrationData {
  userId: string;
  cedulaNumber: string;
  cedulaFrontPhoto: string;
  cedulaBackPhoto: string;
  licenseNumber: string;
  licensePhoto: string;
  backgroundCheckCertificate: string;
  backgroundCheckDate?: Date;
}

export interface VehicleData {
  driverId: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  color: string;
  seats: number;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  insuranceExpiryDate: Date;
  insuranceDocument: string;
  registrationDocument: string;
  vehiclePhoto?: string;
}

export const registerDriver = async (data: DriverRegistrationData) => {
  try {
    const newDriver = await db
      .insert(drivers)
      .values({
        userId: data.userId,
        cedulaNumber: data.cedulaNumber,
        cedulaFrontPhoto: data.cedulaFrontPhoto,
        cedulaBackPhoto: data.cedulaBackPhoto,
        licenseNumber: data.licenseNumber,
        licensePhoto: data.licensePhoto,
        backgroundCheckCertificate: data.backgroundCheckCertificate,
        backgroundCheckDate: data.backgroundCheckDate,
      })
      .returning();

    return newDriver[0];
  } catch (error) {
    throw error;
  }
};

export const addVehicle = async (data: VehicleData) => {
  try {
    const newVehicle = await db
      .insert(vehicles)
      .values({
        driverId: data.driverId,
        licensePlate: data.licensePlate,
        make: data.make,
        model: data.model,
        year: data.year,
        color: data.color,
        seats: data.seats,
        insuranceProvider: data.insuranceProvider,
        insurancePolicyNumber: data.insurancePolicyNumber,
        insuranceExpiryDate: data.insuranceExpiryDate,
        insuranceDocument: data.insuranceDocument,
        registrationDocument: data.registrationDocument,
        vehiclePhoto: data.vehiclePhoto,
      })
      .returning();

    return newVehicle[0];
  } catch (error) {
    throw error;
  }
};

export const getPendingDrivers = async () => {
  try {
    const pendingDrivers = await db
      .select()
      .from(drivers)
      .where(eq(drivers.isApproved, false))
      .orderBy(desc(drivers.createdAt));

    return pendingDrivers;
  } catch (error) {
    throw error;
  }
};

export const approveDriver = async (driverId: string) => {
  try {
    const result = await db
      .update(drivers)
      .set({ 
        isApproved: true, 
        approvedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(drivers.id, driverId))
      .returning();

    return result[0];
  } catch (error) {
    throw error;
  }
};

export const rejectDriver = async (driverId: string) => {
  try {
    const result = await db
      .update(drivers)
      .set({ 
        isApproved: false,
        updatedAt: new Date() 
      })
      .where(eq(drivers.id, driverId))
      .returning();

    return result[0];
  } catch (error) {
    throw error;
  }
};

export const getDriverStats = async () => {
  try {
    const totalDrivers = await db
      .select({ count: drivers.id })
      .from(drivers);

    const approvedDrivers = await db
      .select({ count: drivers.id })
      .from(drivers)
      .where(eq(drivers.isApproved, true));

    const pendingDrivers = await db
      .select({ count: drivers.id })
      .from(drivers)
      .where(eq(drivers.isApproved, false));

    return {
      totalDrivers: totalDrivers.length,
      approvedDrivers: approvedDrivers.length,
      pendingDrivers: pendingDrivers.length,
    };
  } catch (error) {
    throw error;
  }
};

