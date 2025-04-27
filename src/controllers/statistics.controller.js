import { getStatisticsService } from '../services/statistics.service.js';

export const getUserStatistics = async (req, res, next) => {
  try {
    const { month, year } = req.query; // період передається через query params
    const statistics = await getStatisticsService(req.userId, month, year);
    res.status(200).json(statistics);
  } catch (error) {
    next(error);
  }
};
