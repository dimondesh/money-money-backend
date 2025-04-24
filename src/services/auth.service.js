import bcrypt from 'bcrypt';
// import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';

import User from '../models/User.js';
// import { SessionsCollection } from '../models/session.js';
// import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { generateToken } from '../utils/token.js';

export const registerUser = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  const newUser = await User.create({
    ...payload,
    password: encryptedPassword,
    balance: 0,
  });

  const token = generateToken(newUser._id.toString());

  return {
    user: {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      balance: newUser.balance,
    },
    token,
  };
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) throw createHttpError(401, 'User not found');

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) throw createHttpError(401, 'Invalid credentials');

  const token = generateToken(user._id.toString());

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      balance: user.balance,
    },
    token,
  };
};
