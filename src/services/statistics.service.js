import { categories } from '../constants/index.js';
import { Transaction } from '../models/Transaction.js';
import createHttpError from 'http-errors';

export const getStatisticsService = async (userId, month, year) => {
  if (!month || !year || isNaN(month) || isNaN(year)) {
    throw createHttpError(400, 'Invalid month or year format');
  }

  month = Number(month);
  year = Number(year);

  if (month < 1 || month > 12) {
    throw createHttpError(400, 'Month must be between 1 and 12');
  }

  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) {
    throw createHttpError(400, 'Year must be between 1900 and current year');
  }

  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 1));

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw createHttpError(400, 'Invalid date range');
  }

  const transactions = await Transaction.find({
    userId,
    date: { $gte: startDate, $lt: endDate },
  });

  if (!transactions || transactions.length === 0) {
    throw createHttpError(404, 'No transactions found for the given period');
  }

  let income = 0;
  let totalExpenses = 0;

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const expenseMap = {};

  // Ініціалізуємо map з назвами категорій
  for (const cat of expenseCategories) {
    expenseMap[cat.id] = { category: cat.name, total: 0 };
  }

  for (const tx of transactions) {
    if (tx.type === 'income') {
      income += tx.sum;
    } else if (tx.type === 'expense' && expenseMap[tx.categoryId]) {
      expenseMap[tx.categoryId].total += tx.sum;
      totalExpenses += tx.sum;
    }
  }

  const expenses = Object.values(expenseMap);

  return {
    status: 'success',
    message: 'Statistics retrieved successfully',
    date: new Date().toISOString(),
    data: {
      income,
      totalExpenses,
      expenses,
    },
  };
};
