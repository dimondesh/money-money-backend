import dotenv from 'dotenv';

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT || 5000;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined in .env');
}
