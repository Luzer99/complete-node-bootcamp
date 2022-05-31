import mongoose from 'mongoose';

export interface UserSchema {
  _id?: mongoose.ObjectId;
  name: string;
  email: string;
  photo: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt: Date | number;
  passwordResetToken: string;
  passwordResetExpires: Date;
  role: string;
  correctPassword: (candidatePassword: string, userPassword: string) => boolean;
  changedPasswordAfter: (JWTTimestamp: number) => boolean;
  createPasswordResetToken: () => string;
}