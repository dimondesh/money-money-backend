import { Router } from 'express';
import authRouter from './auth.routes.js';
import userRouter from './user.routes.js';
import transactionRouter from './transactions.routes.js';
import statisticsRouter from './statistics.routes.js';
import categoriesRouter from './categories.routes.js';

const router = Router();

router.use('/auth', authRouter);

router.use('/users', userRouter);

router.use('/transactions', transactionRouter);

router.use('/statistics', statisticsRouter);

router.use('/categories', categoriesRouter);

export default router;
