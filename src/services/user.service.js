import createHttpError from 'http-errors';
import User from '../models/User.js';

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  return user;
};
