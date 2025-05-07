import Joi from 'joi';

export const registerUserSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().max(64).required(),
  password: Joi.string().min(8).max(64).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().max(32),
  password: Joi.string().required().max(24),
});
