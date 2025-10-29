import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth';
import {
  registerNewDriver,
  registerVehicle,
  getMyRides,
  acceptRide,
  startRide,
  completeRide,
  getDriverDashboard,
} from '../controllers/driverController';

const router = Router();

// Rutas públicas
router.post('/register', authMiddleware, registerNewDriver);

// Rutas protegidas para conductores
router.use(authMiddleware);
router.use(roleMiddleware(['driver']));

router.post('/vehicle/register', registerVehicle);
router.get('/dashboard', getDriverDashboard);
router.get('/rides', getMyRides);
router.post('/rides/:rideId/accept', acceptRide);
router.post('/rides/:rideId/start', startRide);
router.post('/rides/:rideId/complete', completeRide);

export default router;

