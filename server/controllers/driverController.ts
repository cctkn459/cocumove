import { Request, Response } from 'express';
import { registerDriver, addVehicle, getDriverStats } from '../services/driverService';
import { getDriverRides, updateRide } from '../services/rideService';

export const registerNewDriver = async (req: Request, res: Response) => {
  try {
    const {
      cedulaNumber,
      cedulaFrontPhoto,
      cedulaBackPhoto,
      licenseNumber,
      licensePhoto,
      backgroundCheckCertificate,
      backgroundCheckDate,
    } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (
      !cedulaNumber ||
      !cedulaFrontPhoto ||
      !cedulaBackPhoto ||
      !licenseNumber ||
      !licensePhoto ||
      !backgroundCheckCertificate
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const driver = await registerDriver({
      userId: req.user.userId,
      cedulaNumber,
      cedulaFrontPhoto,
      cedulaBackPhoto,
      licenseNumber,
      licensePhoto,
      backgroundCheckCertificate,
      backgroundCheckDate: backgroundCheckDate ? new Date(backgroundCheckDate) : undefined,
    });

    res.status(201).json({
      message: 'Driver registered successfully',
      driver,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const registerVehicle = async (req: Request, res: Response) => {
  try {
    const {
      licensePlate,
      make,
      model,
      year,
      color,
      seats,
      insuranceProvider,
      insurancePolicyNumber,
      insuranceExpiryDate,
      insuranceDocument,
      registrationDocument,
      vehiclePhoto,
    } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (
      !licensePlate ||
      !make ||
      !model ||
      !year ||
      !color ||
      !insuranceProvider ||
      !insurancePolicyNumber ||
      !insuranceExpiryDate ||
      !insuranceDocument ||
      !registrationDocument
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Aquí necesitaríamos obtener el driverId del usuario
    // Por ahora, esto es un placeholder
    const vehicle = await addVehicle({
      driverId: 'placeholder-driver-id',
      licensePlate,
      make,
      model,
      year,
      color,
      seats: seats || 4,
      insuranceProvider,
      insurancePolicyNumber,
      insuranceExpiryDate: new Date(insuranceExpiryDate),
      insuranceDocument,
      registrationDocument,
      vehiclePhoto,
    });

    res.status(201).json({
      message: 'Vehicle registered successfully',
      vehicle,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getMyRides = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Placeholder - necesitaría obtener driverId del usuario
    const rides = await getDriverRides('placeholder-driver-id');

    res.status(200).json({
      rides,
      total: rides.length,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const acceptRide = async (req: Request, res: Response) => {
  try {
    const { rideId } = req.params;

    if (!rideId) {
      return res.status(400).json({ error: 'Ride ID is required' });
    }

    const ride = await updateRide(rideId, {
      status: 'accepted',
      driverId: req.user?.userId,
    });

    res.status(200).json({
      message: 'Ride accepted successfully',
      ride,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const startRide = async (req: Request, res: Response) => {
  try {
    const { rideId } = req.params;

    if (!rideId) {
      return res.status(400).json({ error: 'Ride ID is required' });
    }

    const ride = await updateRide(rideId, {
      status: 'in_progress',
    });

    res.status(200).json({
      message: 'Ride started successfully',
      ride,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const completeRide = async (req: Request, res: Response) => {
  try {
    const { rideId } = req.params;
    const { fare, distance, duration, paymentMethod } = req.body;

    if (!rideId) {
      return res.status(400).json({ error: 'Ride ID is required' });
    }

    const ride = await updateRide(rideId, {
      status: 'completed',
      fare,
      distance,
      duration,
      paymentMethod,
    });

    res.status(200).json({
      message: 'Ride completed successfully',
      ride,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getDriverDashboard = async (req: Request, res: Response) => {
  try {
    const stats = await getDriverStats();

    res.status(200).json({
      stats,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

