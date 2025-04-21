// import dotenv from 'dotenv';

// dotenv.config();

// export const MONGO_URI = process.env.MONGO_URI;
// export const PORT = process.env.PORT || 27017;

// if (!MONGO_URI) {
//   throw new Error('MONGO_URI is not defined in .env');
// }
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

if (!MONGO_URI) {
  throw new Error(' MONGO_URI is not defined in .env');
}

export { MONGO_URI, PORT };
