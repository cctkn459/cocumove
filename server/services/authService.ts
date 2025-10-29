import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

export interface RegisterInput {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'passenger' | 'driver';
  language?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const registerUser = async (input: RegisterInput) => {
  try {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(input.password);

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        email: input.email,
        phone: input.phone,
        password: hashedPassword,
        firstName: input.firstName,
        lastName: input.lastName,
        role: input.role as any,
        language: (input.language || 'es') as any,
      })
      .returning();

    return newUser[0];
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (input: LoginInput) => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);

    if (user.length === 0) {
      throw new Error('User not found');
    }

    const foundUser = user[0];
    const passwordMatch = await comparePassword(input.password, foundUser.password);

    if (!passwordMatch) {
      throw new Error('Invalid password');
    }

    const token = generateToken({
      userId: foundUser.id,
      email: foundUser.email,
      role: foundUser.role as any,
    });

    return {
      token,
      user: {
        id: foundUser.id,
        email: foundUser.email,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        role: foundUser.role,
        language: foundUser.language,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (userId: string) => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      throw new Error('User not found');
    }

    return user[0];
  } catch (error) {
    throw error;
  }
};

