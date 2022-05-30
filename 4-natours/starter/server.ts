import { app } from './app';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import { TourSchema } from './types';
import { Tour } from './models/tourModel';

dotenv.config({ path: './config.env' });

mongoose.connect(process.env.DATABASE);

const port = Number(process.env.PORT) || 3000;

app.listen(port, '127.0.0.1', () => {
  console.log('Server is listening on: http://localhost:3000');
});
