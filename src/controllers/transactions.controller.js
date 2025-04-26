import {
  createTransactionService,
  getAllTransactionsService,
  getTransactionByIdService,
  updateTransactionService,
  deleteTransactionService,
} from '../services/transactions.service.js';

export const createTransaction = async (req, res, next) => {
  try {
    const newTransaction = await createTransactionService(req);
    res.status(201).json(newTransaction);
  } catch (error) {
    next(error);
  }
};

export const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await getAllTransactionsService(req);
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await getTransactionByIdService(req);
    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const updatedTransaction = await updateTransactionService(req);
    res.status(200).json(updatedTransaction);
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const result = await deleteTransactionService(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
