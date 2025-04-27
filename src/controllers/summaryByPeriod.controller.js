import createHttpError from 'http-errors';
import { getSummaryByPeriod } from '../services/summaryByPeriod.service.js';

export const getSummaryByPeriodController = async (req, res, next) => {
  try {
    const { year, month } = req.query;

    if (!req.userId) {
      throw createHttpError(401, 'User not authenticated');
    }

    if (!year) {
      throw createHttpError(400, 'Year is required');
    }

    const summary = await getSummaryByPeriod(req.userId, year, month);

    res.status(200).json({
      status: 200,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};
