import * as express from 'express';
import { checkBody, createTour, deleteTour, getAllTours, getTour, updateTour } from '../controllers/tourController';

export const tourRouter = express.Router();

// tourRouter.param('id', (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);
//   next();
// });

// tourRouter.param('id', checkId);

tourRouter.route('/').get(getAllTours).post(checkBody, createTour);

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);