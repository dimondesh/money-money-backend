import mongoose from 'mongoose';
import { Transaction } from '../models/Transaction.js';

export const getSummaryByPeriod = async (userId, year, month) => {
  const matchStage = {
    userId: new mongoose.Types.ObjectId(userId),
    year: Number(year),
  };

  if (month) {
    matchStage.month = Number(month);
  }

  const summary = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: {
          $gte: new Date(`${year}-${month || '01'}-01`),
          $lt: new Date(`${year}-${month || '12'}-31T23:59:59`),
        },
      },
    },
    {
      $group: {
        _id: { type: '$type', category: '$category' },
        total: { $sum: '$sum' },
      },
    },
    {
      $group: {
        _id: '$_id.type',
        categories: {
          $push: {
            category: '$_id.category',
            total: '$total',
          },
        },
        totalSum: { $sum: '$total' },
      },
    },
    {
      $project: {
        type: '$_id',
        categories: 1,
        totalSum: 1,
        _id: 0,
      },
    },
  ]);

  return summary;
};
