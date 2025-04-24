import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pino from 'pino-http';

import authRoutes from './routes/auth.routes.js';
import transactionsRoutes from './routes/transactions.routes.js';
//import statisticsRoutes from './routes/statistics.routes.js';
//import currencyRoutes from './routes/currency.routes.js';

dotenv.config();

import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../docs/swagger.json'), 'utf-8'),
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionsRoutes);
//app.use('/api/statistics', statisticsRoutes);
//app.use('/api/currency', currencyRoutes);

export default app;
