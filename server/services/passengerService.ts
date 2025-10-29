import { db } from '../db';
import { passengers, tokenWallets } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface PassengerRegistrationData {
  userId: string;
  cedulaNumber: string;
  cedulaFrontPhoto: string;
  cedulaBackPhoto: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export const registerPassenger = async (data: PassengerRegistrationData) => {
  try {
    // Crear registro de pasajero
    const newPassenger = await db
      .insert(passengers)
      .values({
        userId: data.userId,
        cedulaNumber: data.cedulaNumber,
        cedulaFrontPhoto: data.cedulaFrontPhoto,
        cedulaBackPhoto: data.cedulaBackPhoto,
        emergencyContact: data.emergencyContact,
        emergencyPhone: data.emergencyPhone,
      })
      .returning();

    // Crear billetera de tokens con saldo inicial
    const initialBalance = process.env.COCU_TOKEN_INITIAL_BALANCE || '100';
    await db
      .insert(tokenWallets)
      .values({
        userId: data.userId,
        balance: initialBalance as any,
        totalEarned: initialBalance as any,
      });

    return newPassenger[0];
  } catch (error) {
    throw error;
  }
};

export const getPassengerById = async (passengerId: string) => {
  try {
    const passenger = await db
      .select()
      .from(passengers)
      .where(eq(passengers.id, passengerId))
      .limit(1);

    return passenger[0];
  } catch (error) {
    throw error;
  }
};

export const getPassengerByUserId = async (userId: string) => {
  try {
    const passenger = await db
      .select()
      .from(passengers)
      .where(eq(passengers.userId, userId))
      .limit(1);

    return passenger[0];
  } catch (error) {
    throw error;
  }
};

export const updatePassengerProfile = async (passengerId: string, data: Partial<PassengerRegistrationData>) => {
  try {
    const updateData: any = { updatedAt: new Date() };
    
    if (data.emergencyContact) updateData.emergencyContact = data.emergencyContact;
    if (data.emergencyPhone) updateData.emergencyPhone = data.emergencyPhone;

    const result = await db
      .update(passengers)
      .set(updateData)
      .where(eq(passengers.id, passengerId))
      .returning();

    return result[0];
  } catch (error) {
    throw error;
  }
};

export const updatePassengerRating = async (passengerId: string, newRating: number) => {
  try {
    const result = await db
      .update(passengers)
      .set({ rating: String(newRating) as any, updatedAt: new Date() })
      .where(eq(passengers.id, passengerId))
      .returning();

    return result[0];
  } catch (error) {
    throw error;
  }
};

export const incrementPassengerRides = async (passengerId: string) => {
  try {
    const passenger = await getPassengerById(passengerId);
    if (!passenger) throw new Error('Passenger not found');

    const result = await db
      .update(passengers)
      .set({ 
        totalRides: (passenger.totalRides || 0) + 1,
        updatedAt: new Date() 
      })
      .where(eq(passengers.id, passengerId))
      .returning();

    return result[0];
  } catch (error) {
    throw error;
  }
};

