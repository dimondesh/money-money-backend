import { Transaction } from '../models/Transaction.js';
import createHttpError from 'http-errors';
import { addUserBalance, subtractUserBalance } from '../utils/updateUserBalance.js';
import User from '../models/User.js';



// Створити транзакцію



export const createTransactionService = async (req) => {
  const userId = req.userId;
  const { type, categoryId, sum, comment } = req.body;

  // Перевіряємо баланс перед створенням витрати
  if (type === 'expense') {
    const user = await User.findById(userId);
    if (user.balance - sum < 0) {
      throw createHttpError.BadRequest('Balance cannot be negative');
    }
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
  } else if (type === 'expense') {
    await subtractUserBalance(userId, sum);
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

  const oldTransaction = await Transaction.findOne({ _id: id, userId });
  if (!oldTransaction) throw createHttpError.NotFound('Transaction not found');

 
  if (oldTransaction.type === 'income') {
    await subtractUserBalance(userId, oldTransaction.sum);
  } else if (oldTransaction.type === 'expense') {
    await addUserBalance(userId, oldTransaction.sum);
  }


  if (updates.type === 'expense') {
    const user = await User.findById(userId);
    if (user.balance - updates.sum < 0) {
   
      if (oldTransaction.type === 'income') {
        await addUserBalance(userId, oldTransaction.sum);
      } else if (oldTransaction.type === 'expense') {
        await subtractUserBalance(userId, oldTransaction.sum);
      }
      throw createHttpError.BadRequest('Balance cannot be negative');
    }
  }

  const updatedTransaction = await Transaction.findOneAndUpdate(
    { _id: id, userId },
    updates,
    { new: true }
  );

  if (!updatedTransaction) throw createHttpError.NotFound('Transaction not found');

 
  if (updatedTransaction.type === 'income') {
    await addUserBalance(userId, updatedTransaction.sum);
  } else if (updatedTransaction.type === 'expense') {
    await subtractUserBalance(userId, updatedTransaction.sum);
  }

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

  if (!deletedTransaction) throw createHttpError.NotFound('Transaction not found');

  if (deletedTransaction.type === 'income') {
    await subtractUserBalance(userId, deletedTransaction.sum);
  } else if (deletedTransaction.type === 'expense') {
    await addUserBalance(userId, deletedTransaction.sum);
  }

  return { message: 'Transaction deleted successfully' };
};
