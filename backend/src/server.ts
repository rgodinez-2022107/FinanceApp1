import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/env';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'financial-login-backend' });
});

// Rutas de autenticación (login + rutas protegidas de ejemplo)
app.use('/api/auth', authRoutes);

// 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Recurso no encontrado.' });
});

app.listen(config.port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${config.port}`);
  console.log(`Usuario predeterminado: ${config.admin.email}`);
});
