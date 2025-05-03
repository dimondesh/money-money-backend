import createHttpError from 'http-errors';
import User from '../models/User.js';


export const addUserBalance = async (userId, newBalance) => {
    const user = await User.findById(userId);
    if (!user) throw createHttpError(404, 'User not found');
  
    user.balance += newBalance;
    await user.save();
  
    return user;
  };
export const subtractUserBalance = async (userId, newBalance) => {
    const user = await User.findById(userId);
    if (!user) throw createHttpError(404, 'User not found');
  
    user.balance -= newBalance;
    await user.save();
  
    return user;
  };