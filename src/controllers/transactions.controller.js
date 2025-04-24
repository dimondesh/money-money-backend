import { Transaction } from '../models/Transaction.js';

export const createTransaction = async (req, res, next) => {
  try {
    const userId = req.user._id; 
    const { type, category, sum, comment } = req.body;

    const newTransaction = await Transaction.create({
      userId,
      type,
      category,
      sum,
      comment,
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    next(error);
  }
};
