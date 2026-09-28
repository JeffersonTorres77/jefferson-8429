import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config';
import apiRouter from './routes';

const app: Application = express();

// Middlewares
app.use(cors({
  origin: config.clientOrigin,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', apiRouter);

export default app;
