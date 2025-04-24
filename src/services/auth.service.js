import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import {SessionsCollection} from "../models/session.js";
import crypto from "node:crypto";

import dotenv from 'dotenv';
dotenv.config({ path: './.env' });




export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });
  if (user !== null) {
    throw createHttpError.Conflict("Email in use");
  }
  payload.password = await bcrypt.hash(payload.password, 10,);


  return User.create(payload);
}







export async function loginUser(email, password) {
  const user = await User.findOne({ email });
  

  if (!user) {
    throw createHttpError.Unauthorized("Invalid login or password");

  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log(isMatch);

  if (!isMatch) {
    throw createHttpError.Unauthorized("Invalid login or password");
  }

  await SessionsCollection.deleteOne({ user: user._id });

  return SessionsCollection.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString("base64"),
    refreshToken: crypto.randomBytes(30).toString("base64"),
    accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
}






export async function logoutUser(sessionId, refreshToken) {
  const session = await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });
  if (!session) {
    throw createHttpError.Unauthorized("Invalid session or refresh token");
  }
  return undefined;
}