import { Transaction } from '../models/Transaction.js';
import createHttpError from 'http-errors';

// Словник відповідності ID → Назва категорії
const categoryMap = {
  'da8d0a6d-60c9-4cc5-be1e-34680e6a181d': 'Main expenses',
  '677d8aac-12a3-467c-8c1c-5493bae43996': 'Products',
  '89707abe-6aec-45d5-a10c-3d8ddf1b6851': 'Car',
  'd12ba90e-10ae-4862-a9bb-ff4dcb09c177': 'Self care',
  'b9b1159e-d14b-4f50-a500-f937af5b2438': 'Child care',
  '661da941-3c7a-4921-9e8a-7b466a546a18': 'Household products',
  'a5b7487c-d5c9-4099-9266-ca2fe93a796e': 'Education',
  '9c4c46b1-7687-40f2-8923-a98903b24062': 'Leisure',
  'b580ddd9-ae63-4258-b860-e4fa2b8fa25a': 'Other expenses',
  '7350db95-89fc-43bd-9a71-1e5bf4e6bf4e': 'Entertainment',
  'c15023f1-5812-42b2-93c3-54d66c539e5b': 'Income',
};

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

  const transactions = await Transaction.find({
    userId,
    date: { $gte: startDate, $lt: endDate },
  });

  if (!transactions || transactions.length === 0) {
    throw createHttpError(404, 'No transactions found for the given period');
  }

  let income = 0;
  let totalExpenses = 0;
  const expensesMap = {};

  // Ініціалізуємо нульові значення для витрат
  for (const id in categoryMap) {
    const name = categoryMap[id];
    if (name !== 'Income') {
      expensesMap[name] = 0;
    }
  }

  for (const tx of transactions) {
    const categoryName = categoryMap[tx.categoryId] || 'Unknown';

    if (tx.type === 'income') {
      income += tx.sum;
    } else if (tx.type === 'expense') {
      expensesMap[categoryName] = (expensesMap[categoryName] || 0) + tx.sum;
      totalExpenses += tx.sum;
    }
  }

  const expensesArray = Object.entries(expensesMap).map(([category, total]) => ({
    category,
    total,
  }));

  return {
    status: 'success',
    message: 'Statistics retrieved successfully',
    date: new Date().toISOString(),
    data: {
      income,
      totalExpenses,
      expenses: expensesArray,
    },
  };
};
