import { Types } from 'mongoose';
import { TourSchema } from './tour-schema';

export interface TourEntity extends TourSchema {
  _id: Types.ObjectId;
  __v?: number;
}
