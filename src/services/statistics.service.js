import { categories } from '../constants/index.js';
import { Transaction } from '../models/Transaction.js';
import createHttpError from 'http-errors';

// Список категорій витрат
// const expenseCategories = [
//   'Main expenses',
//   'Products',
//   'Car',
//   'Self care',
//   'Child care',
//   'Household products',
//   'Education',
//   'Leisure',
//   'Other expenses',
//   'Entertainment',
// ];

// Отримати статистику витрат і надходжень
export const getStatisticsService = async (userId, month, year) => {
  // Перевірка, чи маємо правильний формат для month та year
  if (!month || !year || isNaN(month) || isNaN(year)) {
    throw createHttpError(400, 'Invalid month or year format');
  }

  // Додаємо провірку для формату місяця
  if (month < 10) {
    month = `0${month}`;
  }

  // Перевірка, чи місяць в діапазоні від 1 до 12
  if (month < 1 || month > 12) {
    throw createHttpError(400, 'Month must be between 1 and 12');
  }

  // Перевірка, чи рік в діапазоні від 1900 до поточного року
  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) {
    throw createHttpError(400, 'Year must be between 1900 and current year');
  }

  // Формуємо правильні дати для діапазону
  const startDate = new Date(`${year}-${month}-01T00:00:00Z`);
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1); // Кінець місяця

  // Перевірка на правильність конвертації в дати
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw createHttpError(400, 'Invalid date range');
  }

  // Пошук всіх транзакцій вказаного користувача за місяць
  const transactions = await Transaction.find({
    userId,
    date: { $gte: startDate, $lt: endDate },
  });

  if (!transactions || transactions.length === 0) {
    throw createHttpError(404, 'No transactions found for the given period');
  }

  let income = 0;
  let totalExpenses = 0;
  let expenses = {};

  // Обчислюємо суму доходів і витрат по категоріях
  transactions.forEach((transaction) => {
    if (transaction.type === 'income') {
      income += transaction.sum;
    } else if (transaction.type === 'expense') {
      if (categories.includes(transaction.categoryId)) {
        if (!expenses[transaction.categoryId]) {
          expenses[transaction.categoryId] = 0;
        }
        expenses[transaction.categoryId] += transaction.sum;
        totalExpenses += transaction.sum; // Загальна сума витрат
      }
    }
  });

  // Повертаємо результат із загальними доходами, витратами та витратами по категоріях
  return {
    status: 200,
    message: 'Statistics retrieved successfully',
    data: {
      income,
      totalExpenses,
      expenses,
    },
  };
};
