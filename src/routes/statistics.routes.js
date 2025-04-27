import express from 'express';
import {
  getUserStatistics
} from '../controllers/statistics.controller.js';

import auth from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(auth); 

router.get('/', getUserStatistics); // отримання статистики

export default router;
