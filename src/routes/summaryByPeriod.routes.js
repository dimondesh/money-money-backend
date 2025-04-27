import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getSummaryByPeriodController } from '../controllers/summaryByPeriod.controller.js';

const router = Router();

router.get('/', auth, ctrlWrapper(getSummaryByPeriodController));

export default router;
