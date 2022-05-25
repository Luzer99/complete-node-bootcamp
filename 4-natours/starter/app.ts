import * as express from 'express';
import * as morgan from 'morgan';
import { tourRouter } from './routes/tourRoutes';
import { userRouter } from './routes/userRoutes';

export const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
  console.log('Hello from the middleware ✋');
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);