import createHttpError from 'http-errors';
import { SessionsCollection } from '../models/session.js';

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header missing'));
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Authorization format must be: Bearer <token>'));
  }

  try {
    const session = await SessionsCollection.findOne({ accessToken: token });

    if (!session) {
      return next(createHttpError(401, 'Invalid or expired token'));
    }

    if (session.accessTokenValidUntil < new Date()) {
      return next(createHttpError(401, 'Access token expired'));
    }

    req.userId = session.userId;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return next(createHttpError(500, 'Internal server error'));
  }
};

export default auth;
