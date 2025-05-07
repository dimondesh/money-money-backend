import Joi from 'joi';

export const registerUserSchema = Joi.object({
  username: Joi.string().required().max(32),
  email: Joi.string().email().max(32).required(),
  password: Joi.string().min(8).max(24).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().max(32),
  password: Joi.string().required().min(8).max(24),
});
