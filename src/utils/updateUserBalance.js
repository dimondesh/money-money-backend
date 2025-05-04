import User from '../models/User.js';
import createHttpError from 'http-errors';

export const addUserBalance = async (userId, amount) => {
  await User.findByIdAndUpdate(userId, { $inc: { balance: amount } });
};

export const subtractUserBalance = async (userId, amount) => {
  const user = await User.findById(userId);
  await User.findByIdAndUpdate(userId, { $inc: { balance: -amount } });
  

  if (!user) throw createHttpError.NotFound('Користувача не знайдено');

  if (user.balance - amount < 0) {
    throw createHttpError.BadRequest('Недостатньо коштів для цієї витрати');
  }

  user.balance -= amount;
  await user.save();
};
