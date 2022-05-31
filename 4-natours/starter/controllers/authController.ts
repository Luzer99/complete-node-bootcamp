import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import mongoose from 'mongoose';
import { promisify } from 'util';
import { User } from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';
import { sendEmail } from '../utils/email';
import { ValidationError } from '../utils/error';

const signToken = (id: mongoose.ObjectId) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

export const signup = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const newUser = await User.create({
      name: String(req.body.name),
      email: String(req.body.email),
      password: String(req.body.password),
      passwordConfirm: String(req.body.passwordConfirm),
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  }
);

export const login = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { email, password } = req.body;

    // 1) check if email and password exists
    if (!email || !password) {
      return next(
        new ValidationError('Please provide email and password', 400)
      );
    }

    // 2) check if user exists and password is correctly
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new ValidationError('Incorrect email or password', 400));
    }

    // 3) if al its ok send token to client
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
    });
  }
);

export const protect = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let token: string;
    // 1. Getting token and check of it's there
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new ValidationError(
          'You are not logged in! Please log in to get access.',
          401
        )
      );
    }

    // 2. Verification Token
    const decoded: jwt.JwtPayload = await (promisify(jwt.verify) as any)(
      token,
      process.env.JWT_SECRET
    );
    console.log(decoded);

    // 3. Check if user still exist
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new ValidationError(
          'The user belonging to this tokes does no longer exist.',
          401
        )
      );
    }

    // 4. Check if user changed password after the token was issued
    if (!currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new ValidationError(
          'User recently changed password! Please log in again',
          401
        )
      );
    }

    (req as any).user = currentUser;
    next();
  }
);

export const restrictTo = (...roles: string[]) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!roles.includes((req as any).user.role)) {
      return next(
        new ValidationError(
          'You do not have permission to perform this action',
          403
        )
      );
    }
    next();
  };
};

export const forgotPassword = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  //1) Get user based on POSTed email address
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ValidationError('There is no user with email address.', 404)
    );
  }

  //2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n If you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new ValidationError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
};

export const resetPassword = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  //1 get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  //2 if token has not expired, and there is user, set the new password
  if (!user) {
    return next(new ValidationError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //3 update changedPasswordAt property for the users

  //4 log the user in, send JWT
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
};
