import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';

import User from '../models/User.js';
import { SessionsCollection } from '../models/session.js';
//import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createHttpError(401, 'Unauthorized');

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const session = await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    //accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    //refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });

  return {
    user,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    accessTokenExpires: session.accessTokenValidUntil,
    refreshTokenExpires: session.refreshTokenValidUntil,
  };
};
