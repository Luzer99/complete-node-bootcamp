import * as express from 'express';
import { Tour } from '../models/tourModel';
import { TourEntity } from '../types';

// const tours: TourEntity[] = JSON.parse(
//   readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
// );

// export const checkId = (req: express.Request, res: express.Response, next: express.NextFunction, val: string) => {
//   const id = Number(val);

//   if (id > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }

//   next(); // allow to execute next middleware
// }

export const checkBody = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }

  next();
};

export const getAllTours = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const tours: TourEntity[] = await Tour.find();

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const getTour = async (req: express.Request, res: express.Response) => {
  try {
    const tour: TourEntity = await Tour.findById(req.params.id);
    //Tour.findOne({_id: req.params.id, });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const createTour = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const newTour = await Tour.create(req.body);
    await newTour.save();

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const updateTour = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const tour: TourEntity = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const deleteTour = async (req: express.Request, res: express.Response) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
