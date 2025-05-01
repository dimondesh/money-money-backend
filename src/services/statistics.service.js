import { Transaction } from '../models/Transaction.js';
import createHttpError from 'http-errors';

// Список категорій витрат
const expenseCategories = [
  "Main expenses", "Products", "Car", "Self care", "Child care",
  "Household products", "Education", "Leisure", "Other expenses", "Entertainment"
];

// Отримати статистику витрат і надходжень
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

  // Дата початку та кінця місяця
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 1));

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw createHttpError(400, 'Invalid date range');
  }

  const transactions = await Transaction.find({
    userId,
    date: { $gte: startDate, $lt: endDate }
  });

  if (!transactions || transactions.length === 0) {
    throw createHttpError(404, 'No transactions found for the given period');
  }

  let income = 0;
  let totalExpenses = 0;
  const expensesMap = {};

  // Ініціалізація всіх категорій нулем
  for (const category of expenseCategories) {
    expensesMap[category] = 0;
  }

  for (const tx of transactions) {
    if (tx.type === 'income') {
      income += tx.sum;
    } else if (tx.type === 'expense' && expenseCategories.includes(tx.category)) {
      expensesMap[tx.category] += tx.sum;
      totalExpenses += tx.sum;
    }
  }

  const expensesArray = Object.entries(expensesMap).map(([category, total]) => ({
    category,
    total
  }));

  return {
    status: 'success',
    message: 'Statistics retrieved successfully',
    date: new Date().toISOString(),
    data: {
      income,
      totalExpenses,
      expenses: expensesArray
    }
  };
};
