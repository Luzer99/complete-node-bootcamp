import * as express from 'express';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from '../controllers/userController';

export const userRouter = express.Router();

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
