import { app } from './app';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import { TourSchema } from './types';
import { Tour } from './models/tourModel';

dotenv.config({ path: './config.env' });

(async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
  } catch (err) {
    console.log(`Something went wrong! ${err.message}`);
  }
})();

const port = Number(process.env.PORT) || 3000;

app.listen(port, '127.0.0.1', () => {
  console.log('Server is listening on: http://localhost:3000');
});
