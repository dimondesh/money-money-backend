import { Transaction } from '../models/Transaction.js';
import createHttpError from 'http-errors';
import { addUserBalance, subtractUserBalance } from '../utils/updateUserBalance.js';
// Створити транзакцію
export const createTransactionService = async (req) => {
  const userId = req.userId;
  const { type, categoryId, sum, comment } = req.body;

  const newTransaction = await Transaction.create({
    userId,
    type,
    categoryId,
    sum,
    comment,
  });
if (newTransaction.type === 'income') {
    await addUserBalance(userId, newTransaction.sum);
  }
  if (newTransaction.type === 'expense') {
    await subtractUserBalance(userId, newTransaction.sum);
  }
  return newTransaction;
};

// Отримати всі транзакції користувача
export const getAllTransactionsService = async (req) => {
  const userId = req.userId;
  const transactions = await Transaction.find({ userId }).sort({
    createdAt: -1,
  });

  return transactions;
};

// Отримати одну транзакцію по ID
export const getTransactionByIdService = async (req) => {
  const userId = req.userId;
  const { id } = req.params;

  const transaction = await Transaction.findOne({ _id: id, userId });
  if (!transaction) throw createHttpError.NotFound('Transaction not found');

  return transaction;
};

// Оновити транзакцію
export const updateTransactionService = async (req) => {
  const userId = req.userId;
  const { id } = req.params;
  const updates = req.body;

  const updatedTransaction = await Transaction.findOneAndUpdate(
    { _id: id, userId },
    updates,
    { new: true },
  );

  if (!updatedTransaction)
    throw createHttpError.NotFound('Transaction not found');

  return updatedTransaction;
};

// Видалити транзакцію
export const deleteTransactionService = async (req) => {
  const userId = req.userId;
  const { id } = req.params;

  const deletedTransaction = await Transaction.findOneAndDelete({
    _id: id,
    userId,
  });
  if (!deletedTransaction)
    throw createHttpError.NotFound('Transaction not found');

  return { message: 'Transaction deleted successfully' };
};
