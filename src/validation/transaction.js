import Joi from 'joi';

export const addTransactionsSchema = Joi.object({
  comment: Joi.string().allow(''),
  type: Joi.string().valid('income', 'expense').required(),
  categoryId: Joi.string().required(),
  sum: Joi.number().min(0).required(),
  date: Joi.date(),
});

export const editTransactionsSchema = Joi.object({
  comment: Joi.string(),
  type: Joi.string().valid('income', 'expense'),
  categoryId: Joi.string(),
  sum: Joi.number().min(0),
  date: Joi.date(),
});

// згідно з models/Transaction.js
