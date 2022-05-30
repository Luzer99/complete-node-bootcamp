import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import { TourSchema } from '../../types';
import { Tour } from '../../models/tourModel';
import { readFileSync } from 'fs';

dotenv.config({ path: './config.env' });

const tours: TourSchema[] = JSON.parse(
  readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

mongoose.connect(process.env.DATABASE);

export const importData = async () => {
  try {
    await Tour.create(tours);
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

export const deleteData = async () => {
  try {
    await Tour.deleteMany();
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
