import { Router } from 'express';
import authRouter from './auth.routes';
import userRouter from './user.routes';
import transactionRouter from './transactions.routes.js';
import statisticsRouter from './statistics.routes.js';

const router = Router();

router.use('/auth', authRouter);

router.use('/users', userRouter);

router.use('/transactions', transactionRouter);

router.use('/statistics', statisticsRouter);
