import { Request, Response } from 'express';
import { registerUser, loginUser, getUserById } from '../services/authService';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, phone, password, firstName, lastName, role, language } = req.body;

    if (!email || !phone || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await registerUser({
      email,
      phone,
      password,
      firstName,
      lastName,
      role,
      language,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await loginUser({ email, password });

    res.status(200).json({
      message: 'Login successful',
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await getUserById(req.user.userId);

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        language: user.language,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

