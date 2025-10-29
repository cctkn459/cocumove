import { Request, Response } from 'express';
import { registerPassenger, getPassengerByUserId, updatePassengerProfile } from '../services/passengerService';
import { createRide, getPassengerRides, updateRide } from '../services/rideService';

export const registerNewPassenger = async (req: Request, res: Response) => {
  try {
    const { cedulaNumber, cedulaFrontPhoto, cedulaBackPhoto, emergencyContact, emergencyPhone } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!cedulaNumber || !cedulaFrontPhoto || !cedulaBackPhoto) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const passenger = await registerPassenger({
      userId: req.user.userId,
      cedulaNumber,
      cedulaFrontPhoto,
      cedulaBackPhoto,
      emergencyContact,
      emergencyPhone,
    });

    res.status(201).json({
      message: 'Passenger registered successfully',
      passenger,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getPassengerProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const passenger = await getPassengerByUserId(req.user.userId);

    if (!passenger) {
      return res.status(404).json({ error: 'Passenger not found' });
    }

    res.status(200).json({
      passenger,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updatePassengerInfo = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const passenger = await getPassengerByUserId(req.user.userId);

    if (!passenger) {
      return res.status(404).json({ error: 'Passenger not found' });
    }

    const updated = await updatePassengerProfile(passenger.id, req.body);

    res.status(200).json({
      message: 'Passenger updated successfully',
      passenger: updated,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const requestRide = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const passenger = await getPassengerByUserId(req.user.userId);

    if (!passenger) {
      return res.status(404).json({ error: 'Passenger not found' });
    }

    const { pickupLocation, pickupLatitude, pickupLongitude, dropoffLocation, dropoffLatitude, dropoffLongitude, scheduledAt } = req.body;

    if (!pickupLocation || !dropoffLocation) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const ride = await createRide({
      passengerId: passenger.id,
      pickupLocation,
      pickupLatitude,
      pickupLongitude,
      dropoffLocation,
      dropoffLatitude,
      dropoffLongitude,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
    });

    res.status(201).json({
      message: 'Ride requested successfully',
      ride,
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

    const passenger = await getPassengerByUserId(req.user.userId);

    if (!passenger) {
      return res.status(404).json({ error: 'Passenger not found' });
    }

    const rides = await getPassengerRides(passenger.id);

    res.status(200).json({
      rides,
      total: rides.length,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const cancelRide = async (req: Request, res: Response) => {
  try {
    const { rideId } = req.params;
    const { cancellationReason } = req.body;

    if (!rideId) {
      return res.status(400).json({ error: 'Ride ID is required' });
    }

    const ride = await updateRide(rideId, {
      status: 'cancelled',
    });

    res.status(200).json({
      message: 'Ride cancelled successfully',
      ride,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

