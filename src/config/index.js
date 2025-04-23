import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

if (!MONGO_URI) {
  throw new Error(' MONGO_URI is not defined in .env');
}

export { MONGO_URI, PORT };

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const ONE_DAY = 24 * 60 * 60 * 1000;

export const JWT_SECRET = process.env.JWT_SECRET;
