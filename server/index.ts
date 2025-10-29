import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import passengerRoutes from './routes/passenger';
import driverRoutes from './routes/driver';
import tokenRoutes from './routes/tokens';
import uploadRoutes from './routes/upload';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/passenger', passengerRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'COCUMOVE API is running' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: Request, res: Response) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`COCUMOVE API running on http://localhost:${port}`);
});

export default app;

