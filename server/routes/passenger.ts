import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth';
import {
  registerNewPassenger,
  getPassengerProfile,
  updatePassengerInfo,
  requestRide,
  getMyRides,
  cancelRide,
} from '../controllers/passengerController';

const router = Router();

// Rutas públicas
router.post('/register', authMiddleware, registerNewPassenger);

// Rutas protegidas para pasajeros
router.use(authMiddleware);
router.use(roleMiddleware(['passenger']));

router.get('/profile', getPassengerProfile);
router.put('/profile', updatePassengerInfo);
router.post('/rides/request', requestRide);
router.get('/rides', getMyRides);
router.post('/rides/:rideId/cancel', cancelRide);

export default router;

