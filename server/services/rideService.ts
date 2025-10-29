import { db } from '../db';
import { rides, reviews } from '../db/schema';
import { eq, desc, and } from 'drizzle-orm';

export interface CreateRideData {
  passengerId: string;
  pickupLocation: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  dropoffLocation: string;
  dropoffLatitude?: number;
  dropoffLongitude?: number;
  scheduledAt?: Date;
}

export interface UpdateRideData {
  status?: string;
  driverId?: string;
  vehicleId?: string;
  fare?: number;
  distance?: number;
  duration?: number;
  paymentMethod?: string;
  tokensUsed?: number;
}

export const createRide = async (data: CreateRideData) => {
  try {
    const newRide = await db
      .insert(rides)
      .values({
        passengerId: data.passengerId,
        pickupLocation: data.pickupLocation,
        pickupLatitude: data.pickupLatitude ? String(data.pickupLatitude) as any : undefined,
        pickupLongitude: data.pickupLongitude ? String(data.pickupLongitude) as any : undefined,
        dropoffLocation: data.dropoffLocation,
        dropoffLatitude: data.dropoffLatitude ? String(data.dropoffLatitude) as any : undefined,
        dropoffLongitude: data.dropoffLongitude ? String(data.dropoffLongitude) as any : undefined,
        status: 'pending' as any,
        scheduledAt: data.scheduledAt,
      })
      .returning();

    return newRide[0];
  } catch (error) {
    throw error;
  }
};

export const updateRide = async (rideId: string, data: UpdateRideData) => {
  try {
    const updateData: any = { updatedAt: new Date() };
    
    if (data.status) updateData.status = data.status;
    if (data.driverId) updateData.driverId = data.driverId;
    if (data.vehicleId) updateData.vehicleId = data.vehicleId;
    if (data.fare) updateData.fare = data.fare;
    if (data.distance) updateData.distance = data.distance;
    if (data.duration) updateData.duration = data.duration;
    if (data.paymentMethod) updateData.paymentMethod = data.paymentMethod;
    if (data.tokensUsed) updateData.tokensUsed = data.tokensUsed;

    const result = await db
      .update(rides)
      .set(updateData)
      .where(eq(rides.id, rideId))
      .returning();

    return result[0];
  } catch (error) {
    throw error;
  }
};

export const getRideById = async (rideId: string) => {
  try {
    const ride = await db
      .select()
      .from(rides)
      .where(eq(rides.id, rideId))
      .limit(1);

    return ride[0];
  } catch (error) {
    throw error;
  }
};

export const getPassengerRides = async (passengerId: string) => {
  try {
    const passengerRides = await db
      .select()
      .from(rides)
      .where(eq(rides.passengerId, passengerId))
      .orderBy(desc(rides.createdAt));

    return passengerRides;
  } catch (error) {
    throw error;
  }
};

export const getDriverRides = async (driverId: string) => {
  try {
    const driverRides = await db
      .select()
      .from(rides)
      .where(eq(rides.driverId, driverId))
      .orderBy(desc(rides.createdAt));

    return driverRides;
  } catch (error) {
    throw error;
  }
};

export const getActiveRides = async () => {
  try {
    const activeRides = await db
      .select()
      .from(rides)
      .where(
        and(
          eq(rides.status, 'pending' as any),
          eq(rides.status, 'accepted' as any),
          eq(rides.status, 'in_progress' as any)
        )
      )
      .orderBy(desc(rides.createdAt));

    return activeRides;
  } catch (error) {
    throw error;
  }
};

export const getRideStats = async () => {
  try {
    const totalRides = await db
      .select({ count: rides.id })
      .from(rides);

    const completedRides = await db
      .select({ count: rides.id })
      .from(rides)
      .where(eq(rides.status, 'completed' as any));

    const cancelledRides = await db
      .select({ count: rides.id })
      .from(rides)
      .where(eq(rides.status, 'cancelled' as any));

    return {
      totalRides: totalRides.length,
      completedRides: completedRides.length,
      cancelledRides: cancelledRides.length,
    };
  } catch (error) {
    throw error;
  }
};

export const addReview = async (
  rideId: string,
  fromUserId: string,
  toUserId: string,
  rating: number,
  comment?: string
) => {
  try {
    const newReview = await db
      .insert(reviews)
      .values({
        rideId,
        fromUserId,
        toUserId,
        rating,
        comment,
      })
      .returning();

    return newReview[0];
  } catch (error) {
    throw error;
  }
};

