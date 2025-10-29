import { db } from '../db';
import { users, passengers, drivers } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

export const getAllUsers = async () => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        phone: users.phone,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        isVerified: users.isVerified,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    return allUsers;
  } catch (error) {
    throw error;
  }
};

export const getUserStats = async () => {
  try {
    const totalUsers = await db
      .select({ count: users.id })
      .from(users);

    const totalPassengers = await db
      .select({ count: passengers.id })
      .from(passengers);

    const totalDrivers = await db
      .select({ count: drivers.id })
      .from(drivers);

    const activeUsers = await db
      .select({ count: users.id })
      .from(users)
      .where(eq(users.isActive, true));

    return {
      totalUsers: totalUsers.length,
      totalPassengers: totalPassengers.length,
      totalDrivers: totalDrivers.length,
      activeUsers: activeUsers.length,
    };
  } catch (error) {
    throw error;
  }
};

export const deactivateUser = async (userId: string) => {
  try {
    const result = await db
      .update(users)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    return result[0];
  } catch (error) {
    throw error;
  }
};

export const activateUser = async (userId: string) => {
  try {
    const result = await db
      .update(users)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    return result[0];
  } catch (error) {
    throw error;
  }
};

export const verifyUser = async (userId: string) => {
  try {
    const result = await db
      .update(users)
      .set({ isVerified: true, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    return result[0];
  } catch (error) {
    throw error;
  }
};

