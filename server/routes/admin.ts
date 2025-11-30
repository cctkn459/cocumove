import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth';
import {
  getDashboard,
  getAllUsersList,
  getPendingDriversList,
  approveDriverRequest,
  rejectDriverRequest,
  deactivateUserAccount,
  activateUserAccount,
  verifyUserAccount,
} from '../controllers/adminController';

const router = Router();

// Proteger todas las rutas de admin
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

// Dashboard
router.get('/dashboard', getDashboard);

// Usuarios
router.get('/users', getAllUsersList);
router.post('/users/:userId/verify', verifyUserAccount);
router.post('/users/:userId/deactivate', deactivateUserAccount);
router.post('/users/:userId/activate', activateUserAccount);

// Conductores
router.get('/drivers/pending', getPendingDriversList);
router.post('/drivers/:driverId/approve', approveDriverRequest);
router.post('/drivers/:driverId/reject', rejectDriverRequest);

export default router;

