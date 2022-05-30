import * as express from 'express';
import * as morgan from 'morgan';
import { handleError } from './controllers/errorController';
import { tourRouter } from './routes/tourRoutes';
import { userRouter } from './routes/userRoutes';
import { ValidationError } from './utils/error';

export const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(
    new ValidationError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(handleError);
