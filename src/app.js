import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pino from 'pino-http';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import router from './routes/index.js';

dotenv.config();

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
    origin: ['http://localhost:5173', 'https://money-money-rouge.vercel.app'],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use((req, res, next) => {
  res.cookie('example', 'value', {
    httpOnly: true,
    secure: true, // This requires HTTPS
    sameSite: 'None', // Important for cross-site cookies
  });
  next();
});

app.use(express.json());

app.use('/api', router);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
