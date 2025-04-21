import mongoose from 'mongoose';
import app from './app.js';
import { MONGO_URI, PORT } from './config/index.js';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(' MongoDB connected');
    app.listen(PORT, () => {
      console.log(` Server running at: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' MongoDB connection error:', err.message);
    process.exit(1);
  });
