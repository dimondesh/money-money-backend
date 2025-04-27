import express from 'express';
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactions.controller.js';

import auth from '../middlewares/auth.middleware.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.use(auth);

router.post('/', ctrlWrapper(createTransaction));
router.get('/', ctrlWrapper(getAllTransactions));
router.get('/:id', ctrlWrapper(getTransactionById));
router.patch('/:id', ctrlWrapper(updateTransaction));
router.delete('/:id', ctrlWrapper(deleteTransaction));

export default router;
