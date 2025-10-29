import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth';
import {
  getMyWallet,
  getMyTransactions,
  addTokensToWallet,
  subtractTokensFromWallet,
  getTokenStats,
} from '../controllers/tokenController';

const router = Router();

// Rutas protegidas
router.use(authMiddleware);

// Rutas para usuarios
router.get('/wallet', getMyWallet);
router.get('/transactions', getMyTransactions);
router.post('/add', addTokensToWallet);
router.post('/subtract', subtractTokensFromWallet);

// Rutas para administrador
router.get('/stats', roleMiddleware(['admin']), getTokenStats);

export default router;

