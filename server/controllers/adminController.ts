import { Request, Response } from 'express';
import { getAllUsers, getUserStats, deactivateUser, activateUser, verifyUser } from '../services/userService';
import { getPendingDrivers, approveDriver, rejectDriver, getDriverStats } from '../services/driverService';
import { getRideStats } from '../services/rideService';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const userStats = await getUserStats();
    const driverStats = await getDriverStats();
    const rideStats = await getRideStats();

    res.status(200).json({
      dashboard: {
        users: userStats,
        drivers: driverStats,
        rides: rideStats,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsersList = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      users,
      total: users.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPendingDriversList = async (req: Request, res: Response) => {
  try {
    const drivers = await getPendingDrivers();

    res.status(200).json({
      drivers,
      total: drivers.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const approveDriverRequest = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;

    if (!driverId) {
      return res.status(400).json({ error: 'Driver ID is required' });
    }

    const driver = await approveDriver(driverId);

    res.status(200).json({
      message: 'Driver approved successfully',
      driver,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const rejectDriverRequest = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;

    if (!driverId) {
      return res.status(400).json({ error: 'Driver ID is required' });
    }

    const driver = await rejectDriver(driverId);

    res.status(200).json({
      message: 'Driver rejected successfully',
      driver,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deactivateUserAccount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await deactivateUser(userId);

    res.status(200).json({
      message: 'User deactivated successfully',
      user,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const activateUserAccount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await activateUser(userId);

    res.status(200).json({
      message: 'User activated successfully',
      user,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyUserAccount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await verifyUser(userId);

    res.status(200).json({
      message: 'User verified successfully',
      user,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

