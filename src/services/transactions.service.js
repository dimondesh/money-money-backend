import { Transaction } from '../models/Transaction.js';
import createHttpError from 'http-errors';
import { addUserBalance, subtractUserBalance } from '../utils/updateUserBalance.js';
import User from '../models/User.js';

// Створити транзакцію
export const createTransactionService = async (req) => {
  const userId = req.userId;
  const { type, categoryId, sum, comment } = req.body;

  if (type === 'expense') {
    const user = await User.findById(userId);
    if (!user) throw createHttpError.NotFound('User not found');
   
  }

  const newTransaction = await Transaction.create({
    userId,
    type,
    categoryId,
    sum,
    comment,
  });

  if (type === 'income') {
    await addUserBalance(userId, sum);
  } else {
    await subtractUserBalance(userId, sum);
  }

  return newTransaction;
};

// Отримати всі транзакції користувача
export const getAllTransactionsService = async (req) => {
  const userId = req.userId;
  return await Transaction.find({ userId }).sort({ createdAt: -1 });
};

// Отримати одну транзакцію
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

  const old = await Transaction.findOne({ _id: id, userId });
  if (!old) throw createHttpError.NotFound('Transaction not found');

  const oldSum = old.sum;
  const oldType = old.type;

  const newSum = updates.sum !== undefined ? updates.sum : old.sum;
  const newType = updates.type || old.type;

  
  if (oldType === 'income') {
    await subtractUserBalance(userId, oldSum);
  } else {
    await addUserBalance(userId, oldSum);
  }

  if (newType === 'expense') {
    const user = await User.findById(userId);
    if (!user) throw createHttpError.NotFound('User not found');
    if (user.balance - newSum < 0) {
     
      if (oldType === 'income') {
        await addUserBalance(userId, oldSum);
      } else {
        await subtractUserBalance(userId, oldSum);
      }
      
    }
  }

  const updated = await Transaction.findOneAndUpdate(
    { _id: id, userId },
    updates,
    { new: true }
  );
  if (!updated) throw createHttpError.NotFound('Transaction not found');


  if (newType === 'income') {
    await addUserBalance(userId, newSum);
  } else {
    await subtractUserBalance(userId, newSum);
  }

  return updated;
};

// Видалити транзакцію
export const deleteTransactionService = async (req) => {
  const userId = req.userId;
  const { id } = req.params;

  const transaction = await Transaction.findOne({ _id: id, userId });
  if (!transaction) {
    return createHttpError.NotFound('Transaction not found');
  }

 
  if (transaction.type === 'income') {
    await subtractUserBalance(userId, transaction.sum);
  } else if (transaction.type === 'expense') {
    await addUserBalance(userId, transaction.sum);
  }

 
  await Transaction.deleteOne({ _id: id, userId });

  return { message: 'Transaction deleted successfully' };
};
