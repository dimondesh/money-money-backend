import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: { type: String, enum: ['income', 'expense'], required: true },
    categoryId: { type: String, required: true },
    sum: { type: Number, required: true },
    comment: { type: String, default: '' },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false },
);

export const Transaction = mongoose.model('Transaction', transactionSchema);
