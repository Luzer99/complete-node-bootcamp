import { app } from './app';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import { TourSchema } from './types';
import { Tour } from './models/tourModel';

process.on('uncaughtException', (err: Error) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! SHUTING DOWN...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

mongoose.connect(process.env.DATABASE);

const port = Number(process.env.PORT) || 3000;

const server = app.listen(port, '127.0.0.1', () => {
  console.log('Server is listening on: http://localhost:3000');
});

process.on('unhandledRejection', (err: Error) => {
  console.log(err);
  console.log('UNHANDLED REJECTION! SHUTING DOWN...');
  server.close(() => {
    process.exit(1);
  });
});