

import createHttpError from "http-errors";
import bcrypt from "bcrypt";

import { SessionsCollection } from "../models/session.js";
import User from "../models/User.js";
import crypto from "node:crypto"; 

// Импортируем константы, добавляя .js в конце пути
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js'; // <-- ИЗМЕНЕНИЕ ЗДЕСЬ

// eslint-disable-next-line no-unused-vars
import dotenv from 'dotenv';

// dotenv.config({ path: './.env' });

export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });
  if (user !== null) {
    throw createHttpError.Conflict("Email in use");
  }
  payload.password = await bcrypt.hash(payload.password, 10);

  return User.create(payload);
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError.Unauthorized("Invalid login or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw createHttpError.Unauthorized("Invalid login or password");
  }

  

  await SessionsCollection.deleteOne({ userId: user._id });

  const newSession = await SessionsCollection.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString("base64"),
    refreshToken: crypto.randomBytes(30).toString("base64"),
    accessTokenValidUntil: new Date(Date.now() + 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 120 * 1000),
  });

  return newSession;
}

export async function logoutUser(sessionId, refreshToken) {
  const session = await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });
  if (session.deletedCount === 0) {
    throw createHttpError.Unauthorized("Invalid session or refresh token");
  }
  return undefined;
}


export async function refreshSession(sessionId, refreshToken) {

  const currentSession = await SessionsCollection.findOne({ _id: sessionId, refreshToken });
 
  if (!currentSession) {
    
    throw createHttpError.Unauthorized("Session not found");
  }
  if (currentSession.refreshTokenValidUntil < new Date()) {
    logoutUser(sessionId, refreshToken);
    throw createHttpError.Unauthorized("Session expired");
  }

  await SessionsCollection.deleteOne({ _id: currentSession._id, refreshToken: currentSession.refreshToken });


  return SessionsCollection.create({
    userId: currentSession.userId,
    accessToken: crypto.randomBytes(30).toString("base64"),
    refreshToken: crypto.randomBytes(30).toString("base64"),
    accessTokenValidUntil: new Date(Date.now() + 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 120 * 1000),
  });
}