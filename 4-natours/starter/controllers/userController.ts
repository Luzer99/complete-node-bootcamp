import * as express from 'express';
import { User } from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';

export const getAllUsers = catchAsync(
  async (req: express.Request, res: express.Response) => {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  }
);

export const getUser = (req: express.Request, res: express.Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

export const createUser = (req: express.Request, res: express.Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

export const updateUser = (req: express.Request, res: express.Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

export const deleteUser = (req: express.Request, res: express.Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
